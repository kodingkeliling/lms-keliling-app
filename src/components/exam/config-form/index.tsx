"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useAuthStore } from "@/store/use-auth-store";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { SkillType, useExamStore } from "@/store/use-exam-store";
import { File06, Translate01, BookOpen01, Clock } from "@untitledui/icons";
import { useToast } from "@/contexts/use-toast";
import { getRandomDemoQuestions } from "@/data/demo-questions";
import { MCPGuideModal } from "@/components/layout/mcp-guide-modal";

import { languageOptions } from "@/utils/countries";

export const ConfigForm = ({ isPlayground = false }: { isPlayground?: boolean }) => {
    const router = useRouter();
    const { toastSuccess, toastError } = useToast();
    const createExamAction = useExamStore((state) => state.createNewExam);
    const setQuestions = useExamStore((state) => state.setQuestions);
    const selectExam = useExamStore((state) => state.selectExam);

    const [language, setLanguage] = useState("English");
    const [questionCount, setQuestionCount] = useState(10);
    const [duration, setDuration] = useState<number | null>(null); // null = Unlimited
    const [selectedSkills, setSelectedSkills] = useState<SkillType[]>(["Reading"]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuthStore();
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const hasUsedTrial = useExamStore(state => state.exams.some(e => e.ownedBy && user && e.ownedBy === user.id && !e.isDemo));

    const handleGenerate = useCallback(async () => {
        if (selectedSkills.length === 0) {
            toastError("Pilih setidaknya satu skill yang ingin diuji.", "Belum Memilih Skill");
            return;
        }

        if (questionCount <= 0) {
            toastError("Jumlah soal harus lebih dari 0.", "Jumlah Tidak Valid");
            return;
        }

        setIsLoading(true);
        try {
            // Create exam
            const examId = createExamAction({
                language,
                questionCount,
                skills: selectedSkills,
                duration,
            }, undefined, true); // isDemo = true

            // Generate demo questions according to chosen language
            const demoQuestions = getRandomDemoQuestions(questionCount, selectedSkills, language);


            // Select exam and set questions immediately
            selectExam(examId);
            setQuestions(demoQuestions);

            toastSuccess("Demo soal berhasil disiapkan.", "Berhasil");
            router.push(`/playground/${examId}`);
        } catch (e) {
            console.error(e);
            toastError("Gagal menyiapkan demo soal.", "Error");
            setIsLoading(false);
        }
    }, [selectedSkills, questionCount, language, createExamAction, selectExam, setQuestions, router, toastError, toastSuccess]);

    const toggleSkill = (skill: SkillType) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    return (
        <>
            <div className="flex w-full flex-col gap-2 rounded-2xl border border-secondary bg-primary p-6 shadow-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-display-xs font-semibold text-primary">
                            Coba Demo Soal (Gratis)
                        </h2>
                    </div>
                    <p className="text-sm text-tertiary">
                        Pilih bahasa dan rasakan pengalaman belajar yang diambil secara acak dari database (Unlimited Demo). Untuk membuat soal sendiri menggunakan AI, gunakan MCP!
                    </p>
                    {!hasUsedTrial && (
                        <div className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 w-fit mt-1">
                            <div>
                                ✨ Terdapat free trial max 100 soal tersimpan untuk akun baru! Coba sekarang dengan
                                {isAuthenticated ? (
                                    <Button size="sm" color="link-color" onClick={() => setIsGuideModalOpen(true)} className="ml-2">
                                        Tambah Ujian
                                    </Button>
                                ) : (
                                    <Button size="sm" color="link-color" onClick={() => router.push('/login?redirect=/playground')} className="ml-2">
                                        Login
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    {/* Language */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Bahasa yang Diuji</Label>
                        <Select
                            selectedKey={language}
                            onSelectionChange={(key) => setLanguage(key as string)}
                            placeholder="Pilih bahasa"
                            placeholderIcon={Translate01}
                            items={languageOptions}
                        >
                            {(item) => (
                                <Select.Item key={item.id} id={item.id} label={item.label} icon={item.icon}>
                                    {item.label}
                                </Select.Item>
                            )}
                        </Select>
                    </div>


                    {/* Skills */}
                    <div className="flex flex-col gap-3">
                        <Label>Skill yang Diuji</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {(["Reading", "Writing", "Speaking", "Listening"] as SkillType[]).map((skill) => (
                                <Checkbox
                                    key={skill}
                                    label={skill}
                                    isSelected={selectedSkills.includes(skill)}
                                    onChange={() => toggleSkill(skill)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Question Count */}
                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="Jumlah Soal"
                            type="number"
                            inputMode="numeric"
                            value={questionCount.toString()}
                            onChange={(val: string) => {
                                const num = parseInt(val) || 0;
                                setQuestionCount(Math.max(0, Math.min(100, num)));
                            }}
                            placeholder="Contoh: 10"
                            icon={File06}
                            hint="Maksimal 100 soal untuk mode demo."
                        />
                    </div>

                    {/* Exam Duration */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Durasi Ujian</Label>
                        <Select
                            selectedKey={duration === null ? "unlimited" : duration.toString()}
                            onSelectionChange={(key) => {
                                const val = key as string;
                                setDuration(val === "unlimited" ? null : parseInt(val));
                            }}
                            placeholder="Pilih durasi"
                            placeholderIcon={Clock}
                            items={[
                                { id: "unlimited", label: "Unlimited (Tanpa Batas)", icon: Clock },
                                { id: "15", label: "15 Menit", icon: Clock },
                                { id: "30", label: "30 Menit", icon: Clock },
                                { id: "45", label: "45 Menit", icon: Clock },
                                { id: "60", label: "60 Menit", icon: Clock },
                            ]}
                        >
                            {(item) => (
                                <Select.Item key={item.id} id={item.id} label={item.label} icon={item.icon}>
                                    {item.label}
                                </Select.Item>
                            )}
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <Button size="lg" onClick={handleGenerate} className="w-full">Demo Soal</Button>
                </div>
            </div>

            <MCPGuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
        </>
    );
};
