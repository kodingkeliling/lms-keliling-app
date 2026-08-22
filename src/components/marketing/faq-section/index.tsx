"use client";

import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";

const FAQS = [
    {
        question: "Apakah LMS Keliling benar-benar gratis?",
        answer: "Ya! Kamu bisa mencoba LMS Keliling secara gratis untuk 10 soal pertama tanpa perlu mendaftar. Setelah itu, kamu perlu membuat akun dan memilih paket yang sesuai untuk terus menggunakan layanan.",
    },
    {
        question: "Bahasa apa saja yang tersedia?",
        answer: "Saat ini LMS Keliling mendukung 14+ bahasa termasuk Inggris, Jepang, Korea, Prancis, Spanyol, Mandarin, Arab, Jerman, Italia, Portugis, Rusia, Hindi, Sunda, dan Jawa. Kami terus menambahkan bahasa baru secara berkala.",
    },
    {
        question: "Skill apa saja yang bisa diuji?",
        answer: "LMS Keliling mendukung 4 skill utama pembelajaran bahasa: Reading (membaca), Writing (menulis), Speaking (berbicara), dan Listening (mendengarkan). Kamu bisa memilih satu atau kombinasi beberapa skill sekaligus.",
    },
    {
        question: "Bagaimana cara kerja pembuatan soal AI?",
        answer: "LMS Keliling menggunakan berbagai provider AI terkemuka (Groq, Google Gemini, OpenAI, Anthropic Claude) untuk menghasilkan soal yang unik dan relevan setiap kali kamu memulai sesi belajar. Soal dijamin tidak pernah sama dua kali.",
    },
    {
        question: "Apa itu Custom API Key?",
        answer: "Pengguna paket Eksklusif dan Luxury dapat menggunakan API key mereka sendiri dari provider pilihan. Ini memungkinkan kamu melewati batas kuota global dan menggunakan model AI favoritmu secara langsung.",
    },
    {
        question: "Bagaimana cara membayar?",
        answer: "Untuk saat ini, pembayaran dilakukan melalui transfer manual. Setelah pembayaran dikonfirmasi, akun kamu akan langsung ditingkatkan. Hubungi kami via WhatsApp di nomor 081257578571 untuk informasi lebih lanjut.",
    },
    {
        question: "Apakah hasil belajar tersimpan?",
        answer: "Ya, riwayat sesi belajar tersimpan di perangkatmu (local storage). Kamu bisa melihat kembali semua soal dan jawabanmu kapan saja melalui tombol History di halaman utama. Login diperlukan untuk melihat detail hasil sesi.",
    },
    {
        question: "Berapa lama akses paket berlaku?",
        answer: "Akses paket berlaku selama 30 hari sejak aktivasi. Setelah masa berlaku habis, kamu bisa memperpanjang dengan pembelian baru. Kami juga menyediakan paket bulanan dan tahunan dengan harga yang lebih terjangkau.",
    },
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-secondary bg-primary shadow-xs overflow-hidden transition-shadow hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
                <span className="text-md font-semibold text-primary">{question}</span>
                <ChevronDown
                    className={cx(
                        "size-5 shrink-0 text-tertiary transition-transform duration-300",
                        isOpen ? "rotate-180" : ""
                    )}
                />
            </button>
            <div className={cx(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="min-h-0 overflow-hidden">
                    <p className="px-6 pb-5 text-md text-tertiary leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};

export const FaqSection = () => {
    return (
        <section className="w-full py-10 md:py-16">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                {/* Center heading */}
                <div className="flex flex-col items-center gap-4 text-center mb-12">
                    <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="text-md text-tertiary max-w-lg">
                        Ada pertanyaan lain? Hubungi kami langsung via{" "}
                        <a
                            href="https://wa.me/6281257578571?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20Fraise"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                        >
                            WhatsApp
                        </a>
                        .
                    </p>
                </div>

                {/* Vertical stack of individual cards */}
                <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                    {FAQS.map((faq) => (
                        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};
