import type { ProjectInput } from "@/content/types";

// TODO: replace with real completed jobs and photos (with customer permission).
export const projects: ProjectInput[] = [
  {
    slug: "two-story-heat-pump",
    title: "Heat pump replacement, two-story home",
    location: "Dublin, OH",
    service: "ac-installation",
    summary: "Replaced an aging split system with a variable-speed heat pump and new line set.",
    image: { src: "project-two-story-heat-pump.jpg", alt: "Outdoor heat pump beside a two-story house" },
    challenge: "The upstairs bedrooms ran several degrees warmer than the main floor every summer, and the 15-year-old system was due for replacement.",
    body: [
      "We started with a room-by-room load calculation and found the original system was oversized for the main floor and under-delivering upstairs.",
      "A variable-speed heat pump with a matched air handler runs longer at lower speed, which evens out temperatures between floors and improves dehumidification.",
    ],
    scope: ["Load calculation", "Variable-speed heat pump and air handler", "New line set and pad", "Thermostat upgrade", "Startup testing and walkthrough"],
    placeholder: true,
  },
  {
    slug: "furnace-upgrade",
    title: "High-efficiency furnace upgrade",
    location: "Westerville, OH",
    service: "heating",
    summary: "Swapped a standard-efficiency furnace for a condensing model with new PVC venting.",
    image: { src: "project-furnace-upgrade.jpg", alt: "New furnace installed in a basement" },
    challenge: "An older standard-efficiency furnace was short cycling and the homeowner wanted lower winter gas bills.",
    body: [
      "We replaced the furnace with a condensing model, which required new PVC intake and exhaust venting and a condensate drain.",
      "Before leaving we measured temperature rise and checked combustion and safety controls against the manufacturer's specifications.",
    ],
    scope: ["Condensing gas furnace", "PVC intake and exhaust venting", "Condensate drain line", "Combustion and safety checks"],
    placeholder: true,
  },
  {
    slug: "retail-rooftop-units",
    title: "Rooftop unit service, retail plaza",
    location: "Columbus, OH",
    service: "commercial",
    summary: "Seasonal maintenance and belt replacement on four rooftop units.",
    image: { src: "project-retail-rooftop-units.jpg", alt: "Row of rooftop HVAC units" },
    challenge: "A retail plaza needed seasonal service on four rooftop units with minimal disruption to open stores.",
    body: [
      "We scheduled the work before opening hours and serviced one unit at a time so each storefront kept conditioned air.",
      "Every unit received a written service report so the property manager has a record for the next season.",
    ],
    scope: ["Seasonal maintenance on 4 rooftop units", "Belt and filter replacement", "Coil cleaning", "Written service reports"],
    placeholder: true,
  },
];
