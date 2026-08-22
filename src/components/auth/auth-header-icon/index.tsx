import { ReactNode } from "react";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface AuthHeaderIconProps {
    children: ReactNode;
}

export const AuthHeaderIcon = ({ children }: AuthHeaderIconProps) => {
    return (
        <div className="relative">
            <BackgroundPattern
                pattern="grid"
                size="lg"
                className="absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            />
            <BackgroundPattern
                pattern="grid"
                size="md"
                className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden"
            />
            {children}
        </div>
    );
};
