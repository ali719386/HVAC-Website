import type { ProcessStepInput } from "@/content/types";

// TODO: placeholder process for the example brand.
export const processSteps: ProcessStepInput[] = [
  { icon: "calendar", title: "Request a visit", body: "Book online or call during business hours.", placeholder: true },
  { icon: "home", title: "Home assessment", body: "We look at the equipment, ducts and how the home is used.", placeholder: true },
  { icon: "clipboard", title: "Written proposal", body: "Options and costs in writing before any work starts.", placeholder: true },
  { icon: "check", title: "Install and walkthrough", body: "We finish the work and show you how to run the system.", placeholder: true },
];
