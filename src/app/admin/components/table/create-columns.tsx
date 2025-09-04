import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Cat } from "vx/cats/d";
import { booleanCell, dateCell, textCell } from "./cells";
import { RowActions } from "./row-actions";
import { Icon } from "@/lib/icons";
import { format } from "date-fns";

export const filterFn: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);

  if (value === null || value === undefined) return false;
  if (!filterValue) return true; // no filter applied → keep row

  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};

const statusFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = String(row.getValue(columnId));
  return filterValue.includes(status);
};

export const createColumns = (
  onEditCategory: (category: Cat) => void,
): ColumnDef<Cat>[] => [
  {
    header: "name",
    accessorKey: "name",
    cell: textCell("name", "text-foreground"),
    size: 100,
    filterFn,
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "description",
    accessorKey: "desc",
    cell: textCell("desc", "text-muted-foreground"),
    size: 150,
    filterFn,
    enableHiding: true,
  },
  {
    header: "route",
    accessorKey: "href",
    cell: textCell("desc", "font-space text-muted-foreground lowercase"),
    size: 100,
    filterFn,
    enableHiding: true,
    enableSorting: true,
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: booleanCell(
      "active",
      { trueLabel: "Active", falseLabel: "Inactive" },
      "w-fit rounded-md py-0.5 flex items-center text-foreground/80 bg-zinc-100/60 px-1.5 space-x-1 capitalized dark:text-chalk dark:bg-chalk/5 text-xs",
    ),
    size: 100,
    filterFn: statusFilterFn,
    enableSorting: true,
  },
  {
    header: "Created by",
    accessorKey: "created_by",
    cell: textCell("cid", "font-space text-muted-foreground lowercase"),
    size: 100,
  },
  {
    header: "Created on",
    accessorKey: "created_at",
    cell: dateCell(
      "cid",
      (date) => format(date, "PPpp"),
      "font-space text-muted-foreground lowercase",
    ),
    size: 180,
    enableSorting: true,
  },
  {
    header: "cid",
    accessorKey: "cid",
    cell: textCell("cid", "font-space text-muted-foreground lowercase"),
    size: 80,
  },
  {
    id: "actions",
    header: () => (
      <div className="w-full flex justify-center">
        <Icon
          name="asterisk"
          className="size-4 dark:text-cyan-200/80 text-mac-blue/50"
        />
      </div>
    ),
    cell: ({ row }) => <RowActions row={row} onEditCategory={onEditCategory} />,
    size: 0,
    enableHiding: false,
  },
];

// Custom filter function for multi-column searching
// const multiColumnFilterFn: FilterFn<Cat> = (row, columnId, filterValue) => {
//   const searchableRowContent = `${row.original.name}`.toLowerCase();
//   const searchTerm = (filterValue ?? "").toLowerCase();
//   return searchableRowContent.includes(searchTerm);
// };
