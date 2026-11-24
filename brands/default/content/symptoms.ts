import type { SymptomInput } from "@/content/types";

/*
 * /services problem picker. action "book" opens /book with the service and message prefilled;
 * action "service" links to /services/<service>.
 * TODO: confirm the symptom list and wording with the client.
 */
export const symptoms: SymptomInput[] = [
  {
    id: "ac-not-cooling",
    label: "AC not cooling",
    icon: "snowflake",
    service: "ac-repair",
    action: "book",
    message: "My air conditioner is running but not cooling the house.",
    placeholder: true,
  },
  {
    id: "no-heat",
    label: "No heat",
    icon: "flame",
    service: "heating",
    action: "book",
    message: "My heating system is not producing heat.",
    placeholder: true,
  },
  {
    id: "strange-noises",
    label: "Strange noises",
    icon: "volume",
    service: "ac-repair",
    action: "book",
    message: "My HVAC system is making unusual noises.",
    placeholder: true,
  },
  {
    id: "high-energy-bill",
    label: "High energy bill",
    icon: "badge-dollar",
    service: "maintenance",
    action: "service",
    message: "My energy bills have gone up and I would like the system checked.",
    placeholder: true,
  },
  {
    id: "thermostat-issue",
    label: "Thermostat issue",
    icon: "thermometer",
    service: "ac-repair",
    action: "book",
    message: "My thermostat is not working correctly.",
    placeholder: true,
  },
];
