import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Star01 } from "@untitledui/icons";
import type { BadgeColors } from "@/components/base/badges/badge-types";

export function getPlanBadgeColor(label?: string): BadgeColors {
    if (label === "Luxury") return "warning"; // Gold/Yellow
    if (label === "Eksklusif") return "purple"; // Purple
    if (label === "Premium") return "brand"; // Blue/Brand
    return "gray"; // Free / default
}

export function getPlanTextColor(label?: string): string {
    if (label === "Luxury") return "text-amber-500 dark:text-amber-400";
    if (label === "Eksklusif") return "text-purple-600 dark:text-purple-400";
    if (label === "Premium") return "text-orange-500 dark:text-orange-400";
    return "text-primary";
}

interface PlanBadgeProps {
    label?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const PlanBadge = ({ label = "Free", size = "sm", className }: PlanBadgeProps) => {
    const color = getPlanBadgeColor(label);

    return (
        <BadgeWithIcon size={size} type="color" color={color} iconLeading={Star01} className={className}>
            {label}
        </BadgeWithIcon>
    );
};
