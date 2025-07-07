import { HyperButton } from "@/components/hyper";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateId } from "ai";

interface Props {
  selected: string[];
  statusCount: Map<string, number>;
  uniqueValues: string[];
  onStatusChange: (check: boolean) => (value: string) => void;
}
export const FilterStatus = ({
  selected,
  statusCount,
  uniqueValues,
  onStatusChange,
}: Props) => (
  <Popover>
    <PopoverTrigger>
      <HyperButton solid asChild label="status" icon="circle-filled">
        {selected.length > 0 && (
          <span className="bg-background -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {selected.length}
          </span>
        )}
      </HyperButton>
    </PopoverTrigger>
    <PopoverContent className="w-auto min-w-36 p-3" align="start">
      <div className="space-y-3">
        <div className="text-muted-foreground text-xs font-medium">Filters</div>
        <div className="space-y-3">
          {uniqueValues.map((value, i) => {
            const id = generateId();
            return (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${i}`}
                  checked={selected.includes(value)}
                  onCheckedChange={onStatusChange}
                />
                <Label
                  htmlFor={`${id}-${i}`}
                  className="flex grow justify-between gap-2 font-normal"
                >
                  {value}{" "}
                  <span className="text-muted-foreground ms-2 text-xs">
                    {statusCount.get(value)}
                  </span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </PopoverContent>
  </Popover>
);
