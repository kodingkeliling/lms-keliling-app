"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { FeaturedCardProgressBar } from "@/components/application/app-navigation/base-components/featured-cards";
import { Settings01, Edit03 } from "@untitledui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AvatarPickerModal } from "@/components/profile/avatar-picker-modal";
import { getAvatarUrl } from "@/data/avatars";

export default function SettingsPage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/profile/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menyimpan perubahan");

            if (data.user && user) {
                setUser({ ...user, name: data.user.name });
            }
            setPassword("");
            setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        } catch (err: unknown) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan" });
        } finally {
            setSaving(false);
        }
    };

    const avatarUrl = getAvatarUrl(user?.avatarId);

    return (
        <div className="flex max-w-xl flex-col gap-8">
            <DashboardPageHeader
                icon={Settings01}
                title="Pengaturan Profil"
                description="Kelola informasi akun dan kata sandi Anda di sini."
            />

            {/* Avatar Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <h3 className="text-sm font-semibold text-primary">Avatar</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={avatarUrl}
                            alt={user?.name || "Avatar"}
                            className="size-16 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-primary">
                            {user?.name || user?.email?.split("@")[0] || "Pengguna"}
                        </p>
                        <p className="text-xs text-tertiary">Avatar hewan pilihanmu</p>
                        <Button
                            color="secondary"
                            size="sm"
                            iconLeading={Edit03}
                            onClick={() => setShowAvatarPicker(true)}
                            className="mt-1 w-fit"
                        >
                            Ganti Avatar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 rounded-xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-secondary">
                        Email Address
                    </label>
                    <Input id="email" type="email" value={user?.email || ""} isReadOnly />
                    <p className="text-xs text-tertiary">Alamat email tidak dapat diubah.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-secondary">
                        Nama Lengkap
                    </label>
                    <Input id="name" type="text" value={name} onChange={setName} />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-secondary">
                        Kata Sandi Baru
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Biarkan kosong jika tidak merubah"
                    />
                </div>

                {message && (
                    <p className={`text-sm ${message.type === "success" ? "text-success-600 dark:text-success-400" : "text-error-600 dark:text-error-400"}`}>
                        {message.text}
                    </p>
                )}

                <div className="mt-2 text-right">
                    <Button color="primary" onClick={handleSave} isLoading={saving}>
                        Simpan Perubahan
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <h3 className="text-lg font-semibold text-primary">Token Anda</h3>
                <FeaturedCardProgressBar
                    title="Penggunaan Token"
                    description="Anda telah menggunakan 80% dari token ujian bulan ini. Dapatkan akses unlimited sekarang."
                    confirmLabel="Upgrade Paket"
                    progress={80}
                    onDismiss={() => { }}
                    onConfirm={() => {
                        router.push("/pricing");
                    }}
                />
            </div>

            {/* Avatar Picker Modal */}
            <AvatarPickerModal
                isOpen={showAvatarPicker}
                onClose={() => setShowAvatarPicker(false)}
            />
        </div>
    );
}
