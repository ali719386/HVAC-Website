import type { ProcessStepInput } from "@/content/types";

// TODO: confirm each step matches how the client actually schedules and quotes work.
export const processSteps: ProcessStepInput[] = [
  {
    icon: "phone",
    title: "Call or book online",
    body: "Tell us what is going on and when works for you.",
    placeholder: true,
  },
  {
    icon: "calendar",
    title: "We confirm a time",
    body: "Our team confirms your arrival window before the visit.",
    placeholder: true,
  },
  {
    icon: "gauge",
    title: "Diagnosis",
    body: "A technician checks the system and explains what they find.",
    placeholder: true,
  },
  {
    icon: "clipboard",
    title: "Clear options",
    body: "You get the options and costs in writing before any work starts.",
    placeholder: true,
  },
  {
    icon: "check",
    title: "Work done right",
    body: "We complete the work, test the system and clean up.",
    placeholder: true,
  },
];
