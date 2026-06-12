#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const https = require("https");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GH_TOKEN = process.env.GITHUB_TOKEN;
const REPO_PATH = path.resolve(__dirname, "..");
const TOOLS_JSON = path.join(REPO_PATH, "src/data/tools.json");
const PUBLIC_IMG = path.join(REPO_PATH, "public/img");
const TELEGRAM_SUPPORT_LINK = {
  label: "Join Telegram Untuk Ajukan Pertanyaan",
  url: "https://t.me/+LP7nrF5aYa04ZGU9",
};
const MAX_IMAGES = 5;

const CATEGORIES = ["AI Tools", "Design", "Web Dev", "Productivity", "SEO", "Writing"];
const TAGS = ["Popular", "New", "Essential", "Dev", "Terbatas", "Limited", "Promo"];
const FEATURES_PRESET = ["Free trial", "No VPN needed", "Multi account", "Premium access", "Unlimited usage"];
const COLORS = ["from-emerald-500/20 to-teal-500/10", "from-violet-500/20 to-purple-500/10", "from-blue-500/20 to-cyan-500/10", "from-amber-500/20 to-orange-500/10", "from-rose-500/20 to-pink-500/10", "from-indigo-500/20 to-blue-500/10", "from-sky-500/20 to-blue-500/10", "from-fuchsia-500/20 to-pink-500/10"];

// ─── Telegram API ─────────────────────────────────────────────────
function tg(method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({ hostname: "api.telegram.org", path: `/bot${BOT_TOKEN}/${method}`, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } }, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => resolve(JSON.parse(buf)));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function send(chatId, text, reply_markup) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...(reply_markup ? { reply_markup } : {}) });
}

function answer(cbId, text) {
  return tg("answerCallbackQuery", { callback_query_id: cbId, text });
}

function editMsg(chatId, msgId, text, reply_markup) {
  return tg("editMessageText", { chat_id: chatId, message_id: msgId, text, parse_mode: "HTML", ...(reply_markup ? { reply_markup } : {}) });
}

function downloadFile(fileId) {
  return new Promise(async (resolve, reject) => {
    const { result } = await tg("getFile", { file_id: fileId });
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.file_path}`;
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), ext: path.extname(result.file_path) || ".jpg" }));
      res.on("error", reject);
    });
  });
}

function btn(text, data) { return { text, callback_data: data }; }
function inlineKb(rows) { return { inline_keyboard: rows }; }

// ─── Sessions ─────────────────────────────────────────────────────
const sessions = {};
function S(chatId) { if (!sessions[chatId]) sessions[chatId] = { step: "idle", data: {} }; return sessions[chatId]; }

// ─── Message Handler ──────────────────────────────────────────────
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const s = S(chatId);

  if (text === "/start") {
    sessions[chatId] = { step: "idle", data: {} };
    return send(chatId, "👋 <b>adalahcredit Bot</b>\n\nPilih aksi:", inlineKb([
      [btn("➕ Add Tool", "act_add")],
      [btn("✏️ Edit Tool", "act_edit")],
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  if (text === "/cancel") { sessions[chatId] = { step: "idle", data: {} }; return send(chatId, "❌ Dibatalkan."); }

  // Step handling
  switch (s.step) {
    case "title":
      s.data.title = text;
      s.step = "body";
      return send(chatId, "📄 Kirim <b>deskripsi lengkap</b> (body text):\n\n<i>Deskripsi singkat akan diambil dari 100 karakter pertama body.</i>", inlineKb([[btn("❌ Cancel", "act_cancel")]]));

    case "body":
      s.data.body = text;
      s.data.desc = text.substring(0, 100) + (text.length > 100 ? "..." : "");
      s.step = "category";
      return send(chatId, "📂 Pilih <b>kategori</b>:", inlineKb([
        ...CATEGORIES.map(c => [btn(c, `cat_${c}`)]),
        [btn("❌ Cancel", "act_cancel")]
      ]));

    case "features_custom":
      s.data.features.push(text);
      return send(chatId, `✅ Ditambahkan: "${text}"\n\nTotal: ${s.data.features.length} fitur`, inlineKb([
        [btn("➕ Tambah lagi", "feat_more")],
        [btn("✅ Selesai → Foto", "feat_done")],
        [btn("❌ Cancel", "act_cancel")]
      ]));

    case "images":
      if (msg.photo) {
        if (s.data.images.length >= MAX_IMAGES) return send(chatId, `Maks ${MAX_IMAGES} foto.`, inlineKb([[btn("✅ Selesai → Link", "img_done")]]));
        const photo = msg.photo[msg.photo.length - 1];
        try {
          const { buffer, ext } = await downloadFile(photo.file_id);
          if (!fs.existsSync(PUBLIC_IMG)) fs.mkdirSync(PUBLIC_IMG, { recursive: true });
          const slug = s.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
          const filename = `${slug}-${s.data.images.length + 1}${ext}`;
          fs.writeFileSync(path.join(PUBLIC_IMG, filename), buffer);
          s.data.images.push(`/img/${filename}`);
          return send(chatId, `🖼 Foto ${s.data.images.length}/${MAX_IMAGES} tersimpan.`, inlineKb([
            [btn("✅ Selesai → Link", "img_done")],
            [btn("❌ Cancel", "act_cancel")]
          ]));
        } catch (e) { return send(chatId, "❌ Gagal. Coba lagi."); }
      }
      return send(chatId, "Kirim foto.", inlineKb([[btn("✅ Selesai → Link", "img_done")], [btn("❌ Cancel", "act_cancel")]]));

    case "links":
      s.data.links = text.split("\n").map(line => {
        const [label, url] = line.split("|").map(s => s.trim());
        return { label: label || "Link", url: url || label };
      }).filter(l => l.url);
      return showPreview(chatId);

    case "edit_body":
      s.editTool.body = text;
      s.editTool.desc = text.substring(0, 100) + (text.length > 100 ? "..." : "");
      s.step = "idle";
      saveTool(s.editTool);
      return send(chatId, "✅ Body updated & pushed!", inlineKb([[btn("🏠 Menu", "act_start")]]));

    case "edit_links":
      s.editTool.links = text.split("\n").map(line => {
        const [label, url] = line.split("|").map(s => s.trim());
        return { label: label || "Link", url: url || label };
      }).filter(l => l.url);
      s.step = "idle";
      saveTool(s.editTool);
      return send(chatId, "✅ Links updated & pushed!", inlineKb([[btn("🏠 Menu", "act_start")]]));
  }
}

// ─── Callback Handler ─────────────────────────────────────────────
async function handleCallback(cb) {
  const chatId = cb.message.chat.id;
  const msgId = cb.message.message_id;
  const data = cb.data;
  const s = S(chatId);

  await answer(cb.id);

  // Actions
  if (data === "act_start") {
    sessions[chatId] = { step: "idle", data: {} };
    return editMsg(chatId, msgId, "👋 <b>adalahcredit Bot</b>\n\nPilih aksi:", inlineKb([
      [btn("➕ Add Tool", "act_add")],
      [btn("✏️ Edit Tool", "act_edit")],
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  if (data === "act_add") {
    sessions[chatId] = { step: "title", data: { images: [], links: [], features: [] } };
    return editMsg(chatId, msgId, "🛠 <b>Add Tool</b>\n\nKirim <b>judul</b> tool:", inlineKb([[btn("❌ Cancel", "act_cancel")]]));
  }

  if (data === "act_cancel") {
    sessions[chatId] = { step: "idle", data: {} };
    return editMsg(chatId, msgId, "❌ Dibatalkan.", inlineKb([[btn("🏠 Menu", "act_start")]]));
  }

  // Category selection
  if (data.startsWith("cat_")) {
    s.data.category = data.slice(4);
    s.step = "tag";
    return editMsg(chatId, msgId, `📂 ${s.data.category}\n\n🏷 Pilih <b>tag</b>:`, inlineKb([
      ...TAGS.map(t => [btn(t, `tag_${t}`)]),
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  // Tag selection
  if (data.startsWith("tag_")) {
    s.data.tag = data.slice(4);
    s.step = "features";
    return editMsg(chatId, msgId, `🏷 ${s.data.tag}\n\n✅ Pilih <b>fitur</b> (tap untuk tambah):`, inlineKb([
      ...FEATURES_PRESET.map((f, i) => [btn(f, `feat_${i}`)]),
      [btn("✍️ Tulis sendiri", "feat_custom")],
      [btn("✅ Selesai → Foto", "feat_done")],
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  // Feature selection
  if (data.startsWith("feat_") && data !== "feat_done" && data !== "feat_custom" && data !== "feat_more") {
    const idx = parseInt(data.slice(5));
    const feat = FEATURES_PRESET[idx];
    if (!s.data.features.includes(feat)) s.data.features.push(feat);
    return answer(cb.id, `✅ ${feat}`);
  }
  if (data === "feat_custom" || data === "feat_more") {
    s.step = "features_custom";
    return send(chatId, "✍️ Ketik fitur custom:");
  }
  if (data === "feat_done") {
    if (s.data.features.length === 0) s.data.features.push("Free access");
    s.step = "images";
    return send(chatId, `✅ ${s.data.features.length} fitur.\n\n🖼 Kirim <b>foto</b> (1-5):`, inlineKb([
      [btn("✅ Selesai → Link", "img_done")],
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  // Images done
  if (data === "img_done") {
    s.step = "links";
    return send(chatId, "🔗 Kirim <b>link</b> (format: Label | URL)\nSatu per baris.\n\nContoh:\nOpen Tool | https://example.com", inlineKb([[btn("❌ Cancel", "act_cancel")]]));
  }

  // Publish
  if (data === "act_publish") {
    try {
      await publishTool(s.data);
      sessions[chatId] = { step: "idle", data: {} };
      return editMsg(chatId, msgId, "🚀 <b>Published!</b>\n\nVercel auto-deploy dalam beberapa detik.", inlineKb([[btn("➕ Tambah lagi", "act_add")], [btn("🏠 Menu", "act_start")]]));
    } catch (e) { return send(chatId, `❌ Error: ${e.message}`); }
  }

  // ─── Edit flow ────────────────────────────────────────────────
  if (data === "act_edit") {
    const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
    const rows = tools.slice(0, 8).map(t => [btn(`${t.title.substring(0, 30)}`, `edit_${t.id}`)]);
    rows.push([btn("❌ Cancel", "act_cancel")]);
    return editMsg(chatId, msgId, "✏️ Pilih tool untuk edit:", inlineKb(rows));
  }

  if (data.startsWith("edit_")) {
    const id = data.slice(5);
    const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
    const tool = tools.find(t => t.id === id);
    if (!tool) return send(chatId, "Not found.");
    s.editTool = tool;
    return editMsg(chatId, msgId, `✏️ <b>${tool.title}</b>\n\nEdit apa?`, inlineKb([
      [btn("📂 Category", `edfield_cat`), btn("🏷 Tag", `edfield_tag`)],
      [btn("📄 Body/Desc", `edfield_body`), btn("🔗 Links", `edfield_links`)],
      [btn("🗑 Delete", `edfield_delete`)],
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }

  if (data === "edfield_cat") {
    return editMsg(chatId, msgId, "📂 Pilih kategori baru:", inlineKb([
      ...CATEGORIES.map(c => [btn(c, `edcat_${c}`)]),
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }
  if (data.startsWith("edcat_")) {
    s.editTool.category = data.slice(6);
    saveTool(s.editTool);
    return editMsg(chatId, msgId, `✅ Category → ${s.editTool.category}. Pushed!`, inlineKb([[btn("🏠 Menu", "act_start")]]));
  }

  if (data === "edfield_tag") {
    return editMsg(chatId, msgId, "🏷 Pilih tag baru:", inlineKb([
      ...TAGS.map(t => [btn(t, `edtag_${t}`)]),
      [btn("❌ Cancel", "act_cancel")]
    ]));
  }
  if (data.startsWith("edtag_")) {
    s.editTool.tag = data.slice(6);
    saveTool(s.editTool);
    return editMsg(chatId, msgId, `✅ Tag → ${s.editTool.tag}. Pushed!`, inlineKb([[btn("🏠 Menu", "act_start")]]));
  }

  if (data === "edfield_body") {
    s.step = "edit_body";
    return send(chatId, "📄 Kirim body/desc baru:");
  }

  if (data === "edfield_links") {
    s.step = "edit_links";
    return send(chatId, "🔗 Kirim links baru (Label | URL per baris):");
  }

  if (data === "edfield_delete") {
    const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
    const filtered = tools.filter(t => t.id !== s.editTool.id);
    fs.writeFileSync(TOOLS_JSON, JSON.stringify(filtered, null, 2) + "\n");
    gitPush(`delete tool - ${s.editTool.title}`);
    sessions[chatId] = { step: "idle", data: {} };
    return editMsg(chatId, msgId, `🗑 Deleted: ${s.editTool.title}`, inlineKb([[btn("🏠 Menu", "act_start")]]));
  }
}

// ─── Preview ──────────────────────────────────────────────────────
function showPreview(chatId) {
  const s = S(chatId);
  const d = s.data;
  const text = `<b>📋 Preview</b>\n\n<b>${d.title}</b>\n📂 ${d.category} • 🏷 ${d.tag}\n\n${d.desc}\n\n✅ ${d.features.length} fitur\n🖼 ${d.images.length} gambar\n🔗 ${d.links.length} link`;
  return send(chatId, text, inlineKb([
    [btn("🚀 Publish", "act_publish")],
    [btn("❌ Cancel", "act_cancel")]
  ]));
}

// ─── Publish & Save ───────────────────────────────────────────────
function publishTool(data) {
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
  const newId = String(Math.max(...tools.map(t => parseInt(t.id)), 0) + 1);
  if ((data.images || []).length > MAX_IMAGES) {
    throw new Error(`Maksimal ${MAX_IMAGES} gambar.`);
  }
  const links = Array.isArray(data.links) ? [...data.links] : [];
  if (!links.some((link) => link.url === TELEGRAM_SUPPORT_LINK.url)) {
    links.unshift(TELEGRAM_SUPPORT_LINK);
  }
  tools.unshift({
    id: newId, title: data.title, category: data.category, tag: data.tag,
    date: new Date().toISOString().split("T")[0], desc: data.desc, body: data.body,
    features: data.features, images: data.images, links,
    color: COLORS[tools.length % COLORS.length],
  });
  fs.writeFileSync(TOOLS_JSON, JSON.stringify(tools, null, 2) + "\n");
  gitPush(`add tool - ${data.title}`);
}

function saveTool(tool) {
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
  const idx = tools.findIndex(t => t.id === tool.id);
  const links = Array.isArray(tool.links) ? [...tool.links] : [];
  if (!links.some((link) => link.url === TELEGRAM_SUPPORT_LINK.url)) {
    links.unshift(TELEGRAM_SUPPORT_LINK);
  }
  const updatedTool = { ...tool, links };
  if (idx >= 0) tools[idx] = updatedTool;
  fs.writeFileSync(TOOLS_JSON, JSON.stringify(tools, null, 2) + "\n");
  gitPush(`edit tool - ${tool.title}`);
}

function gitPush(msg) {
  execSync("git add -A", { cwd: REPO_PATH });
  execSync(`git commit -m "feat: ${msg}"`, { cwd: REPO_PATH });
  execSync(`git push https://${GH_TOKEN}@github.com/fadilismee/adalahcredit.git main`, { cwd: REPO_PATH });
}

// ─── Polling ──────────────────────────────────────────────────────
let offset = 0;
async function poll() {
  try {
    const { result } = await tg("getUpdates", { offset, timeout: 30 });
    if (result && result.length) {
      for (const update of result) {
        offset = update.update_id + 1;
        if (update.callback_query) await handleCallback(update.callback_query);
        else if (update.message) await handleMessage(update.message);
      }
    }
  } catch (e) { console.error("Poll error:", e.message); }
  poll();
}

console.log("🤖 Bot running... send /start");
poll();
