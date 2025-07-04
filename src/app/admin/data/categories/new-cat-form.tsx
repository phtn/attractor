import { HyperList } from "@/components/hyper";
import {
  CatZodSchema,
  TextFieldConfig,
} from "@/components/tanstack/form/schema";
import { useAppForm } from "@/components/tanstack/form/utils";
import { useCallback, useMemo } from "react";
import { Cat, CatSchema } from "vx/cats/d";

interface NewCatFormProps {
  onSuccess?: () => void;
}

export function NewCatForm({ onSuccess }: NewCatFormProps) {
  const initialState = {} as Cat;
  // const createCategory = useMutation(api.categories.create.default);
  const form = useAppForm({
    defaultValues: initialState,
    validators: {
      onChange: CatZodSchema,
      onSubmit: () => {
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
              className="bg-super-fade dark:bg-neutral-600/60"
            />
          )}
        </form.AppField>
      );
    },
    [form],
  );

  const Submit = useCallback(
    () => (
      <form.AppForm>
        <form.SubmitButton
          title="Create"
          pending={false}
          className="bg-ultra-fade border-none text-panel rounded-none flex-1 size-full dark:text-white text-sm dark:bg-zark font-sans tracking-tight font-medium"
        />
      </form.AppForm>
    ),
    [form],
  );

  const cats = useMemo(() => {
    // const keys = Object.entries(typeof CatSchema).keys();
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
      };
    });
    return fieldConfigurations;
    // Note: The 'fieldConfigurations' array is created here.
    // However, the subsequent 'return' statement in the useMemo block still references the original 'keys' variable
    // and its mapping logic. For 'HyperList' to use these TextFieldConfig objects, the 'return' statement
    // would need to be adjusted to 'return fieldConfigurations;' and the initial 'keys' definition corrected.
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <HyperList
        data={cats}
        delay={0.5}
        container="lg:space-y-5 space-y-2 grid grid-rows-2 gap-x-4 lg:grid-cols-3"
        component={FormField}
      />
      <Submit />
    </form>
  );
}
