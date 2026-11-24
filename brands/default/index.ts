import type { BrandInput } from "@/content/types";
import { config } from "./config";
import { authors } from "./content/authors";
import { blogCategories } from "./content/blog-categories";
import { copy } from "./content/copy";
import { faqs } from "./content/faqs";
import { plans } from "./content/plans";
import { processSteps } from "./content/process";
import { projectFaqs } from "./content/project-faqs";
import { posts } from "./content/posts";
import { projects } from "./content/projects";
import { services } from "./content/services";
import { symptoms } from "./content/symptoms";
import { testimonials } from "./content/testimonials";
import { whyChooseUs } from "./content/why";

const brand: BrandInput = {
  config,
  content: { services, whyChooseUs, testimonials, faqs, posts, projects, plans, symptoms, process: processSteps, projectFaqs, authors, blogCategories, copy },
};

export default brand;
