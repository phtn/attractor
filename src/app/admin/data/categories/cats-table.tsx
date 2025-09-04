import {
  Cell,
  CellContext,
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

import { useCallback, useMemo, useState } from "react";

import { HyperCard } from "@/components/hyper/card";

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
import { format } from "date-fns";
import { Cat } from "vx/cats/d";
import { ColumnVisibility } from "./col-visibility";
import { FilterSearch } from "./filter-search";
import { FilterStatus } from "./filter-status";
import { HeaderSorter } from "./header-sorter";
import { MoreOptions } from "./more-options";
import { Paginator } from "./pagination";
import { RowActions } from "./row-actions";
import { Button } from "@/components/ui/button";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Cat> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};
export const filterFn: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);

  if (value === null || value === undefined) return false;
  if (!filterValue) return true; // no filter applied → keep row

  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};
const statusFilterFn: FilterFn<Cat> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = String(row.getValue(columnId));
  return filterValue.includes(status);
};

const nameCell = <T,>({ row }: { row: Row<T> }) => (
  <div className="text-foreground uppercase">{row.getValue("name")}</div>
);
interface CellProps<T, D> {
  prop: D;
  ctx?: CellContext<T, unknown>;
}
const textMuted = <T, D extends string>({ prop, ctx }: CellProps<T, D>) => (
  <div className="text-muted-foreground">{ctx?.row.getValue(prop)}</div>
);
const cellMuted =
  <T, D extends string>(prop: D) =>
  (ctx: CellContext<T, unknown>) =>
    textMuted<T, D>({ prop, ctx });

const createColumns = (
  onEditCategory: (category: Cat) => void,
): ColumnDef<Cat>[] => [
  {
    header: "name",
    accessorKey: "name",
    cell: nameCell,
    size: 100,
    filterFn,
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "description",
    accessorKey: "desc",
    cell: cellMuted("desc"),
    size: 150,
    filterFn,
    enableHiding: true,
  },
  {
    header: "route",
    accessorKey: "href",
    cell: ({ row }) => (
      <div className="font-space text-muted-foreground lowercase">
        {row.getValue("href")}
      </div>
    ),
    size: 100,
    filterFn: multiColumnFilterFn,
    enableHiding: true,
    enableSorting: true,
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <div
          className={cn(
            "w-fit rounded-md py-0.5 flex items-center text-foreground/80 bg-zinc-100/60 px-1.5 space-x-1 capitalized dark:text-chalk dark:bg-chalk/5 text-xs",
            {
              "": row.getValue("active") as boolean,
            },
          )}
        >
          <div
            className={cn("size-2 rounded-full bg-blue-500", {
              "bg-orange-400": !isActive,
            })}
          />
          <span>{isActive ? "Active" : "Inactive"}</span>
        </div>
      );
    },
    size: 100,
    filterFn: statusFilterFn,
    enableSorting: true,
  },
  {
    header: "Created by",
    accessorKey: "created_by",
    cell: ({ row }) => {
      const cid = row.getValue("cid") as string;
      return (
        <div className="font-mono text-muted-foreground uppercase">
          {cid.substring(0, 4)}
        </div>
      );
    },
    size: 100,
  },
  {
    header: "Created on",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <div className="font-mono text-muted-foreground uppercase">
          {format(createdAt, "PPpp")}
        </div>
      );
    },
    size: 180,
    enableSorting: true,
  },
  {
    header: "cid",
    accessorKey: "cid",
    cell: ({ row }) => {
      const cid = row.getValue("cid") as string;
      return (
        <div className="font-space text-muted-foreground tracking-wide uppercase">
          {cid.substring(0, 4)}
        </div>
      );
    },
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

interface CatsTableProps<T extends Cat> {
  data: T[];
  create: boolean;
  edit: boolean;
  editingRowId: string | null;
  toogleForm: VoidFunction;
  toggleEditForm: (category?: Cat) => void;
}

export interface PaginationCtrl {
  disabledNext: boolean;
  disabledPrev: boolean;
  gotoNext: VoidFunction;
  gotoPrev: VoidFunction;
  gotoFirst: VoidFunction;
  gotoLast: VoidFunction;
}

export const CatsTable = <T extends Cat>({
  data,
  create,
  toogleForm,
  edit,
  editingRowId,
  toggleEditForm,
}: CatsTableProps<T>) => {
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

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = d.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id),
    );
    setData(updatedData);
    table.resetRowSelection();
  };

  const columns = useMemo(
    () => createColumns(toggleEditForm),
    [toggleEditForm],
  );

  const table = useReactTable({
    data: d,
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

  const statusCounts =
    table.getColumn("active")?.getFacetedUniqueValues() ?? new Map();

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

  const allCols = table.getAllColumns().filter((c) => c.getCanHide()) as Column<
    string,
    keyof Cat
  >[];

  const filterCol = table.getColumn("name") as Column<string, keyof Cat>;

  const rowsSelected = table.getSelectedRowModel().rows.length;

  const paginationState = table.getState().pagination;
  const rowCount = table.getRowCount();
  const setPageSize = useCallback(
    (value: string) => table.setPageSize(+value),
    [table],
  );
  const pageControls: PaginationCtrl = {
    gotoFirst: () => table.firstPage(),
    disabledPrev: !table.getCanPreviousPage(),
    gotoPrev: () => table.previousPage(),
    disabledNext: !table.getCanNextPage(),
    gotoNext: () => table.nextPage(),
    gotoLast: () => table.lastPage(),
  };

  const tableRows = table.getRowModel().rows;

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden gap-4 transition-[max-width] duration-500 ease-in-out will-change-[max-width] md:max-w-[100vw] xl:max-w-[100vw]",
        create || edit ? "xl:max-w-[58vw]" : "xl:max-w-[100vw]",
      )}
    >
      <HyperCard className="px-4 h-fit pt-6 pb-4 flex-1 min-w-0 overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 ">
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
            <Button
              variant="outline"
              className={cn(
                "ml-auto bg-background/30 translate-x-0 transition-transform duration-300 ease-in-out",
                {
                  "translate-x-40": create || edit,
                },
              )}
              onClick={toogleForm}
            >
              <Icon name="add" />
              <span className="font-sans inline-flex items-center gap-2">
                Add Category
              </span>
              {/* Add Category */}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-transparent overflow-auto">
          <Table>
            <TableHeader>
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
                        className="h-10 font-semibold text-xs first:rounded-l-lg last:rounded-r-lg border-b-[0.5px]"
                      >
                        <HeaderSorter flexRender={flexRender} header={header} />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {tableRows.length ? (
                tableRows.map((row) => renderRow(row, editingRowId))
              ) : (
                <EmptyTable colSpan={columns.length} />
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
};

const renderRow = <T extends Cat & { _id: string }>(
  row: Row<T>,
  editingRowId: string | null,
) => {
  const isEditing = editingRowId === row.getValue("cid");

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className={cn(
        "h-14 overflow-hidden dark:border-card-origin peer-hover:border-transparent bg-transparent hover:last:rounded-tr-2xl hover:bg-mac-blue/5 group/row dark:hover:bg-background",
        "transition-colors duration-50",
        {
          // Apply editing styles - same as hover but persistent
          "bg-mac-blue/5 dark:bg-sky-600/40 last:rounded-tr-2xl": isEditing,
        },
      )}
    >
      {row.getVisibleCells().map((cell) => renderCell(cell, isEditing))}
    </TableRow>
  );
};

const renderCell = <TData, TValue>(
  cell: Cell<TData, TValue>,
  isEditing: boolean,
) => (
  <TableCell
    key={cell.id}
    className={cn(
      "last:py-0 group-hover/row:first:rounded-l-lg group-hover/row:last:rounded-r-lg overflow-hidden dark:group-hover/row:bg-chalk-100/5",
      "transition-colors duration-300",
      {
        // Apply editing cell styles - same as hover but persistent
        "first:rounded-l-lg last:rounded-r-lg dark:bg-chalk-100/5": isEditing,
      },
    )}
  >
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </TableCell>
);

const EmptyTable = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="h-24 text-center rounded-xl font-space text-muted-foreground"
    >
      No results.
    </TableCell>
  </TableRow>
);
