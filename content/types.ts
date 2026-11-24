import type { z } from "zod";
import type {
  BrandConfigInput,
  CopyInput,
  authorSchema,
  blogCategorySchema,
  brandContentSchema,
  climateProfilesSchema,
  coverageCitySchema,
  coverageSchema,
  coverageStateSchema,
  faqSchema,
  planSchema,
  postSchema,
  processStepSchema,
  symptomSchema,
  projectSchema,
  serviceSchema,
  testimonialSchema,
  whyItemSchema,
} from "@/lib/brand/schema";

export type {
  Brand,
  BrandConfig,
  BrandContent,
  CoverageCity,
  CoverageState,
  Copy,
  Faq,
  ImageAsset,
  Plan,
  Post,
  Project,
  Service,
  ServiceType,
  Stat,
  Testimonial,
  WhyItem,
} from "@/lib/brand/schema";

/** Per-section partial overrides of the default copy in content/defaults.ts. */
export type CopyOverrides = { [K in keyof CopyInput]?: Partial<CopyInput[K]> };

export type ServiceInput = z.input<typeof serviceSchema>;
export type WhyItemInput = z.input<typeof whyItemSchema>;
export type TestimonialInput = z.input<typeof testimonialSchema>;
export type FaqInput = z.input<typeof faqSchema>;
export type PostInput = z.input<typeof postSchema>;
export type AuthorInput = z.input<typeof authorSchema>;
export type BlogCategoryInput = z.input<typeof blogCategorySchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type PlanInput = z.input<typeof planSchema>;
export type CoverageStateInput = z.input<typeof coverageStateSchema>;
export type CoverageCityInput = z.input<typeof coverageCitySchema>;
export type CoverageInput = z.input<typeof coverageSchema>;
export type SymptomInput = z.input<typeof symptomSchema>;
export type ProcessStepInput = z.input<typeof processStepSchema>;

export type BrandContentInput = Omit<z.input<typeof brandContentSchema>, "copy" | "whyChooseUs" | "faqs" | "climate"> & {
  copy?: CopyOverrides;
  /** Falls back to content/defaults.ts when omitted. */
  whyChooseUs?: WhyItemInput[];
  faqs?: FaqInput[];
  /** Falls back to content/climate.ts when omitted. */
  climate?: z.input<typeof climateProfilesSchema>;
};

/** What every /brands/<slug>/index.ts exports. */
export type BrandInput = { config: BrandConfigInput; content: BrandContentInput };
