"use client";

import { useState, useEffect } from "react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { ANIMAL_AVATARS, AnimalAvatar } from "@/data/avatars";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";
import { Check } from "@untitledui/icons";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(user?.avatarId || "cat");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSelectedAvatarId(user.avatarId || "cat");
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Update name
      const resName = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const dataName = await resName.json();
      if (!resName.ok) throw new Error(dataName.error || "Gagal memperbarui nama");

      // Update avatar
      const resAvatar = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: selectedAvatarId }),
      });
      const dataAvatar = await resAvatar.json();
      if (!resAvatar.ok) throw new Error(dataAvatar.error || "Gagal memperbarui avatar");

      if (user) {
        setUser({
          ...user,
          name: dataName.user?.name ?? name,
          avatarId: dataAvatar.avatarId || selectedAvatarId,
        });
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-lg">
              <CloseButton onClick={onClose} theme="light" size="lg" className="absolute top-3 right-3" />

              {/* Header */}
              <div className="flex flex-col gap-0.5 px-4 pt-5 sm:px-6 sm:pt-6">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Edit Profil
                </AriaHeading>
                <p className="text-sm text-tertiary">
                  Perbarui nama lengkap dan avatar hewan pilihanmu.
                </p>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-5 px-4 py-5 sm:px-6">
                {/* Input Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-profile-name" className="text-sm font-medium text-secondary">
                    Nama Lengkap
                  </label>
                  <Input
                    id="edit-profile-name"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="Masukkan nama lengkap kamu"
                    maxLength={50}
                  />
                </div>

                {/* Select Avatar Grid */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-secondary">
                    Pilih Avatar Hewan
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                    {ANIMAL_AVATARS.map((avatar: AnimalAvatar) => {
                      const isSelected = selectedAvatarId === avatar.id || selectedAvatarId === avatar.url;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(avatar.id)}
                          className={cx(
                            "group relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all cursor-pointer",
                            isSelected
                              ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                              : "border-secondary bg-primary hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-brand-950/20"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
                              <Check className="size-3" />
                            </div>
                          )}
                          <img
                            src={avatar.url}
                            alt={avatar.label}
                            className="size-12 rounded-full object-cover"
                            loading="lazy"
                          />
                          <span className="text-xs font-medium text-secondary truncate w-full text-center">
                            {avatar.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                <Button color="secondary" size="md" onClick={onClose} isDisabled={saving}>
                  Batal
                </Button>
                <Button color="primary" size="md" onClick={handleSave} isLoading={saving}>
                  Simpan Profil
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};
