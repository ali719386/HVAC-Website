import type { FaqInput } from "@/content/types";

// TODO: confirm every answer matches the client's actual policies, permits process and warranty terms.
export const projectFaqs: FaqInput[] = [
  {
    question: "How long does a typical installation take?",
    answer:
      "Most single-system replacements in a home take one to two days. Larger or commercial projects take longer. We give you an expected timeline in writing before work starts.",
    placeholder: true,
  },
  {
    question: "Do you handle permits?",
    answer: "When a permit is required for your project, we tell you up front and explain how it is handled before work begins.",
    placeholder: true,
  },
  {
    question: "What warranty comes with a new system?",
    answer:
      "Equipment warranties are set by the manufacturer and usually require registration. Ask us for the exact equipment and labor warranty terms for your project before you sign.",
    placeholder: true,
  },
  {
    question: "Is financing available for a project?",
    answer: "Financing may be available for qualifying customers, subject to credit approval. Ask our team for current options.",
    placeholder: true,
  },
  {
    question: "Will you clean up when the job is done?",
    answer: "Yes. We protect floors in work areas, remove old equipment and clean up before we leave.",
    placeholder: true,
  },
];
