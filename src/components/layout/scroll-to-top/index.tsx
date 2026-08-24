"use client";

import { useEffect, useState } from "react";
import { ArrowCircleUp } from "@untitledui/icons";

export const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll ke atas"
            className={`fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-all duration-300 hover:bg-brand-700 hover:scale-110 active:scale-95 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
        >
            <ArrowCircleUp className="size-6" />
        </button>
    );
};
