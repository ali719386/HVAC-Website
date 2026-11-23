import type { FaqInput } from "@/content/types";

// TODO: confirm answers match the client's actual policies.
export const faqs: FaqInput[] = [
  {
    question: "How quickly can you get a technician to my home?",
    answer:
      "Availability depends on the season and call volume. Call us and we will give you the earliest available arrival window.",
    placeholder: true,
  },
  {
    question: "Do you charge a diagnostic fee?",
    answer: "Ask our team when you book. We will tell you any diagnostic or trip fee up front, before the visit.",
    placeholder: true,
  },
  {
    question: "Should I repair or replace my air conditioner?",
    answer:
      "It depends on the age of the system, the cost of the repair and how often it has failed. Our technicians lay out both options so you can decide.",
    placeholder: true,
  },
  {
    question: "How often should I change my air filter?",
    answer:
      "Standard 1-inch filters are usually changed every 1 to 3 months. Homes with pets or allergies may need more frequent changes.",
    placeholder: true,
  },
  {
    question: "Do you work on all equipment brands?",
    answer: "We service most major residential and light commercial brands. Ask us if you are unsure about your system.",
    placeholder: true,
  },
];
