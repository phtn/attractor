import { Icon } from "@/lib/icons";
import { TextFieldConfig } from "./schema";

export const InputField = (item: TextFieldConfig) => (
  <div className="relative font-dm">
    <div className="flex items-center absolute gap-x-0 justify-start">
      <div className={labelClassName}>
        <label htmlFor={item.name.toString()}>{item.label}</label>
      </div>

      {item.required && (
        <div className={requiredClassName}>
          <div className="flex items-center leading-none space-x-1 justify-center py-[1.5px]">
            <Icon
              name="asterisk"
              className="text-red-600 dark:text-red-300 size-3"
            />
            <span className="text-[10.5px] font-medium leading-none">
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
  "ps-3 font-sans tracking-tight text-lg block pt-5 h-16 w-full rounded-2xl outline-none bg-gradient-to-br from-ultra-fade via-super-fade/60 to-ultra-fade dark:via-gray-600 dark:from-gray-600 dark:to-gray-700 border border-transparent dark:border-gray-500/50 focus:border-orange-300 focus:ring-orange-500 text-panel dark:text-white";
const labelClassName =
  "block dark:bg-neutral-100/10 bg-white ps-3 pe-2.5 py-0.5 font-sans rounded-tl-[14px] tracking-wider text-[10px] top-0 left-0 rounded-e rounded-bl m-[3px] font-medium text-raised/80 dark:text-white/60 uppercase";
const requiredClassName =
  "dark:bg-neutral-100/10 bg-white px-2 h-[19px] flex items-center font-medium tracking-wide font-quick rounded mr-[3px]";
