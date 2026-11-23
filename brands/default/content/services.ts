import type { ServiceInput } from "@/content/types";

// TODO: review all service copy with the client. Marked placeholder until approved.
export const services: ServiceInput[] = [
  {
    slug: "ac-repair",
    title: "AC Repair",
    summary: "Diagnosis and repair for warm air, short cycling, leaks and strange noises.",
    icon: "snowflake",
    image: { src: "services/ac-repair-gauges.jpg", alt: "Technician checking refrigerant pressure on an outdoor AC unit with a gauge manifold" },
    intro:
      "When your air conditioner stops keeping up, a methodical diagnosis saves time and money. We find the cause first, then explain your options before any work begins.",
    body: [
      "Most cooling problems trace back to a short list of causes: failed capacitors, dirty coils, low refrigerant from a leak, clogged condensate drains or thermostat issues. Our technicians test each system component rather than guessing.",
      "You receive a written estimate with the repair recommended and, when it makes sense, a comparison against replacement so you can make an informed decision.",
    ],
    features: [
      "Full-system diagnostic with written findings",
      "Electrical, refrigerant and airflow checks",
      "Common parts stocked on service vehicles",
      "Repair-versus-replace guidance when relevant",
    ],
    signs: ["Warm air from vents", "System turns on and off often", "Water pooling near the indoor unit", "Rising energy bills"],
    seoTitle: "AC Repair in Columbus, OH",
    seoDescription: "Air conditioner diagnosis and repair in Columbus and Central Ohio. Written estimates before work begins.",
    placeholder: true,
  },
  {
    slug: "ac-installation",
    title: "AC Installation",
    summary: "Properly sized central air and heat pump systems, installed to manufacturer specs.",
    icon: "fan",
    image: { src: "services/ac-installation.jpg", alt: "Two technicians leveling a new central air conditioner on a concrete pad" },
    intro:
      "A new cooling system is a long-term investment. Correct sizing and a clean installation matter as much as the equipment brand you choose.",
    body: [
      "We start with a load calculation based on your home's square footage, insulation, windows and orientation, so the system is neither undersized nor oversized.",
      "Your quote outlines equipment options at different efficiency levels, what is included in the installation, and the manufacturer warranty that applies.",
    ],
    features: [
      "Load calculation before equipment selection",
      "Multiple efficiency options in one quote",
      "Removal and disposal of old equipment",
      "Startup testing and system walkthrough",
    ],
    signs: ["System older than 12 to 15 years", "Frequent repairs", "Uneven temperatures between rooms"],
    seoTitle: "AC Installation and Replacement in Columbus, OH",
    seoDescription: "Central air conditioner and heat pump installation in Central Ohio, sized with a load calculation.",
    placeholder: true,
  },
  {
    slug: "heating",
    title: "Heating Services",
    summary: "Furnace and heat pump repair, replacement and safety checks for Ohio winters.",
    icon: "flame",
    image: { src: "services/heating-furnace.jpg", alt: "Technician inspecting the burners and controls of an open gas furnace with a flashlight" },
    intro:
      "Cold Ohio nights are no time for a furnace failure. We repair and replace gas furnaces, heat pumps and air handlers, with safety checks on every visit.",
    body: [
      "Heating calls include a combustion and safety inspection where applicable, so you know your system is operating as intended.",
      "If replacement is the better value, we explain efficiency ratings in plain terms and help you compare total cost over the life of the equipment.",
    ],
    features: [
      "Gas furnace and heat pump repair",
      "Ignition, flame sensor and blower diagnostics",
      "Carbon monoxide safety checks",
      "Replacement options with clear pricing",
    ],
    signs: ["No heat or weak airflow", "Burning or musty smells", "Furnace cycling frequently", "Yellow burner flame"],
    seoTitle: "Furnace and Heating Repair in Columbus, OH",
    seoDescription: "Furnace and heat pump repair, replacement and safety checks in Columbus and Central Ohio.",
    placeholder: true,
  },
  {
    slug: "maintenance",
    title: "Maintenance & Tune-Ups",
    summary: "Seasonal tune-ups that catch small problems before they become breakdowns.",
    icon: "wrench",
    image: { src: "services/maintenance-filter.jpg", alt: "Technician replacing the air filter on a home furnace during a tune-up" },
    intro:
      "Regular maintenance helps equipment run efficiently and can extend its life. Many manufacturers also require it to keep warranties valid.",
    body: [
      "A cooling tune-up typically covers coil cleaning, refrigerant pressure checks, electrical testing and condensate drain flushing. A heating tune-up covers burners, ignition, heat exchanger inspection and safety controls.",
      "Ask about our maintenance plans if you want both seasonal visits scheduled automatically.",
    ],
    features: ["Spring cooling tune-up", "Fall heating tune-up", "Filter and thermostat checks", "Written condition report"],
    signs: [],
    seoTitle: "HVAC Maintenance and Tune-Ups in Columbus, OH",
    seoDescription: "Seasonal AC and furnace tune-ups in Central Ohio to keep your system efficient and reliable.",
    placeholder: true,
  },
  {
    slug: "commercial",
    title: "Commercial HVAC",
    summary: "Rooftop units, split systems and planned maintenance for local businesses.",
    icon: "building",
    image: { src: "services/commercial-rooftop.jpg", alt: "Technician checking a commercial rooftop HVAC unit with a tablet" },
    intro:
      "Downtime costs money. We service rooftop units and split systems for offices, retail spaces and restaurants, with scheduling that works around your hours.",
    body: [
      "We offer repair, replacement and planned maintenance agreements for light commercial properties.",
      "Every visit ends with a service report so property managers have a clear record of work performed.",
    ],
    features: ["Rooftop unit service", "Planned maintenance agreements", "After-hours scheduling", "Service reports for every visit"],
    signs: [],
    seoTitle: "Commercial HVAC Service in Columbus, OH",
    seoDescription: "Commercial HVAC repair and planned maintenance for Central Ohio businesses.",
    placeholder: true,
  },
];
