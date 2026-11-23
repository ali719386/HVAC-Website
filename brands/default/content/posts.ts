import type { PostInput } from "@/content/types";

// TODO: replace with client-reviewed articles. General guidance only, no claims.
export const posts: PostInput[] = [
  {
    slug: "ac-not-cooling-checklist",
    title: "AC Not Cooling? A 5-Minute Checklist Before You Call",
    excerpt: "A few quick checks can rule out simple causes and help your technician diagnose the problem faster.",
    date: "2026-06-02",
    author: "Coolwren Service Team",
    category: "Cooling",
    readMinutes: 4,
    image: { src: "posts/ac-not-cooling-vent.jpg", alt: "Homeowner checking airflow at a floor vent" },
    body: [
      {
        paragraphs: [
          "When the house starts warming up, it is tempting to assume the worst. Before scheduling a repair, run through these simple checks. They take a few minutes and do not require tools.",
        ],
      },
      {
        heading: "1. Check the thermostat",
        paragraphs: ["Confirm it is set to Cool, the set point is below room temperature and the batteries are not low."],
      },
      {
        heading: "2. Look at the air filter",
        paragraphs: ["A clogged filter restricts airflow and can cause the indoor coil to freeze. Replace it if it looks gray or dusty."],
      },
      {
        heading: "3. Check the breaker",
        paragraphs: ["Look for a tripped breaker for the outdoor unit or air handler. If it trips again after resetting, stop and call a professional."],
      },
      {
        heading: "When to call",
        paragraphs: ["If you see ice on the refrigerant lines, hear grinding or buzzing, or the system still blows warm air, turn it off and schedule service."],
      },
    ],
    placeholder: true,
  },
  {
    slug: "furnace-tune-up-what-to-expect",
    title: "What Happens During a Furnace Tune-Up",
    excerpt: "A look at what a technician checks during a fall heating tune-up, and why each step matters.",
    date: "2026-09-15",
    author: "Coolwren Service Team",
    category: "Heating",
    readMinutes: 5,
    image: { src: "posts/furnace-tune-up-blower.jpg", alt: "Technician inspecting a furnace blower with a flashlight during a tune-up" },
    body: [
      {
        paragraphs: [
          "A heating tune-up is about safety as much as efficiency. Here is what a typical visit covers for a gas furnace.",
        ],
      },
      {
        heading: "Safety checks",
        paragraphs: ["The technician inspects the heat exchanger, tests safety limit switches and checks venting for proper draft."],
      },
      {
        heading: "Combustion and ignition",
        paragraphs: ["Burners are cleaned and inspected, the flame sensor is cleaned and the ignition sequence is tested."],
      },
      {
        heading: "Airflow",
        paragraphs: ["The blower is inspected, the filter checked, and temperature rise measured against the manufacturer's range."],
      },
    ],
    placeholder: true,
  },
  {
    slug: "choosing-a-new-ac-size",
    title: "Why AC Size Matters More Than Brand",
    excerpt: "An oversized or undersized system costs more to run and wears out sooner. Here is how proper sizing works.",
    date: "2026-04-20",
    author: "Coolwren Service Team",
    category: "Buying guide",
    readMinutes: 6,
    image: { src: "posts/ac-size-measuring.jpg", alt: "Technician measuring a living room with a laser meter and floor plan for a load calculation" },
    body: [
      {
        paragraphs: [
          "Rules of thumb like one ton per 500 square feet are a starting point, not an answer. Insulation, windows, ceiling height and sun exposure all change the load.",
        ],
      },
      {
        heading: "Oversized systems",
        paragraphs: ["They cool quickly and shut off before removing enough humidity, leaving the house cool but clammy."],
      },
      {
        heading: "Undersized systems",
        paragraphs: ["They run constantly on the hottest days and may never reach the set temperature."],
      },
      {
        heading: "The fix",
        paragraphs: ["A room-by-room load calculation gives your installer real numbers to size the system correctly."],
      },
    ],
    placeholder: true,
  },
];
