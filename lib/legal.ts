import type { BrandConfig } from "@/lib/brand/schema";
import { SMS_CONSENT_VERSION, smsConsentText } from "@/lib/lead/constants";

/*
 * DRAFT legal templates generated from brand config.
 * They are starting points only, NOT legal advice, and make no compliance claims.
 * An attorney must review them before production (set config.legal.reviewed = true afterwards).
 */

export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[] };
export type LegalDoc = { title: string; description: string; intro: string; sections: LegalSection[] };

function contactLines(c: BrandConfig["company"]): string[] {
  return [
    c.legalName,
    `${c.address.street}, ${c.address.city}, ${c.address.state} ${c.address.zip}`,
    `Phone: ${c.phone.display}`,
    `Email: ${c.email}`,
  ];
}

/** `aiChat`: the website assistant sends typed questions to an AI provider (GEMINI_API_KEY set). */
export function privacyDoc({ company, chatbot }: BrandConfig, aiChat = false): LegalDoc {
  const n = company.name;
  const chatSection: LegalSection[] = chatbot.enabled
    ? [
        {
          heading: "Website assistant",
          paragraphs: [
            aiChat
              ? "Questions you type into the website assistant, with the recent messages of that chat, are sent to an AI service provider (Google Gemini) to generate an answer from the content of this website. Please do not enter personal, payment or health information in the chat. Your conversation is kept only in your browser tab and is cleared when you refresh the chat or close the tab."
              : "The website assistant answers from the content of this website inside your browser. Your conversation is kept only in your browser tab and is cleared when you refresh the chat or close the tab.",
          ],
        },
      ]
    : [];
  return {
    title: "Privacy Policy",
    description: `How ${n} collects, uses and shares information submitted through this website.`,
    intro: `This Privacy Policy explains how ${company.legalName} ("${n}", "we", "us") handles information collected through this website.`,
    sections: [
      {
        heading: "Information we collect",
        paragraphs: ["When you submit a service request or contact form, we collect the information you provide, which may include:"],
        list: [
          "Name, phone number, email address and service address or ZIP code",
          "Details about the service you need, urgency and preferred appointment time",
          "Whether you agreed to receive text messages, the version of the consent wording shown, and the time of submission",
          "The page from which the form was submitted",
        ],
      },
      {
        heading: "Information collected automatically",
        paragraphs: [
          "Like most websites, our hosting provider may log technical information such as IP address, browser type and pages requested for security and operation of the site. Your IP address may be used briefly to limit repeated form submissions.",
          "If bot protection is enabled on our forms, a security provider may process technical signals from your browser to tell people from automated traffic.",
        ],
      },
      {
        heading: "How we use information",
        list: [
          "To respond to your request, schedule and perform service, and send estimates",
          "To send text messages about your request if you opted in",
          "To protect the website against spam and abuse",
          "To meet legal, tax and accounting obligations",
        ],
      },
      ...chatSection,
      {
        heading: "How we share information",
        paragraphs: [
          "We do not sell your personal information. We share it only with service providers that help us operate, such as website hosting, email delivery and customer management tools, and only as needed to provide our services, or when required by law.",
          "Mobile opt-in data and consent for text messages are not shared with third parties for their marketing purposes.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: ["We keep information for as long as needed for the purposes above, including record-keeping requirements."],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can ask us to access, correct or delete the personal information we hold about you by contacting us using the details below. Depending on your state of residence you may have additional rights.",
          "You can opt out of text messages at any time by replying STOP.",
        ],
      },
      {
        heading: "Children",
        paragraphs: ["This website is not directed to children under 13, and we do not knowingly collect their information."],
      },
      {
        heading: "Changes to this policy",
        paragraphs: ["We may update this policy. The effective date at the top of the page shows when it last changed."],
      },
      { heading: "Contact us", list: contactLines(company) },
    ],
  };
}

export function termsDoc(config: BrandConfig): LegalDoc {
  const { company } = config;
  const state = config.legal.governingState ?? company.address.state;
  return {
    title: "Terms of Service",
    description: `Terms that apply to use of the ${company.name} website.`,
    intro: `These Terms govern your use of this website operated by ${company.legalName}. By using the site you agree to these Terms.`,
    sections: [
      {
        heading: "Website information",
        paragraphs: [
          "Content on this website is for general information about our services. It is not a quote or a guarantee of availability, pricing or results. Service details, pricing and warranties are confirmed in writing before work begins.",
        ],
      },
      {
        heading: "Service requests",
        paragraphs: [
          "Submitting a form does not confirm an appointment. We will contact you to confirm scheduling. For emergencies involving gas smells or carbon monoxide alarms, leave the building and call 911 or your gas utility first.",
        ],
      },
      {
        heading: "Financing and promotions",
        paragraphs: [
          "Any financing is provided by third-party lenders, subject to credit approval and the lender's terms. Promotions are subject to the conditions stated with each offer and may change or end without notice.",
        ],
      },
      {
        heading: "Third-party names and links",
        paragraphs: [
          "Equipment brand names mentioned on this site are trademarks of their owners and do not imply endorsement. Links to other websites are provided for convenience; we are not responsible for their content.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "To the extent permitted by law, the website is provided \"as is\" without warranties of any kind, and we are not liable for damages arising from use of the website.",
        ],
      },
      { heading: "Governing law", paragraphs: [`These Terms are governed by the laws of the State of ${state}.`] },
      { heading: "Contact", list: contactLines(company) },
    ],
  };
}

export function smsDoc({ company }: BrandConfig): LegalDoc {
  return {
    title: "SMS Terms & Consent",
    description: `How text messaging from ${company.name} works and how to opt out.`,
    intro: `${company.name} may send text messages related to your service request if you opt in on our website forms. Opting in is optional and is not required to request service.`,
    sections: [
      {
        heading: "Consent wording shown on our forms",
        paragraphs: [`"${smsConsentText(company.name)}"`, `Consent wording version: ${SMS_CONSENT_VERSION}.`],
      },
      {
        heading: "Types of messages",
        list: ["Appointment confirmations and reminders", "Technician arrival updates", "Follow-up about estimates you requested"],
      },
      {
        heading: "Frequency and costs",
        paragraphs: ["Message frequency varies based on your service activity. Message and data rates may apply depending on your mobile plan."],
      },
      {
        heading: "How to opt out or get help",
        list: [
          "Reply STOP to any message to stop receiving texts. You will receive one confirmation message.",
          "Reply HELP for help, or contact us using the details below.",
        ],
      },
      {
        heading: "Carriers",
        paragraphs: ["Carriers are not liable for delayed or undelivered messages."],
      },
      {
        heading: "Privacy",
        paragraphs: [
          "Phone numbers and consent records are used only to communicate with you about your service and are not shared with third parties for their marketing. See our Privacy Policy for details.",
        ],
      },
      { heading: "Contact", list: contactLines(company) },
    ],
  };
}
