import type { Metadata } from "next";
import toolsData from "@/data/tools.json";
import ToolPageClient from "./client";

const TOOLS_MAP = Object.fromEntries(toolsData.map((t) => [t.id, t]));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = TOOLS_MAP[id];
  if (!tool) return { title: "Not Found" };
  return {
    title: tool.title,
    description: tool.desc,
    openGraph: {
      title: `${tool.title} | adalahcredit`,
      description: tool.desc,
      images: tool.images?.[0] ? [{ url: tool.images[0] }] : [{ url: "/og.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.desc,
      images: tool.images?.[0] ? [tool.images[0]] : ["/og.png"],
    },
  };
}

export default function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  return <ToolPageClient params={params} />;
}
