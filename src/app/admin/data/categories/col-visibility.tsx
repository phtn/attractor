import { HyperButton } from "@/components/hyper";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import { Cat } from "vx/cats/d";

interface Props {
  cols: Column<string, keyof Cat>[];
}
export const ColumnVisibility = ({ cols }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HyperButton solid asChild label="view" icon="circle-filled">
          <span></span>
        </HyperButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {cols.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="uppercase text-xs"
              checkStyles="dark:text-cyan-200"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(event) => event.preventDefault()}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
