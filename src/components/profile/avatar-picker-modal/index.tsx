"use client";

import { useState } from "react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { ANIMAL_AVATARS, AnimalAvatar } from "@/data/avatars";
import { useAuthStore } from "@/store/use-auth-store";
import { cx } from "@/utils/cx";
import { Check } from "@untitledui/icons";

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (avatarId: string) => void;
}

export const AvatarPickerModal = ({ isOpen, onClose, onSaved }: AvatarPickerModalProps) => {
  const { user, setUser } = useAuthStore();
  const [selected, setSelected] = useState<string>(user?.avatarId ?? "cat");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan avatar");

      if (user) {
        setUser({ ...user, avatarId: data.avatarId || selected });
      }
      onSaved?.(data.avatarId || selected);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
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
                <AriaHeading slot="title" className="text-md font-semibold text-primary">
                  Pilih Avatar
                </AriaHeading>
                <p className="text-sm text-tertiary">
                  Pilih avatar hewan yang mewakili dirimu di leaderboard.
                </p>
              </div>

              {/* Avatar Grid */}
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-4 gap-3">
                  {ANIMAL_AVATARS.map((avatar: AnimalAvatar) => {
                    const isSelected = selected === avatar.id || selected === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => setSelected(avatar.id)}
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
                          className="size-14 rounded-full object-cover"
                          loading="lazy"
                        />
                        <span className="text-xs font-medium text-secondary truncate w-full text-center">
                          {avatar.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <p className="mt-3 text-sm text-error-600 dark:text-error-400">{error}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-secondary px-4 py-4 sm:px-6">
                <Button color="secondary" size="md" onClick={onClose} isDisabled={saving}>
                  Batal
                </Button>
                <Button color="primary" size="md" onClick={handleSave} isLoading={saving}>
                  Simpan Avatar
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default AvatarPickerModal;
