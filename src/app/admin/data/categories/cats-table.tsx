"use client";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { HyperButton } from "@/components/hyper";
import { HyperCard } from "@/components/hyper/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Cat } from "vx/cats/d";
import { ColumnVisibility } from "./col-visibility";
import { FilterSearch } from "./filter-search";
import { FilterStatus } from "./filter-status";
import { MoreOptions } from "./more-options";
import { Paginator } from "./pagination";

// type Item = {
//   id: string;
//   name: string;
//   email: string;
//   location: string;
//   flag: string;
//   status: "Active" | "Inactive" | "Pending";
//   balance: number;
// };

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Cat> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Cat> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const columns: ColumnDef<Cat>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   size: 28,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "cid",
    accessorKey: "cid",
    cell: ({ row }) => (
      <div>
        {/* <span className="text-lg leading-none">{row.original.flag}</span>{" "} */}
        {row.getValue("cid")}
      </div>
    ),
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: ({ row }) => (
      <Badge
        className={cn("uppercase", {
          "bg-muted-foreground/60 dark:bg-cyan-200 text-primary-foreground":
            row.getValue("active") as boolean,
        })}
      >
        {row.getValue("active") ? "active" : "inactive"}
      </Badge>
    ),
    size: 100,
    filterFn: statusFilterFn,
  },
  {
    header: "Performance",
    accessorKey: "performance",
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

interface CatsTableProps<T extends Cat> {
  data: T[];
  create: boolean;
  toogleForm: VoidFunction;
}

export interface PaginationCtrl {
  disabledNext: boolean;
  disabledPrev: boolean;
  gotoNext: VoidFunction;
  gotoPrev: VoidFunction;
  gotoFirst: VoidFunction;
  gotoLast: VoidFunction;
}

export default function CatsTable<T extends Cat>({
  data,
  create,
  toogleForm,
}: CatsTableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const [d, setData] = useState<Cat[]>(data);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json",
      );
      const data = await res.json();
      setData(data);
    }
    fetchPosts();
  }, []);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = d.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id),
    );
    setData(updatedData);
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Get counts for each status
  const facetedUniqueValues = table
    .getColumn("active")
    ?.getFacetedUniqueValues();

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    if (!facetedUniqueValues) return [];

    const values = Array.from(facetedUniqueValues.keys());

    return values?.sort();
  }, [facetedUniqueValues]);

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("active");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table]);

  const filterValue = table.getColumn("active")?.getFilterValue() as string[];
  const selectedStatuses = useMemo(() => {
    return filterValue ?? [];
  }, [filterValue]);

  const onStatusChange = (checked: boolean) => (value: string) => {
    const filterValue = table.getColumn("active")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("active")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const allCols = useMemo(
    () =>
      table.getAllColumns().filter((c) => c.getCanHide()) as Column<
        string,
        keyof Cat
      >[],
    [table],
  );

  const filterCol = useMemo(
    () => table.getColumn("name") as Column<string, keyof Cat>,
    [table],
  );

  const rowsSelected = useMemo(
    () => table.getSelectedRowModel().rows.length,
    [table],
  );

  const paginationState = useMemo(() => table.getState().pagination, [table]);
  const rowCount = useMemo(() => table.getRowCount(), [table]);
  const setPageSize = useCallback(
    (value: string) => table.setPageSize(+value),
    [table],
  );
  const pageControls = useMemo(
    () =>
      ({
        gotoFirst: () => table.firstPage(),
        disabledPrev: !table.getCanPreviousPage(),
        gotoPrev: () => table.previousPage(),
        disabledNext: !table.getCanNextPage(),
        gotoNext: () => table.nextPage(),
        gotoLast: () => table.lastPage(),
      }) as PaginationCtrl,
    [table],
  );

  return (
    <div
      className={cn(
        "flex w-full transition-[max-width] duration-500 ease-in xl:max-w-[calc(82lvw)] md:max-w-[100lvw]",
        {
          "xl:max-w-[calc(100lvw-42vw)] gap-4": create,
        },
      )}
    >
      <HyperCard className="space-y-4 px-4 h-fit py-6 flex-1">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-sans tracking-tight">
              Categories
            </h2>
            <span>
              <Icon name="koi" className="size-8" solid />
            </span>
            {/* Filter by name or email */}
            <FilterSearch col={filterCol} />
            <FilterStatus
              statusCount={statusCounts}
              selected={selectedStatuses}
              onStatusChange={onStatusChange}
              uniqueValues={uniqueStatusValues}
            />
            {/* Toggle columns visibility */}
            <ColumnVisibility cols={allCols} />
          </div>
          <div className="flex items-center gap-3">
            {/* Delete button */}
            <MoreOptions rows={rowsSelected} deleteRows={handleDeleteRows} />
            {/* Add item button */}
            <HyperButton
              className={cn(
                "ml-auto translate-x-0 delay-200 ease-[cubic-bezier(0.87,0,0.13,1)] duration-500",
                {
                  "translate-x-40": create,
                },
              )}
              label="Add Category"
              icon="plus"
              iconStyle="size-4 dark:text-cyan-200"
              solid
              fn={toogleForm}
            >
              {/* Add Category */}
            </HyperButton>
          </div>
        </div>

        {/* Table */}
        <div className="bg-transparent overflow-auto">
          <Table className="">
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-sidebar-border/60 bg-muted dark:bg-card-origin border-0"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="h-10 font-normal text-xs first:rounded-l-xl last:rounded-r-xl border-b"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                "flex h-full cursor-pointer items-center justify-between gap-4 select-none",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <Icon
                                  solid
                                  aria-hidden="true"
                                  name="triangle-right"
                                  className="size-3.5 shrink-0 text-cyan-200 dark:text-cyan-300 -rotate-90"
                                />
                              ),
                              desc: (
                                <Icon
                                  solid
                                  aria-hidden="true"
                                  name="triangle-right"
                                  className="size-3.5 shrink-0 text-mac-orange dark:text-orange-300 rotate-90"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "h-14 overflow-hidden dark:border-card-origin peer-hover:border-transparent bg-transparent hover:last:rounded-tr-2xl hover:bg-mac-blue/5 group/row dark:hover:bg-background",
                      "transition-colors duration-300",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "last:py-0 group-hover/row:first:rounded-l-lg group-hover/row:last:rounded-r-lg overflow-hidden dark:group-hover/row:bg-chalk-100/5",
                          "transition-colors duration-300",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Paginator
          state={paginationState}
          rowCount={rowCount}
          setPageSize={setPageSize}
          pageCtrl={pageControls}
        />
      </HyperCard>
    </div>
  );
}

function RowActions({ row }: { row: Row<Cat> }) {
  const handleClick = useCallback(() => console.log(row), [row]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
            onClick={handleClick}
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Move to project</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced options</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Add to favorites</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// --ease-in-out: cubic-bezier(.4,0,.2,1);
// --animate-pulse: pulse 2s cubic-bezier(.4,0,.6,1)infinite;
// --blur-xs: 4px;
// --blur-sm: 8px;
// --aspect-video: 16/9;
// --default-transition-duration: .15s;
// --default-transition-timing-function: cubic-bezier(.4,0,.2,1);
// --color-border: var(--border);
// -webkit-text-size-adjust: 100%;
// tab-size: 4;
// line-height: 1.5;
// -webkit-tap-highlight-color: transparent;
// display: flex;
// flex-direction: column;
