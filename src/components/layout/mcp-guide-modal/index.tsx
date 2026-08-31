"use client";

import { useState } from "react";
import Image from "next/image";
import type { Key } from "react-aria-components";
import { Modal } from "@/components/shared-assets/modal";
import { Button } from "@/components/base/buttons/button";
import { Tabs } from "@/components/application/tabs/tabs";
import { Select } from "@/components/base/select/select";
import { PaginationDot } from "@/components/application/pagination/pagination-dot";
import { ChevronLeft, ChevronRight, Link01, Copy01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { useToast } from "@/contexts/use-toast";

const MCPIcon = ({ className }: { className?: string }) => <Image src="/logo-mcp.png" alt="MCP" width={24} height={24} className={className} />;

const MCP_ENDPOINT = "https://lms.kodingkeliling.com/api/mcp";

type AITool = "chatgpt" | "claude";

interface GuideStep {
    image: string;
    caption: string;
}

const GUIDES: Record<AITool, { title: string; steps: GuideStep[] }> = {
    chatgpt: {
        title: "ChatGPT",
        steps: [
            { image: "/mcp-guides/chatgpt/step-01.png", caption: "Buka ChatGPT → Explore GPTs → pilih tab Connectors, lalu klik + New connector." },
            { image: "/mcp-guides/chatgpt/step-02.png", caption: "Pilih MCP sebagai tipe koneksi, lalu tempel URL MCP endpoint di kolom yang tersedia." },
            { image: "/mcp-guides/chatgpt/step-03.png", caption: "Klik Save & Connect. ChatGPT akan mengarahkan Anda ke halaman otorisasi LMS Keliling." },
            { image: "/mcp-guides/chatgpt/step-04.png", caption: "Login ke LMS Keliling jika diminta, lalu setujui izinnya." },
            { image: "/mcp-guides/chatgpt/step-05.png", caption: "Klik Setujui & Hubungkan. Selesai! 🎉" },
        ],
    },
    claude: {
        title: "Claude",
        steps: [
            { image: "/mcp-guides/claude/step-01.png", caption: "Buka Claude → Settings → Integrations → klik Add integration." },
            { image: "/mcp-guides/claude/step-02.png", caption: "Masukkan nama (mis. LMS Keliling) dan tempel URL MCP endpoint di kolom Integration URL." },
            { image: "/mcp-guides/claude/step-03.png", caption: "Klik Add. Claude akan meminta otorisasi; login ke LMS Keliling jika diminta." },
            { image: "/mcp-guides/claude/step-04.png", caption: "Klik Setujui & Hubungkan. LMS Keliling sekarang aktif di Claude! 🎉" },
        ],
    },
};

interface MCPGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TAB_ITEMS = [
    { id: "chatgpt", label: "ChatGPT" },
    { id: "claude", label: "Claude" },
];

export const MCPGuideModal = ({ isOpen, onClose }: MCPGuideModalProps) => {
    const { toastSuccess } = useToast();
    const [activeTool, setActiveTool] = useState<Key>("chatgpt");
    const [step, setStep] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const guide = GUIDES[activeTool as AITool];
    const totalSteps = guide.steps.length;
    const currentStep = guide.steps[step];

    const handleToolChange = (key: Key | null) => {
        if (!key) return;
        setActiveTool(key);
        setStep(0);
        setIsImageLoaded(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(MCP_ENDPOINT);
        toastSuccess("URL disalin ke clipboard!", "Berhasil");
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            maxWidth="2xl"
            title={`Panduan MCP: Connect LMS Keliling ke ${guide.title}`}
            description="Ikuti langkah-langkah berikut untuk menghubungkan LMS Keliling MCP ke model AI favorit Anda."
            icon={MCPIcon}
            iconTheme="modern"
            iconColor="gray"
            showFooter={false}
        >
            <div className="flex flex-col gap-3">
                {/* Segmented Tabs (ChatGPT | Claude) */}
                <Tabs selectedKey={activeTool} onSelectionChange={handleToolChange} className="w-full">
                    <Tabs.List type="button-minimal" items={TAB_ITEMS} className="w-full grid grid-cols-2 bg-secondary/30 rounded-lg p-1">
                        {(tab) => (
                            <Tabs.Item
                                {...tab}
                                className="w-full text-center justify-center py-2 text-xs sm:text-sm font-semibold"
                            />
                        )}
                    </Tabs.List>
                </Tabs>

                {/* MCP URL copy */}
                <div className="flex items-center gap-2 rounded-xl border border-secondary bg-secondary/30 px-3 sm:px-4 py-2 sm:py-2.5">
                    <Link01 className="size-4 shrink-0 text-tertiary" />
                    <span className="flex-1 truncate text-xs font-mono text-secondary">{MCP_ENDPOINT}</span>
                    <Button
                        size="sm"
                        color="link-color"
                        iconLeading={Copy01}
                        onClick={handleCopy}
                        className="px-0 py-0 h-auto text-xs sm:text-sm shrink-0"
                    >
                        Salin
                    </Button>
                </div>

                {/* Carousel image */}
                <div className="overflow-hidden rounded-xl border border-secondary bg-secondary/20">
                    <div className="relative aspect-video w-full">
                        <Image
                            key={`${activeTool}-${step}`}
                            src={currentStep.image}
                            alt={`Langkah ${step + 1}`}
                            fill
                            onLoad={() => setIsImageLoaded(true)}
                            className={cx(
                                "object-contain transition-opacity duration-300",
                                isImageLoaded ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </div>
                </div>

                {/* Caption */}
                <p className="text-xs sm:text-sm text-secondary text-center leading-relaxed min-h-[2.5rem] py-1 flex items-center justify-center px-1">
                    <span>
                        <span className="font-semibold text-brand-700 dark:text-brand-400">Langkah {step + 1}.</span>{" "}
                        {currentStep.caption}
                    </span>
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1 pb-1">
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={ChevronLeft}
                        onClick={() => {
                            setIsImageLoaded(false);
                            setStep((s) => Math.max(0, s - 1));
                        }}
                        isDisabled={step === 0}
                        className="px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                    >
                        <span className="hidden sm:inline">Sebelumnya</span>
                        <span className="sm:hidden">Sblm</span>
                    </Button>

                    <div className="shrink-0 flex items-center justify-center">
                        <PaginationDot
                            size="md"
                            page={step + 1}
                            total={totalSteps}
                            onPageChange={(page) => {
                                setIsImageLoaded(false);
                                setStep(page - 1);
                            }}
                        />
                    </div>

                    {step < totalSteps - 1 ? (
                        <Button
                            size="sm"
                            color="primary"
                            iconTrailing={ChevronRight}
                            onClick={() => {
                                setIsImageLoaded(false);
                                setStep((s) => Math.min(totalSteps - 1, s + 1));
                            }}
                            className="px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                        >
                            <span className="hidden sm:inline">Berikutnya</span>
                            <span className="sm:hidden">Lanjut</span>
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            color="primary"
                            onClick={onClose}
                            className="px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                        >
                            Selesai 🎉
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
