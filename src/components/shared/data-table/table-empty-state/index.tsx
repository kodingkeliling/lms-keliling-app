import React from "react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button, type ButtonProps } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type FeaturedIconProps = ComponentProps<typeof EmptyState.FeaturedIcon>;
type HeaderProps = ComponentProps<typeof EmptyState.Header>;

interface TableEmptyStateActionProps extends Omit<ButtonProps, "children" | "href"> {
    label: ReactNode;
    href?: string;
    wrapperClassName?: string;
}

interface TableEmptyStateProps {
    size?: "sm" | "md" | "lg";
    title: ReactNode;
    description?: ReactNode;
    action?: TableEmptyStateActionProps | null;
    iconProps?: Partial<FeaturedIconProps>;
    pattern?: HeaderProps["pattern"];
    patternSize?: HeaderProps["patternSize"];
    className?: string;
    children?: ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
    size = "sm",
    title,
    description,
    action,
    iconProps,
    pattern = "grid",
    patternSize,
    className,
    children,
}) => {
    const renderAction = () => {
        if (!action) return null;

        const { label, href, wrapperClassName, ...buttonProps } = action;

        const button = (
            <Button size="md" {...buttonProps}>
                {label}
            </Button>
        );

        if (href) {
            return (
                <Link href={href} className={wrapperClassName}>
                    {button}
                </Link>
            );
        }

        return <div className={wrapperClassName}>{button}</div>;
    };

    return (
        <div className={cx("flex items-center justify-center overflow-hidden px-8 pt-10 pb-12", className)}>
            <EmptyState size={size}>
                <EmptyState.Header pattern={pattern} patternSize={patternSize}>
                    <EmptyState.FeaturedIcon color="gray" theme="modern-neue" {...iconProps} />
                </EmptyState.Header>

                <EmptyState.Content>
                    <EmptyState.Title>{title}</EmptyState.Title>
                    {description && <EmptyState.Description>{description}</EmptyState.Description>}
                    {children}
                </EmptyState.Content>

                {action && <EmptyState.Footer>{renderAction()}</EmptyState.Footer>}
            </EmptyState>
        </div>
    );
};

export default TableEmptyState;
