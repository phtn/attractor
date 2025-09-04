import { ClassName } from "@/app/types";
import { cn } from "@/lib/utils";
import { CellContext } from "@tanstack/react-table";
import { type ReactNode } from "react";

interface CellOptions<T, K extends keyof T> {
  className?: ClassName;
  formatter?: (value: T[K], ctx: CellContext<T, unknown>) => ReactNode;
  fallback?: ReactNode;
}

/**
 * Generic factory for creating reusable cells.
 */
export function superCell<T, K extends keyof T>(
  prop: K,
  options: CellOptions<T, K> = {},
) {
  const CellComponent = (ctx: CellContext<T, unknown>) => {
    const rawValue = ctx.row.getValue(prop as string) as T[K];

    if (rawValue === null || rawValue === undefined) {
      return <div className={options.className}>{options.fallback ?? "—"}</div>;
    }

    const value = options.formatter
      ? options.formatter(rawValue, ctx)
      : rawValue;

    return <div className={options.className}>{value as string}</div>;
  };
  CellComponent.displayName = `SuperCell(${String(prop)})`;
  return CellComponent;
}

/**
 * Specialized cells built on top of cellFactory
 */
export const textCell = <T, K extends keyof T>(
  prop: K,
  className?: ClassName,
  fallback?: ReactNode,
) => {
  const cell = superCell<T, K>(prop, {
    className,
    fallback,
  });
  cell.displayName = `TextCell(${String(prop)})`;
  return cell;
};

export const dateCell = <T, K extends keyof T>(
  prop: K,
  formatter: (date: T[K]) => string,
  className?: ClassName,
  fallback?: ReactNode,
) => {
  const cell = superCell<T, K>(prop, {
    className,
    fallback,
    formatter: (v) => formatter(v),
  });
  cell.displayName = `DateCell(${String(prop)})`;
  return cell;
};

export const booleanCell = <T, K extends keyof T>(
  prop: K,
  labels: { trueLabel?: string; falseLabel?: string } = {},
  className?: ClassName,
  fallback?: ReactNode,
) => {
  const cell = superCell<T, K>(prop, {
    className,
    fallback,
    formatter: (v) => (
      <>
        <div
          className={cn("size-2 rounded-full bg-blue-500", {
            "bg-orange-400": !v,
          })}
        />
        {v ? (labels.trueLabel ?? "True") : (labels.falseLabel ?? "False")}
      </>
    ),
  });
  cell.displayName = `BooleanCell(${String(prop)})`;
  return cell;
};
