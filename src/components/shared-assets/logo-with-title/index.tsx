import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/config";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoConfig {
    logoSize: number;
    titleWidth: number;
    titleHeight: number;
}

const SIZE_MAP: Record<LogoSize, LogoConfig> = {
    sm: { logoSize: 28, titleWidth: 60, titleHeight: 24 },
    md: { logoSize: 32, titleWidth: 68, titleHeight: 28 },
    lg: { logoSize: 40, titleWidth: 80, titleHeight: 32 },
    xl: { logoSize: 48, titleWidth: 96, titleHeight: 38 },
};

interface LogoWithTitleProps {
    /** Size preset — sm (28px), md (32px), lg (40px), xl (48px). Defaults to "lg". */
    size?: LogoSize;
    /** If true, only the logo icon is rendered (no title images). */
    logoOnly?: boolean;
    /** If provided, forces the title image to be either light or dark regardless of system theme. */
    forceTheme?: "light" | "dark";
    /** If provided, the logo becomes a Next.js Link. */
    href?: string;
    className?: string;
}

const LogoContent = ({ size = "lg", logoOnly = false, forceTheme }: Pick<LogoWithTitleProps, "size" | "logoOnly" | "forceTheme">) => {
    const { logoSize, titleWidth, titleHeight } = SIZE_MAP[size];

    return (
        <>
            <Image
                src="/logo.png"
                className="object-contain"
                alt={`${APP_NAME} Logo`}
                width={logoSize}
                height={logoSize}
            />
            {!logoOnly && (
                <>
                    {/* Light-mode title (hidden in dark unless forceTheme="light") */}
                    <Image
                        src="/title-dark.png"
                        className={`object-contain ${forceTheme === "light" ? "block" : forceTheme === "dark" ? "hidden" : "dark:hidden"}`}
                        alt={APP_NAME}
                        width={titleWidth}
                        height={titleHeight}
                    />
                    {/* Dark-mode title (hidden in light unless forceTheme="dark") */}
                    <Image
                        src="/title-light.png"
                        className={`object-contain ${forceTheme === "dark" ? "block" : forceTheme === "light" ? "hidden" : "hidden dark:block"}`}
                        alt={APP_NAME}
                        width={titleWidth}
                        height={titleHeight}
                    />
                </>
            )}
        </>
    );
};

/**
 * Renders the LMS Keliling logo + title images.
 *
 * Props:
 * - `size`     — "sm" | "md" | "lg" | "xl" (default "lg")
 * - `logoOnly`   — render only the logo icon, no title text
 * - `forceTheme` — "light" | "dark" to override system theme response
 * - `href`       — wraps the content in a Next.js Link
 */
export const LogoWithTitle = ({ size = "lg", logoOnly = false, forceTheme, href, className }: LogoWithTitleProps) => {
    const wrapperClass = `flex items-center gap-2 shrink-0 ${className ?? ""}`.trim();

    if (href) {
        return (
            <Link href={href} className={wrapperClass}>
                <LogoContent size={size} logoOnly={logoOnly} forceTheme={forceTheme} />
            </Link>
        );
    }

    return (
        <div className={wrapperClass}>
            <LogoContent size={size} logoOnly={logoOnly} forceTheme={forceTheme} />
        </div>
    );
};
