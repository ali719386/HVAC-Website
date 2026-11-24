import { getBrand } from "@/lib/brand";
import { buildChatData } from "@/lib/chatbot";
import { aiEnabled } from "@/lib/chat-ai";
import { assetExists } from "@/components/ui/brand-image";
import { Chatbot } from "./chatbot";
import { WhatsAppFloat } from "./whatsapp";

/**
 * Floating contact launcher. With the assistant enabled: a pill with the assistant and WhatsApp.
 * Without it: the WhatsApp button alone (when configured). Server Component; builds the knowledge base.
 */
export function SiteAssistant() {
  const brand = getBrand();
  const { config, content } = brand;
  const { company, chatbot } = config;
  if (!chatbot.enabled) return company.whatsapp ? <WhatsAppFloat config={company.whatsapp} /> : null;
  const fill = (s: string) => s.replaceAll("{company}", company.name);
  const c = content.copy.chatbot;
  const data = buildChatData(brand);
  return (
    <Chatbot
      quick={data.quick}
      // Small talk ships with the page so greetings work even before /assistant.json loads.
      basic={data.entries.filter((x) => x.id.startsWith("talk-"))}
      name={chatbot.name}
      avatar={assetExists(chatbot.avatar) ? chatbot.avatar : undefined}
      copy={{ ...c, welcome: fill(c.welcome), fallback: fill(c.fallback) }}
      phone={company.phone}
      whatsapp={company.whatsapp}
      bookLabel={content.copy.hero.primaryCta}
      // Read at build time for static pages: set GEMINI_API_KEY before building.
      ai={aiEnabled()}
    />
  );
}
