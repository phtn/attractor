import {
  Cell,
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

import { HyperButton } from "@/components/hyper";
import { HyperCard } from "@/components/hyper/card";
import { Badge } from "@/components/ui/badge";

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
  const searchableRowContent = `${row.original.name}`.toLowerCase();
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

const createColumns = (
  onEditCategory: (category: Cat) => void,
): ColumnDef<Cat>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-sans text-foreground uppercase">
        {row.getValue("name")}
      </div>
    ),
    size: 100,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Description",
    accessorKey: "desc",
    cell: ({ row }) => (
      <div className="font-sans text-muted-foreground lowercase">
        {row.getValue("desc")}
      </div>
    ),
    size: 150,
    filterFn: multiColumnFilterFn,
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
    cell: ({ row }) => (
      <Badge
        className={cn("px-1 uppercase text-primary-foreground text-xs", {
          "bg-muted text-mac-blue dark:bg-chalk/10 dark:text-cyan-200":
            row.getValue("active") as boolean,
        })}
      >
        {row.getValue("active") ? "active" : "inactive"}
      </Badge>
    ),
    size: 80,
    filterFn: statusFilterFn,
    enableSorting: true,
  },

  // {
  //   header: "Created by",
  //   accessorKey: "created_by",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("balance"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);
  //     return formatted;
  //   },
  //   size: 120,
  // },
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

  const tableRows = useMemo(() => table.getRowModel().rows, [table]);

  return (
    <div
      className={cn(
        "flex w-full transition-[max-width] duration-500 ease-in xl:max-w-[calc(82lvw)] md:max-w-[100lvw]",
        {
          "xl:max-w-[calc(100lvw-42vw)] gap-4": create || edit,
        },
      )}
    >
      <HyperCard className="space-y-4 px-4 h-fit pt-6 pb-4 flex-1">
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
                  "translate-x-40": create || edit,
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
                        className="h-10 font-normal text-xs first:rounded-l-lg last:rounded-r-lg border-b"
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
        "transition-colors duration-300",
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
