"use client";

import { Copy01, Server01, Check, BookOpen01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useState } from "react";
import { APP_NAME } from "@/config";
import { MCPGuideModal } from "@/components/layout/mcp-guide-modal";

export const McpInstructions = () => {
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const mcpConfig = {
        "mcpServers": {
            "lms-keliling": {
                "command": "npx",
                "args": [
                    "-y",
                    "@kodingkeliling/mcp-lms-keliling"
                ]
            }
        }
    };

    const configString = JSON.stringify(mcpConfig, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(configString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex w-full flex-col gap-8 rounded-2xl border border-secondary bg-primary p-6 shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/30">
                        <Server01 className="size-5" />
                    </div>
                    <h2 className="text-display-xs font-semibold text-primary">
                        Ditenagai oleh MCP
                    </h2>
                </div>
                <p className="text-sm text-tertiary">
                    Pembuatan soal di {APP_NAME} kini sepenuhnya dikendalikan oleh AI melalui MCP (Model Context Protocol). Hubungkan Claude Desktop Anda dengan server MCP kami untuk membuat soal latihan interaktif!
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-primary">Cara Menghubungkan (Claude Desktop):</span>
                    <ol className="list-decimal pl-5 text-sm text-tertiary flex flex-col gap-1.5">
                        <li>Buka aplikasi Claude Desktop.</li>
                        <li>Buka <b>Settings</b> &gt; <b>Developer</b> &gt; <b>Edit Config</b>.</li>
                        <li>Tambahkan konfigurasi server MCP di bawah ini ke dalam file <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-primary">claude_desktop_config.json</code> Anda.</li>
                        <li>Restart Claude Desktop.</li>
                    </ol>
                </div>

                <div className="group relative">
                    <pre className="overflow-x-auto rounded-xl border border-secondary bg-secondary/50 p-4 font-mono text-xs text-primary">
                        {configString}
                    </pre>
                    <Button
                        size="sm"
                        color="secondary"
                        iconLeading={copied ? Check : Copy01}
                        onClick={handleCopy}
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        {copied ? "Tersalin" : "Salin"}
                    </Button>
                </div>
                <p className="text-xs text-tertiary mt-2">
                    Setelah terhubung, Anda dapat langsung meminta Claude atau ChatGPT untuk membuat kuis bahasa dan menyimpannya langsung ke akun {APP_NAME} Anda! Tersedia gratis pembuatan soal sebanyak max 100 untuk akun baru.
                </p>
                <div className="mt-2 flex w-full justify-start">
                    <Button
                        size="md"
                        color="primary"
                        iconLeading={BookOpen01}
                        onClick={() => setIsGuideOpen(true)}
                    >
                        Lihat Panduan Lengkap
                    </Button>
                </div>
            </div>

            <MCPGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div>
    );
};
