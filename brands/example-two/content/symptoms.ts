import type { SymptomInput } from "@/content/types";

// TODO: placeholder symptom list for the example brand.
export const symptoms: SymptomInput[] = [
  {
    id: "ac-not-cooling",
    label: "AC not cooling",
    icon: "snowflake",
    service: "ac-repair",
    action: "book",
    message: "My cooling system is running but the house is not cooling down.",
    placeholder: true,
  },
  {
    id: "no-heat",
    label: "No heat",
    icon: "flame",
    service: "heating",
    action: "book",
    message: "My furnace or heat pump is not producing heat.",
    placeholder: true,
  },
  {
    id: "strange-noises",
    label: "Strange noises",
    icon: "volume",
    service: "heating",
    action: "book",
    message: "My heating or cooling system is making unusual noises.",
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
    service: "heating",
    action: "book",
    message: "My thermostat is not working correctly.",
    placeholder: true,
  },
];
