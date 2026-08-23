"use client";

import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { PaginationCardDefault } from "@/components/application/pagination/pagination";
import { Button } from "@/components/base/buttons/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx } from "@/utils/cx";

interface TablePaginationProps {
    page: number;
    total: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

function PaginationNumbersSkeleton() {
    return (
        <>
            <div className="hidden justify-center gap-0.5 md:flex" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="size-10 animate-pulse rounded-lg bg-quaternary" />
                ))}
            </div>
            <div className="flex justify-center md:hidden" aria-hidden="true">
                <div className="h-5 w-24 animate-pulse rounded-md bg-quaternary" />
            </div>
        </>
    );
}

export function TablePagination({
    page,
    total,
    onPageChange,
    isLoading = false,
    className,
}: TablePaginationProps) {
    const isDesktop = useBreakpoint("md");

    const handleChange = useCallback(
        (nextPage: number) => {
            if (isLoading) return;
            if (nextPage === page) return;
            if (nextPage < 1 || nextPage > total) return;
            onPageChange(nextPage);
        },
        [isLoading, page, total, onPageChange],
    );

    if (isLoading) {
        return (
            <div
                className={cx(
                    "flex w-full shrink-0 items-center justify-between gap-3 border-t border-secondary px-4 py-3 md:px-6 md:pt-3 md:pb-4",
                    className,
                )}
                aria-busy="true"
                aria-label="Memuat pagination"
            >
                <div className="flex flex-1 justify-start">
                    <Button iconLeading={ArrowLeft} color="secondary" size="sm" isDisabled>
                        {isDesktop ? "Previous" : undefined}
                    </Button>
                </div>

                <PaginationNumbersSkeleton />

                <div className="flex flex-1 justify-end">
                    <Button iconTrailing={ArrowRight} color="secondary" size="sm" isDisabled>
                        {isDesktop ? "Next" : undefined}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={cx("shrink-0", className)}>
            <PaginationCardDefault page={page} total={total} onPageChange={handleChange} />
        </div>
    );
}
