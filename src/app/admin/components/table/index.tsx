import {
  Cell,
  Column,
  ColumnFiltersState,
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
import { ColumnView } from "./column-view";
import { Search } from "./search";
import { Filter } from "./filter";
import { ColumnSort } from "./column-sort";
// import { MoreOptions } from "./more-options";
import { PageControl, Paginator } from "./pagination";
import { Button } from "@/components/ui/button";
import { createColumns } from "./create-columns";

interface TableProps<T> {
  data: T[];
  create: boolean;
  edit: boolean;
  editingRowId: string | null;
  toogleForm: VoidFunction;
  toggleEditForm: (category?: T) => void;
}

export const DataTable = <T,>({
  data,
  edit,
  create,
  toogleForm,
  editingRowId,
  toggleEditForm,
}: TableProps<T>) => {
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

  const [_data] = useState<T[]>(data);

  // const handleDeleteRows = () => {
  //   const selectedRows = table.getSelectedRowModel().rows;
  //   const updatedData = d.filter(
  //     (item) => !selectedRows.some((row) => row.original.id === item.id),
  //   );
  //   setData(updatedData);
  //   table.resetRowSelection();
  // };

  const columns = useMemo(
    () => createColumns(toggleEditForm),
    [toggleEditForm],
  );

  const table = useReactTable({
    data: _data,
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
    keyof T
  >[];

  const filterCol = table.getColumn("name") as Column<string, keyof T>;

  // const rowsSelected = table.getSelectedRowModel().rows.length;

  const paginationState = table.getState().pagination;
  const rowCount = table.getRowCount();
  const setPageSize = useCallback(
    (value: string) => table.setPageSize(+value),
    [table],
  );
  const pageControl: PageControl = {
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
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-sans tracking-tight">
              Categories
            </h2>
            <Search col={filterCol} />
            <Filter
              statusCount={statusCounts}
              selected={selectedStatuses}
              onStatusChange={onStatusChange}
              uniqueValues={uniqueStatusValues}
            />
            <ColumnView cols={allCols} />
          </div>
          <div className="flex items-center gap-3">
            {/* Delete button */}
            {/*<MoreOptions rows={rowsSelected} deleteRows={handleDeleteRows} />*/}
            {/* Add item button */}
            <Button
              variant="outline"
              className={cn(
                "ml-auto bg-background/30 translate-x-0 transition-transform duration-200 ease-in-out",
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
                        <ColumnSort flexRender={flexRender} header={header} />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {tableRows.length ? (
                tableRows.map((row) => renderRow(row, editingRowId, row.id))
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
          pageControl={pageControl}
        />
      </HyperCard>
    </div>
  );
};

const renderRow = <T,>(
  row: Row<T>,
  editingRowId: string | null,
  rowId: keyof T,
) => {
  const isEditing = editingRowId === row.getValue(rowId as string);

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
