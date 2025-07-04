import { Input } from "@/components/ui/input";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { useId, useRef } from "react";
import { Cat } from "vx/cats/d";

interface Props {
  col: Column<string, keyof Cat>;
}
export const FilterSearch = ({ col }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  return (
    <div className="relative">
      <Input
        id={`${id}-input`}
        ref={inputRef}
        className={cn(
          "peer min-w-60 ps-10",

          Boolean(col?.getFilterValue()) && "pe-10",
        )}
        value={(col?.getFilterValue() ?? "") as string}
        onChange={(e) => col?.setFilterValue(e.target.value)}
        placeholder="Filter"
        type="text"
        inputMode="email"
        aria-label="Filter"
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Icon
          solid
          name="filter"
          aria-hidden="true"
          className="size-4 text-mac-blue dark:text-geist-teal"
        />
      </div>
      {Boolean(col?.getFilterValue()) && (
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          onClick={() => {
            col?.setFilterValue("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <Icon name="close-small" size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
