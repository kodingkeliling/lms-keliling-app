"use client";

import { useState } from "react";
import { Mail01, Phone, MarkerPin01, Check } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Form } from "@/components/base/form/form";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { SOCIAL_LINKS } from "@/data/social-links";

const CONTACT_INFO = [
    {
        icon: Mail01,
        label: "Email",
        value: "lms.keliling@gmail.com",
        href: "mailto:lms.keliling@gmail.com",
    },
    {
        icon: Phone,
        label: "WhatsApp",
        value: "081257578571",
        href: "https://wa.me/6281257578571",
    },
    {
        icon: MarkerPin01,
        label: "Lokasi",
        value: "Bandung, Indonesia",
        href: null,
    },
];

const CONTACT_EMAIL = "lms.keliling@gmail.com";

type FormState = "idle" | "success";

export const ContactSection = () => {
    const [formState, setFormState] = useState<FormState>("idle");
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subject = encodeURIComponent(`Pesan dari ${form.name} — LMS Keliling`);
        const body = encodeURIComponent(
            `Halo LMS Keliling,\n\nNama: ${form.name}\nEmail: ${form.email}\n\nPesan:\n${form.message}\n\n--\nDikirim melalui form kontak LMS Keliling`
        );

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

        setFormState("success");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <section className="w-full py-12 md:py-16">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                {/* Heading */}
                <div className="reveal flex flex-col items-center gap-3 text-center mb-12">
                    <h2 className="text-display-sm font-semibold text-primary md:text-display-md">Hubungi Kami</h2>
                    <div className="h-1 w-16 rounded-full bg-brand-500" />
                    <p className="text-md text-tertiary max-w-md mt-1">
                        Punya pertanyaan atau ingin berkolaborasi? Kami siap membantu kamu.
                    </p>
                </div>

                <div className="reveal delay-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Left: Form */}
                    <div className="rounded-2xl border border-secondary bg-primary p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-primary mb-6">Kirim Pesan</h3>

                        {formState === "success" ? (
                            <div className="flex flex-col items-center gap-4 py-10 text-center">
                                <FeaturedIcon icon={Check} color="success" theme="light" size="xl" />
                                <div>
                                    <p className="font-semibold text-primary">Pesan siap dikirim!</p>
                                    <p className="text-sm text-tertiary mt-1">
                                        Aplikasi email kamu akan terbuka dengan pesan yang sudah terisi. Tinggal kirim!
                                    </p>
                                </div>
                                <Button
                                    color="link-color"
                                    size="sm"
                                    onClick={() => setFormState("idle")}
                                >
                                    Kirim pesan lain
                                </Button>
                            </div>
                        ) : (
                            <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <Input
                                    isRequired
                                    label="Nama"
                                    type="text"
                                    size="md"
                                    placeholder="Nama lengkap kamu"
                                    value={form.name}
                                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                                />

                                <Input
                                    isRequired
                                    label="Email"
                                    type="email"
                                    size="md"
                                    placeholder="email@kamu.com"
                                    value={form.email}
                                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                                />

                                <TextArea
                                    isRequired
                                    label="Pesan"
                                    placeholder="Tulis pesanmu di sini..."
                                    rows={5}
                                    value={form.message}
                                    onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                                />

                                <Button type="submit" size="lg">
                                    Kirim Pesan
                                </Button>
                            </Form>
                        )}
                    </div>

                    {/* Right: Contact info */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold text-primary">Informasi Kontak</h3>
                            <p className="text-sm text-tertiary">
                                Jangan ragu untuk menghubungi kami kapan saja. Kami dengan senang hati akan membantu.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {CONTACT_INFO.map((item) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-primary">{item.label}</p>
                                            <p className="text-sm text-tertiary">{item.value}</p>
                                        </div>
                                    </div>
                                );

                                return item.href ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target={item.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="group hover:opacity-80 transition-opacity"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={item.label}>{content}</div>
                                );
                            })}
                        </div>

                        <div className="border-t border-secondary pt-6">
                            <p className="text-sm font-semibold text-primary mb-4">Ikuti Kami</p>
                            <div className="flex items-center gap-4">
                                {SOCIAL_LINKS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="flex size-10 items-center justify-center rounded-xl border border-secondary text-tertiary hover:text-primary hover:border-primary transition-colors"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
