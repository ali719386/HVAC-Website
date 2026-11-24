import type { z } from "zod";
import type { climateProfilesSchema } from "@/lib/brand/schema";

/*
 * Generic climate profiles used to build state and city pages. Brand-neutral and deliberately general:
 * no local statistics, temperatures, landmarks, utilities, rebates or competitors.
 * Tokens: {city} and {state} (state name). Brands can override via content.climate.
 */
export const defaultClimate: z.input<typeof climateProfilesSchema> = {
  cooling: {
    label: "Cooling climate",
    services: ["ac-repair", "ac-installation", "maintenance", "duct-cleaning", "commercial", "heating"],
    headline: "Air conditioning service in {city}",
    promo: "Schedule an AC tune-up before the hottest months arrive.",
    intro:
      "In a cooling-dominated climate like {state}'s, air conditioners carry most of the load for much of the year. We focus on keeping cooling systems reliable in {city}, with repair, replacement and seasonal maintenance.",
    faqs: [
      {
        question: "How often should my air conditioner be serviced?",
        answer: "In a climate where the AC runs for much of the year, most manufacturers recommend at least one professional tune-up a year, ideally before the cooling season.",
      },
      {
        question: "Why does my AC run almost constantly on hot days?",
        answer: "Long run times can be normal in hot weather, but they can also point to low refrigerant, dirty coils, restricted airflow or an undersized system. A diagnostic visit can tell you which.",
      },
      {
        question: "Can high humidity affect my system?",
        answer: "Yes. Air conditioners also remove moisture. An oversized or poorly maintained system may cool quickly but leave the home feeling damp. Proper sizing and airflow help.",
      },
      {
        question: "When does replacement make more sense than repair?",
        answer: "It depends on the age of the system, the cost of the repair and how often it fails. We lay out both options in writing so you can decide.",
      },
    ],
  },
  heating: {
    label: "Heating climate",
    services: ["heating", "maintenance", "ac-repair", "ac-installation", "duct-cleaning", "commercial"],
    headline: "Heating and furnace service in {city}",
    promo: "Book a heating safety check before the first cold snap.",
    intro:
      "In a heating-dominated climate like {state}'s, the furnace or heat pump does the heavy lifting for months at a time. We focus on safe, dependable heat in {city}, along with cooling service for the warmer months.",
    faqs: [
      {
        question: "How often should my furnace be inspected?",
        answer: "Most manufacturers recommend a professional heating inspection once a year, typically in the fall before regular use begins.",
      },
      {
        question: "What should I do if my heat stops working?",
        answer: "Check the thermostat settings, the breaker and the filter first. If the system still will not run, call us and do not keep resetting a furnace that locks out.",
      },
      {
        question: "Is a heat pump an option in a cold climate?",
        answer: "Many homes in colder climates use heat pumps, sometimes paired with a furnace as backup. Whether it fits your home depends on the house and the existing equipment.",
      },
      {
        question: "Why are some rooms colder than others?",
        answer: "Uneven heat often comes from duct leaks, blocked returns, closed registers or airflow balance. An inspection can find the cause.",
      },
    ],
  },
  mixed: {
    label: "Mixed climate",
    services: ["maintenance", "ac-repair", "heating", "ac-installation", "duct-cleaning", "commercial"],
    headline: "Heating and cooling service in {city}",
    promo: "Pair a spring cooling tune-up with a fall heating check.",
    intro:
      "In a mixed climate like {state}'s, homes rely on both heating and cooling across the year. We help {city} homeowners keep both systems ready, with seasonal maintenance and repair for each.",
    faqs: [
      {
        question: "Do I need two tune-ups a year?",
        answer: "When a home uses both heating and cooling, a spring cooling visit and a fall heating visit help catch problems before each season.",
      },
      {
        question: "Is a heat pump a good fit for a mixed climate?",
        answer: "Heat pumps provide both heating and cooling and are common in mixed climates. Whether one fits your home depends on the house and existing equipment.",
      },
      {
        question: "How do I know if my system is sized correctly?",
        answer: "A load calculation based on the home's size, insulation and windows shows the right capacity. We start there before recommending equipment.",
      },
      {
        question: "What maintenance can I do myself?",
        answer: "Change or clean filters regularly, keep the outdoor unit clear of debris and keep supply and return vents unblocked. Leave electrical and refrigerant work to a technician.",
      },
    ],
  },
};
