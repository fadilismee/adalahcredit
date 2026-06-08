#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const https = require("https");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GH_TOKEN = process.env.GH_TOKEN;
const REPO_PATH = path.resolve(__dirname, "..");
const TOOLS_JSON = path.join(REPO_PATH, "src/data/tools.json");
const PUBLIC_IMG = path.join(REPO_PATH, "public/img");

// ─── Telegram API ─────────────────────────────────────────────────
function tg(method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/${method}`,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    }, (res) => {
      let buf = "";
      res.on("data", (c) => (buf += c));
      res.on("end", () => resolve(JSON.parse(buf)));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function send(chatId, text, opts = {}) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", ...opts });
}

function downloadFile(fileId) {
  return new Promise(async (resolve, reject) => {
    const { result } = await tg("getFile", { file_id: fileId });
    const filePath = result.file_path;
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), ext: path.extname(filePath) || ".jpg" }));
      res.on("error", reject);
    });
  });
}

// ─── State machine ────────────────────────────────────────────────
const sessions = {};

const COLORS = [
  "from-emerald-500/20 to-teal-500/10",
  "from-violet-500/20 to-purple-500/10",
  "from-blue-500/20 to-cyan-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-indigo-500/20 to-blue-500/10",
  "from-sky-500/20 to-blue-500/10",
  "from-fuchsia-500/20 to-pink-500/10",
];

function getSession(chatId) {
  if (!sessions[chatId]) sessions[chatId] = { step: "idle", data: {} };
  return sessions[chatId];
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  const s = getSession(chatId);

  // Commands
  if (text === "/start" || text === "/newtool") {
    sessions[chatId] = { step: "title", data: { images: [], links: [] } };
    return send(chatId, "🛠 <b>Add New Tool</b>\n\nKirim <b>judul</b> tool:");
  }

  if (text === "/cancel") {
    sessions[chatId] = { step: "idle", data: {} };
    return send(chatId, "❌ Dibatalkan.");
  }

  // Step machine
  switch (s.step) {
    case "title":
      s.data.title = text;
      s.step = "category";
      return send(chatId, "📂 Kategori?\n(AI Tools / Design / Web Dev / Productivity / SEO / Writing)");

    case "category":
      s.data.category = text;
      s.step = "tag";
      return send(chatId, "🏷 Tag singkat? (misal: Popular, New, Essential, Dev)");

    case "tag":
      s.data.tag = text;
      s.step = "desc";
      return send(chatId, "📝 Deskripsi singkat (1 kalimat):");

    case "desc":
      s.data.desc = text;
      s.step = "body";
      return send(chatId, "📄 Deskripsi lengkap (paragraph):");

    case "body":
      s.data.body = text;
      s.step = "features";
      return send(chatId, "✅ Fitur-fitur gratis (satu per baris):\n\nContoh:\nUnlimited chat\nFile upload\nWeb browsing");

    case "features":
      s.data.features = text.split("\n").map((f) => f.trim()).filter(Boolean);
      s.step = "images";
      return send(chatId, `🖼 Kirim foto screenshot (1-5 gambar).\n\nSetelah selesai, ketik /done`);

    case "images":
      if (text === "/done") {
        if (s.data.images.length === 0) return send(chatId, "Minimal 1 foto. Kirim foto atau /cancel");
        s.step = "links";
        return send(chatId, "🔗 Kirim link (format: Label | URL)\nSatu per baris.\n\nContoh:\nOpen Tool | https://example.com\nDocs | https://docs.example.com");
      }
      // Handle photo
      if (msg.photo) {
        if (s.data.images.length >= 5) return send(chatId, "Maksimal 5 foto. Ketik /done untuk lanjut.");
        const photo = msg.photo[msg.photo.length - 1]; // highest res
        try {
          const { buffer, ext } = await downloadFile(photo.file_id);
          if (!fs.existsSync(PUBLIC_IMG)) fs.mkdirSync(PUBLIC_IMG, { recursive: true });
          const slug = s.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
          const filename = `${slug}-${s.data.images.length + 1}${ext}`;
          fs.writeFileSync(path.join(PUBLIC_IMG, filename), buffer);
          s.data.images.push(`/img/${filename}`);
          return send(chatId, `✅ Foto ${s.data.images.length} tersimpan. Kirim lagi atau /done`);
        } catch (e) {
          return send(chatId, "❌ Gagal download foto. Coba lagi.");
        }
      }
      return send(chatId, "Kirim foto atau ketik /done jika sudah.");

    case "links":
      s.data.links = text.split("\n").map((line) => {
        const [label, url] = line.split("|").map((s) => s.trim());
        return { label: label || "Link", url: url || label };
      }).filter((l) => l.url);
      s.step = "confirm";
      const preview = `<b>📋 Preview:</b>\n\n<b>${s.data.title}</b>\n📂 ${s.data.category} • 🏷 ${s.data.tag}\n\n${s.data.desc}\n\n✅ ${s.data.features.length} fitur\n🖼 ${s.data.images.length} gambar\n🔗 ${s.data.links.length} link\n\nKetik <b>/publish</b> untuk publish atau /cancel`;
      return send(chatId, preview);

    case "confirm":
      if (text === "/publish") {
        try {
          await publishTool(s.data);
          sessions[chatId] = { step: "idle", data: {} };
          return send(chatId, "🚀 <b>Published!</b> Tool berhasil ditambahkan dan dipush ke GitHub.\n\nVercel akan auto-deploy dalam beberapa detik.\n\nKetik /newtool untuk tambah lagi.");
        } catch (e) {
          return send(chatId, `❌ Error: ${e.message}`);
        }
      }
      return send(chatId, "Ketik /publish untuk publish atau /cancel untuk batal.");

    default:
      return send(chatId, "👋 Ketik /newtool untuk tambah tool baru.");
  }
}

// ─── Publish ──────────────────────────────────────────────────────
async function publishTool(data) {
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf-8"));
  const newId = String(Math.max(...tools.map((t) => parseInt(t.id)), 0) + 1);
  const color = COLORS[tools.length % COLORS.length];

  tools.push({
    id: newId,
    title: data.title,
    category: data.category,
    tag: data.tag,
    desc: data.desc,
    body: data.body,
    features: data.features,
    images: data.images,
    links: data.links,
    color,
  });

  fs.writeFileSync(TOOLS_JSON, JSON.stringify(tools, null, 2) + "\n");

  // Git commit & push
  execSync("git add -A", { cwd: REPO_PATH });
  execSync(`git commit -m "feat: add tool - ${data.title}"`, { cwd: REPO_PATH });
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
        if (update.message) await handleMessage(update.message);
      }
    }
  } catch (e) {
    console.error("Poll error:", e.message);
  }
  poll();
}

console.log("🤖 Bot running... /newtool to add a tool");
poll();
