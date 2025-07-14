import { HyperList } from "@/components/hyper";
import {
  CatZodSchema,
  TextFieldConfig,
} from "@/components/tanstack/form/schema";
import { useAppForm } from "@/components/tanstack/form/utils";
import { useMutation } from "convex/react";
import { useActionState, useCallback, useMemo } from "react";
import { Cat, CatSchema } from "vx/cats/d";
import { api } from "@@/api";
import { handleAsync } from "@/utils/async-handler";
import { cn } from "@/lib/utils";

interface NewCatFormProps {
  onSuccess?: () => void;
}

const hints: Record<keyof Cat, string> = {
  name: "Name of the Category",
  href: "Route / pathname of category",
  icon: "Icon name",
  tags: "Meta tags and other labels",
  desc: "Brief description of the category",
  slug: "slug including '/'",
  image: "Image url",
  style: "Tailwind styling",
  active: "Live status of category",
};

export function NewCatForm({ onSuccess }: NewCatFormProps) {
  const initialState = {} as Cat;
  const createCategory = useMutation(api.cats.create.default);

  const form = useAppForm({
    defaultValues: initialState,
    validators: {
      onChange: CatZodSchema,
      onSubmit: async ({ value }) => {
        await handleAsync(createCategory)(value as Cat);
        onSuccess?.();
      },
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     name: "",
  //     cid: "",
  //   },
  //   onSubmit: async ({ value }) => {
  //     try {
  //       await createCategory({ name: value.name, cid: value.cid });
  //       toast.success("Category created successfully!");
  //       form.reset();
  //       onSuccess?.();
  //     } catch (error) {
  //       toast.error("Failed to create category.");
  //       console.error("Failed to create category:", error);
  //     }
  //   },
  // });

  const FormField = useCallback(
    (props: TextFieldConfig) => {
      return (
        <form.AppField {...props} name={props.name as keyof Cat as string}>
          {(field) => (
            <field.InputField
              {...props}
              type={props.type}
              label={props.label}
              required={props.required}
              autoComplete={props.autoComplete}
              hint={props.hint}
              className="bg-super-fade dark:bg-neutral-600/60 border dark:border-zinc-400"
            />
          )}
        </form.AppField>
      );
    },
    [form],
  );

  const cats = useMemo(() => {
    const fieldConfigurations: TextFieldConfig[] = Object.keys(
      CatSchema.fields,
    ).map((key: keyof Cat) => {
      const fieldSchema = CatSchema.fields;
      // Attempt to infer 'required' status from Zod schema properties
      const isRequired =
        fieldSchema &&
        "isOptional" in fieldSchema &&
        typeof fieldSchema.isOptional === "function"
          ? !fieldSchema.isOptional()
          : true; // Default to required if not clearly optional

      // Attempt to infer 'type' based on Zod schema type name
      const type =
        fieldSchema &&
        "typeName" in fieldSchema &&
        typeof fieldSchema.typeName === "string"
          ? fieldSchema.typeName.includes("String")
            ? "text"
            : "number"
          : "text"; // Default to 'text' if type cannot be inferred

      return {
        name: key,
        label: key.toString().charAt(0).toUpperCase() + key.toString().slice(1), // Capitalize first letter for label
        type: type,
        required: isRequired,
        autoComplete: "off", // Default autocomplete
        hint: hints[key],
      };
    });
    const excludedKeys = ["cid", "created_at", "updated_at", "created_by"];
    const keyFilterPredicate = (config: TextFieldConfig) =>
      !excludedKeys.includes(config.name as string);
    return fieldConfigurations.filter(keyFilterPredicate);
    // Note: The 'fieldConfigurations' array is created here.
    // However, the subsequent 'return' statement in the useMemo block still references the original 'keys' variable
    // and its mapping logic. For 'HyperList' to use these TextFieldConfig objects, the 'return' statement
    // would need to be adjusted to 'return fieldConfigurations;' and the initial 'keys' definition corrected.
  }, []);

  const [, action, pending] = useActionState(createCategory, initialState);

  const Submit = useCallback(
    () => (
      <form.AppForm>
        <form.SubmitButton
          title="Create"
          pending={pending}
          className={cn(
            "dark:bg-background text-panel rounded-none h-12 flex-1 size-full dark:text-lime-200 font-sans tracking-tight font-medium",
          )}
        />
      </form.AppForm>
    ),
    [form, pending],
  );
  return (
    <form
      action={action}
      className="rounded-lg dark:bg-void/20 dark:border-origin/60 shadow-inner border px-4 space-y-10 py-5"
    >
      <HyperList
        data={cats}
        delay={0.5}
        container="lg:space-y-10 space-y-2 grid grid-rows-2 gap-x-4"
        component={FormField}
      />
      <div className="h-20 rounded-xl overflow-hidden">
        <Submit />
      </div>
    </form>
  );
}
