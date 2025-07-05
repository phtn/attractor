import { Icon } from "@/lib/icons";
import { TextFieldConfig } from "./schema";

export const InputField = (item: TextFieldConfig) => (
  <div className="relative">
    <div className="flex items-center absolute gap-x-0 justify-start">
      <div className={labelClassName}>
        <label htmlFor={item.name.toString()}>{item.label}</label>
      </div>

      {item.required && (
        <div className={requiredClassName}>
          <div className="flex items-center leading-none space-x-2 justify-center">
            <Icon
              name="asterisk"
              className="text-red-600 dark:text-red-400 size-3"
            />
            <span className="text-[9px] hidden leading-none font-mono text-muted-foreground">
              Required
            </span>
          </div>
        </div>
      )}
    </div>
    <input
      name={item.name.toString()}
      type={item.type}
      required={item.required}
      autoComplete={item.autoComplete}
      className={inputClassName}
    />
  </div>
);

const inputClassName =
  "ps-3 font-sans tracking-tight text-lg block pt-5 h-16 w-full rounded-lg outline-none bg-muted dark:bg-background/30";
const labelClassName =
  "block ps-3 py-1 font-sans text-[10px] top-0 left-0 font-medium capitalized";
const requiredClassName = "px-2 flex items-center mr-[3px]";
