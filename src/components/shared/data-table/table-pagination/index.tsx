"use client";

import { useCallback } from "react";
import { PaginationCardDefault } from "@/components/application/pagination/pagination";
import { cx } from "@/utils/cx";

interface TablePaginationProps {
    page: number;
    total: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function TablePagination({ page, total, onPageChange, className }: TablePaginationProps) {
    const handleChange = useCallback(
        (nextPage: number) => {
            if (nextPage === page) return;
            if (nextPage < 1 || nextPage > total) return;
            onPageChange(nextPage);
        },
        [page, total, onPageChange],
    );

    return (
        <div className={cx("shrink-0", className)}>
            <PaginationCardDefault
                className="border-t-0 px-0 py-0 md:px-0 md:pt-0 md:pb-0"
                page={page}
                total={total}
                onPageChange={handleChange}
            />
        </div>
    );
}
