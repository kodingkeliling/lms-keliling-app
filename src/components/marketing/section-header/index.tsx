"use client";

import { cx } from "@/utils/cx";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ title, subtitle, className }: SectionHeaderProps) => {
  return (
    <div className={cx("text-center mb-12", className)}>
      <h2 className="text-display-md font-semibold text-primary md:text-display-lg">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-tertiary md:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
