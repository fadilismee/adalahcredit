import { MetadataRoute } from "next";
import toolsData from "@/data/tools.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = toolsData.map((tool) => ({
    url: `https://adalahcredit.vercel.app/post/${tool.id}`,
    lastModified: tool.date || new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://adalahcredit.vercel.app",
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 1,
    },
    ...tools,
  ];
}
