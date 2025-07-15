import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { type TextFieldConfig } from "./schema";

export const InputField = (item: TextFieldConfig) => {
  const [onFocus, setFocus] = useState(false);
  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const handleBlur = useCallback(() => {
    setFocus(false);
  }, []);
  return (
    <div className="relative">
      <div className="h-8 text-sm text-muted-foreground font-sans">
        {item.hint}
      </div>
      <div
        className={cn(
          "absolute bottom-0 mx-auto h-px z-10 w-full bg-gradient-to-r dark:from-transparent dark:via-transparent dark:via-10% dark:to-transparent",
          "pointer-events-none",
          "transition-colors duration-300 scale-x-95",
          { " dark:via-pink-200/40 ": onFocus },
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 scale-x-95 mx-auto h-11 z-10 w-full bg-gradient-to-r dark:from-transparent dark:via-transparent dark:via-15% dark:to-transparent blur-md",
          "pointer-events-none",
          { "dark:via-pink-100/40": onFocus },
        )}
      />
      <div className="flex items-center absolute gap-x-0 justify-start">
        <div
          className={cn(labelClassName, { "text-muted-foreground": onFocus })}
        >
          <label htmlFor={item.name.toString()}>{item.label}</label>
        </div>

        {item.required && (
          <div className={requiredClassName}>
            <div className="flex items-end size-4 leading-none space-x-2 justify-center">
              <Icon
                name="asterisk"
                className="text-red-600 dark:text-red-400/80 size-2.5"
              />
            </div>
          </div>
        )}
      </div>
      <input
        name={item.name.toString()}
        type={item.type}
        required={item.required}
        autoComplete={item.autoComplete}
        defaultValue={item.defaultValue || ""}
        className={cn(
          " dark:bg-origin/60",
          { "dark:bg-border dark:border-pink-100/20": onFocus },
          inputClassName,
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const inputClassName =
  "ps-3 font-sans tracking-tight text-lg block pt-5 h-16 border w-full rounded-md outline-none bg-muted";
const labelClassName =
  "block ps-2.5 pt-1.5 font-ox text-muted-foreground/80 italic text-[10px] font-semibold top-0 left-0 capitalized text-sm";
const requiredClassName = "px-2 flex items-center mr-[3px]";
