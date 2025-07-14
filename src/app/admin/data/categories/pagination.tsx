import { HyperButton } from "@/components/hyper";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { PaginationState } from "@tanstack/react-table";
import { useId } from "react";
import { type PaginationCtrl } from "./cats-table";

interface Props {
  state: PaginationState;
  rowCount: number;
  setPageSize: (v: string) => void;
  pageCtrl: PaginationCtrl;
}
export const Paginator = ({
  state,
  rowCount,
  setPageSize,
  pageCtrl,
}: Props) => {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-8">
      {/* Results per page */}
      <div className="flex items-center ">
        <Label
          htmlFor={id}
          className="max-sm:sr-only space-x-2 font-mono text-muted-foreground tracking-tight"
        >
          <span className="font-semibold rounded-sm bg-muted dark:bg-zinc-400/10 py-0.5 px-2">
            {rowCount}
          </span>
          <span>items</span>
        </Label>
        <Select value={state.pageSize.toString()} onValueChange={setPageSize}>
          <SelectTrigger id={id} className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            {[5, 10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Page number information */}
      <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p
          className="hidden text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground">
            {state.pageIndex * state.pageSize + 1}-
            {Math.min(
              Math.max(state.pageIndex * state.pageSize + state.pageSize, 0),
              rowCount,
            )}
          </span>{" "}
          of <span className="text-foreground">{rowCount}</span>
        </p>
      </div>

      {/* Pagination buttons */}
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <HyperButton
                icon="chevron-right"
                className="disabled:pointer-events-none size-8 disabled:opacity-50"
                fn={pageCtrl.gotoNext}
                disabled={pageCtrl.disabledNext}
                aria-label="Go to next page"
                iconStyle="size-5"
              />
            </PaginationItem>
            {/* First page button */}
            {/* <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={pageCtrl.gotoFirst}
                disabled={pageCtrl.disabledPrev}
                aria-label="Go to first page"
              >
                <ChevronFirstIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem> */}
            {/* Previous page button */}
            {/* <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={pageCtrl.gotoPrev}
                disabled={pageCtrl.disabledPrev}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem> */}
            {/* Next page button */}

            {/* Last page button */}
            {/* <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={pageCtrl.gotoLast}
                disabled={pageCtrl.disabledNext}
                aria-label="Go to last page"
              >
                <ChevronLastIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem> */}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
