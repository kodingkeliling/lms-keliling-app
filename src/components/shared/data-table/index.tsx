"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, ChevronSelectorVertical, ChevronUp, Plus, SearchLg } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TablePagination } from "@/components/shared/data-table/table-pagination";
import { cx } from "@/utils/cx";

// ─── Column definition ────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
    tooltip?: string;
    width?: string;
    sticky?: "left" | "right";
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableProps<T extends { id: string }> {
    title: string;
    description?: string;
    badge?: ReactNode;
    columns: DataTableColumn<T>[];
    data: T[];
    isLoading?: boolean;
    searchable?: boolean;
    searchFields?: (keyof T)[];
    addLabel?: string;
    onAdd?: () => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onRowClick?: (row: T) => void;
    rowActions?: boolean;
    headerTrailing?: ReactNode;
    emptyState?: ReactNode;
    pageSize?: number;
    maxHeight?: string;
    loadingLabel?: string;
    containerClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string }>({
    title,
    description,
    badge,
    columns,
    data,
    isLoading = false,
    searchable = true,
    searchFields,
    addLabel,
    onAdd,
    onEdit,
    onDelete,
    onRowClick,
    rowActions = true,
    headerTrailing,
    emptyState,
    pageSize = 10,
    maxHeight,
    loadingLabel = "Memuat",
    containerClassName,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [page, setPage] = useState(1);

    const columnCount = Math.max(columns.length + (rowActions ? 1 : 0), 1);

    const handleSort = (key: string, sortable?: boolean) => {
        if (!sortable || isLoading) return;

        let newOrder: "asc" | "desc" | null = "asc";
        if (sortBy === key && sortOrder === "asc") {
            newOrder = "desc";
        } else if (sortBy === key && sortOrder === "desc") {
            newOrder = null;
        }

        setSortBy(newOrder ? key : null);
        setSortOrder(newOrder);
    };

    const filtered = search.trim()
        ? data.filter((row) => {
              const fields = searchFields ?? (Object.keys(row) as (keyof T)[]);
              return fields.some((field) => {
                  const val = row[field];
                  return typeof val === "string" && val.toLowerCase().includes(search.toLowerCase());
              });
          })
        : data;

    const sorted =
        sortBy && sortOrder
            ? [...filtered].sort((a, b) => {
                  const valA = (a as Record<string, unknown>)[sortBy];
                  const valB = (b as Record<string, unknown>)[sortBy];
                  const cmp =
                      typeof valA === "string" && typeof valB === "string"
                          ? valA.localeCompare(valB)
                          : (valA as number) > (valB as number)
                            ? 1
                            : -1;
                  return sortOrder === "desc" ? -cmp : cmp;
              })
            : filtered;

    const totalPages = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
    const currentPage = Math.min(page, Math.max(1, totalPages));
    const paginatedData =
        pageSize > 0 ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

    const showPagination = pageSize > 0 && (isLoading || sorted.length > 0);

    const defaultHeaderTrailing = (
        <div className="flex items-center gap-3">
            {searchable && (
                <Input
                    size="sm"
                    placeholder="Cari..."
                    icon={SearchLg}
                    value={search}
                    onChange={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}
                    aria-label="Cari"
                    className="w-full sm:w-72"
                />
            )}
            {onAdd && addLabel && (
                <Button size="sm" iconLeading={Plus} onClick={onAdd}>
                    {addLabel}
                </Button>
            )}
        </div>
    );

    const trailingContent =
        headerTrailing ??
        (searchable || (onAdd && addLabel) ? defaultHeaderTrailing : null);

    const resolvedBadge =
        badge !== undefined && badge !== null ? (
            <Badge color="gray" size="sm" type="modern">
                {badge} Items
            </Badge>
        ) : null;

    const getStickyClass = (sticky?: "left" | "right", isActions = false) => {
        if (sticky === "left") {
            return "sticky left-0 z-10 bg-primary shadow-[1px_0_0_0_var(--color-border-secondary)]";
        }
        if (sticky === "right" || isActions) {
            return "sticky right-0 z-10 bg-primary shadow-[-1px_0_0_0_var(--color-border-secondary)]";
        }
        return "";
    };

    return (
        <div className={cx("flex min-h-0 flex-1 flex-col", containerClassName)}>
            <div className="-m-1 min-h-0 flex-1 overflow-visible p-1">
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-lg">
                    {/* Card header */}
                    <div className="flex shrink-0 flex-col justify-between gap-4 border-b border-secondary p-8 md:flex-row md:items-center">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                                {isLoading ? (
                                    <div
                                        aria-label={loadingLabel}
                                        className="h-5 w-16 animate-pulse rounded-md bg-quaternary"
                                    />
                                ) : (
                                    resolvedBadge
                                )}
                            </div>
                            {description ? (
                                <p className="mt-1 text-sm text-tertiary">{description}</p>
                            ) : null}
                        </div>
                        {trailingContent ? <div className="shrink-0">{trailingContent}</div> : null}
                    </div>

                    {/* Scrollable table area */}
                    <div
                        className={cx(
                            "scrollbar-hide flex-1 overflow-x-auto overflow-y-auto",
                            maxHeight,
                        )}
                    >
                        <table
                            className={cx(
                                "w-full min-w-max table-auto border-collapse",
                                isLoading && "h-full",
                            )}
                        >
                            {columns.length > 0 && (
                                <thead className="sticky top-0 z-20 bg-primary">
                                    <tr>
                                        {columns.map((col) => {
                                            const isCurrentlySorted = sortBy === col.key;
                                            const isAscending = sortOrder === "asc";
                                            const isSortable = col.sortable === true && !isLoading;

                                            return (
                                                <th
                                                    key={col.key}
                                                    className={cx(
                                                        "overflow-hidden border-b border-secondary bg-primary px-8 py-4 text-left whitespace-nowrap",
                                                        col.width ?? "min-w-fit",
                                                        getStickyClass(col.sticky),
                                                    )}
                                                >
                                                    <div
                                                        className={cx(
                                                            "flex items-center gap-1 text-tertiary transition-colors duration-150",
                                                            isSortable && "cursor-pointer hover:text-secondary",
                                                        )}
                                                        onClick={() => handleSort(col.key, col.sortable)}
                                                    >
                                                        <span className="truncate text-xs font-semibold tracking-wide">
                                                            {col.label}
                                                        </span>
                                                        {isSortable && (
                                                            <div className="flex flex-col">
                                                                {isCurrentlySorted ? (
                                                                    isAscending ? (
                                                                        <ChevronUp className="size-3" />
                                                                    ) : (
                                                                        <ChevronDown className="size-3" />
                                                                    )
                                                                ) : (
                                                                    <ChevronSelectorVertical className="size-3" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                        {rowActions && (
                                            <th
                                                className={cx(
                                                    "w-20 overflow-hidden border-b border-secondary bg-primary px-8 py-4 text-left whitespace-nowrap",
                                                    getStickyClass(undefined, true),
                                                )}
                                            />
                                        )}
                                    </tr>
                                </thead>
                            )}

                            <tbody className={cx("divide-y divide-secondary/50", isLoading && "h-full")}>
                                {isLoading ? (
                                    <tr className="h-full">
                                        <td
                                            aria-label={loadingLabel}
                                            className="h-full min-h-80 animate-pulse bg-tertiary"
                                            colSpan={columnCount}
                                        />
                                    </tr>
                                ) : paginatedData.length > 0 ? (
                                    paginatedData.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={cx(
                                                "group transition-colors",
                                                onRowClick &&
                                                    "cursor-pointer hover:bg-primary_hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
                                            )}
                                            tabIndex={onRowClick ? 0 : undefined}
                                            onClick={(event) => {
                                                if (!onRowClick) return;
                                                const target = event.target as HTMLElement;
                                                if (
                                                    target.closest(
                                                        'button, a, input, select, textarea, [role="button"], [data-actions-column]',
                                                    )
                                                ) {
                                                    return;
                                                }
                                                onRowClick(row);
                                            }}
                                            onKeyDown={(event) => {
                                                if (!onRowClick || (event.key !== "Enter" && event.key !== " ")) return;
                                                event.preventDefault();
                                                onRowClick(row);
                                            }}
                                        >
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className={cx(
                                                        "min-w-0 overflow-hidden border-b border-secondary/50 bg-primary px-8 py-5 transition-colors duration-150 group-hover:bg-primary_hover",
                                                        col.width ?? "min-w-fit",
                                                        getStickyClass(col.sticky),
                                                    )}
                                                >
                                                    {col.render
                                                        ? col.render(row)
                                                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                                                </td>
                                            ))}
                                            {rowActions && (
                                                <td
                                                    className={cx(
                                                        "min-w-0 overflow-hidden border-b border-secondary/50 bg-primary px-8 py-5 transition-colors duration-150 group-hover:bg-primary_hover",
                                                        "w-20 cursor-default",
                                                        getStickyClass(undefined, true),
                                                    )}
                                                    data-actions-column="true"
                                                >
                                                    <DataTableRowActions
                                                        onEdit={onEdit ? () => onEdit(row) : undefined}
                                                        onDelete={onDelete ? () => onDelete(row) : undefined}
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="bg-primary" colSpan={columnCount}>
                                            {emptyState ?? (
                                                <span className="block px-8 py-12 text-sm text-tertiary">
                                                    Tidak ada data.
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {showPagination && (
                        <TablePagination
                            page={currentPage}
                            total={Math.max(totalPages, 1)}
                            onPageChange={setPage}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function DataTableRowActions({
    onEdit,
    onDelete,
}: {
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    if (!onEdit && !onDelete) return null;

    return (
        <div className="flex items-center gap-3">
            {onEdit && (
                <Button size="sm" color="link-color" onClick={onEdit}>
                    Edit
                </Button>
            )}
            {onDelete && (
                <Button size="sm" color="link-destructive" onClick={onDelete}>
                    Hapus
                </Button>
            )}
        </div>
    );
}

export { TableEmptyState } from "@/components/shared/data-table/table-empty-state";
export { TablePagination } from "@/components/shared/data-table/table-pagination";
