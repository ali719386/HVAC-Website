import type { z } from "zod";
import type {
  BrandConfigInput,
  CopyInput,
  brandContentSchema,
  citySchema,
  faqSchema,
  planSchema,
  postSchema,
  projectSchema,
  serviceSchema,
  testimonialSchema,
  whyItemSchema,
} from "@/lib/brand/schema";

export type {
  Brand,
  BrandConfig,
  BrandContent,
  City,
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
export type ProjectInput = z.input<typeof projectSchema>;
export type PlanInput = z.input<typeof planSchema>;
export type CityInput = z.input<typeof citySchema>;

export type BrandContentInput = Omit<z.input<typeof brandContentSchema>, "copy" | "whyChooseUs" | "faqs"> & {
  copy?: CopyOverrides;
  /** Falls back to content/defaults.ts when omitted. */
  whyChooseUs?: WhyItemInput[];
  faqs?: FaqInput[];
};

/** What every /brands/<slug>/index.ts exports. */
export type BrandInput = { config: BrandConfigInput; content: BrandContentInput };
