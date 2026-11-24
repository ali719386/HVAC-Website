import { getBrand } from "@/lib/brand";
import { buildChatData } from "@/lib/chatbot";

export const dynamic = "force-static";

/**
 * Website assistant knowledge (topics, ZIPs and every site passage), generated at build time from
 * the brand's content. Loaded by the chat panel only when a visitor opens it, so pages stay light.
 */
export function GET() {
  const brand = getBrand();
  if (!brand.config.chatbot.enabled) return Response.json({ entries: [], quick: [], zips: {}, docs: [] });
  return Response.json(buildChatData(brand), { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } });
}
