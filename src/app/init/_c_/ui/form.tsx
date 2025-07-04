"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from "react";

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  },
);
FormItem.displayName = "FormItem";

interface FormLabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  htmlFor: string;
  errors: string[];
}

const FormLabel = forwardRef<
  ComponentRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ className, htmlFor, errors, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(errors.length && "text-destructive", className)}
      htmlFor={htmlFor}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

interface FormControlProps extends ComponentPropsWithoutRef<typeof Slot> {
  id: string;
  ariaDescribedBy: string;
  ariaInvalid: boolean;
}

const FormControl = forwardRef<ComponentRef<typeof Slot>, FormControlProps>(
  ({ id, ariaDescribedBy, ariaInvalid, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  id: string;
}

const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    return (
      <p
        ref={ref}
        id={id}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  id: string;
  errors: string[];
}

const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, id, errors, ...props }, ref) => {
    const body = errors.length ? errors.join(", ") : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={id}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

// interface FormFieldProps<TName extends FieldName> {
//   name: TName;
//   children: (
//     field: FieldApi<FormValues, TName, FormValues[TName], FormValues[TName]>,
//   ) => ReactNode;
//   validators?: Parameters<
//     FieldApi<FormValues, TName, FormValues[TName], FormValues[TName]>["Field"]
//   >[0]["validators"];
// }

// function FormField<TName extends FieldName>({
//   name,
//   children,
//   validators,
// }: FormFieldProps<TName>) {
//   const itemContext = useContext(FormItemContext);
//   if (!itemContext) {
//     throw new Error("FormField must be used within a <FormItem> component.");
//   }

//   return (
//     <FieldApi name={name} validators={validators}>
//       {(field) =>
//         children(
//           field as FieldApi<
//             FormValues,
//             TName,
//             FormValues[TName],
//             FormValues[TName]
//           >,
//         )
//       }
//     </FieldApi>
//   );
// }

export {
  FormControl,
  FormDescription,
  // FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
