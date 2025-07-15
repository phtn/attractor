import { IconName } from "@/lib/icons";
import { Cat } from "vx/cats/d";
import { z } from "zod";

export const CatZodSchema = z.object({
  cid: z.optional(z.string()),
  name: z.optional(z.string()),
  href: z.optional(z.string()),
  icon: z.optional(z.string()),
  tags: z.optional(z.string()),
  desc: z.optional(z.string()),
  slug: z.optional(z.string()),
  image: z.optional(z.string()),
  style: z.optional(z.string()),
  grp: z.optional(z.string()),
  col: z.optional(z.string()),
  active: z.optional(z.string()),
  updated_at: z.optional(z.number()),
  created_at: z.optional(z.number()),
  created_by: z.optional(z.string()),
});
export type CatZod = z.infer<typeof CatZodSchema>;

export type UserFieldName = "name" | "tel" | "email" | "inquiry";

export type FieldName = (
  | "name"
  | "phone"
  | "email"
  | "created_by"
  | "created_at"
  | "updated_at"
  | "active"
  | "tags"
  | "uid"
  | "style"
  | "grp"
  | "col"
) &
  keyof Cat;

// Complete form values type
export type FormValues = {
  cat: Cat;
};

// Define option type for selects and checkbox groups
type FieldOption = {
  value: string;
  label: string;
  icon: IconName;
  description: string;
};

// Type for field validators
type FieldValidator = (value: string | number) => true | string;

// Define base field properties
export interface BaseFieldConfig {
  name: keyof Cat;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  validators?: Record<string, FieldValidator>;
  className?: string;
  hint?: string;
  defaultValue?: string | number | null;
}

// Text field config
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "number" | "password" | "tel";
}

// Select field config
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: FieldOption[];
  // onValueChange: (value: string) => void;
}

// CheckboxGroup field config
interface CheckboxGroupFieldConfig extends BaseFieldConfig {
  type: "checkbox-group";
  options: FieldOption[];
}

// Union type for all field types
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | CheckboxGroupFieldConfig;

// Type for field groups
export interface FieldGroup {
  title: string;
  fields: FieldConfig[];
}
