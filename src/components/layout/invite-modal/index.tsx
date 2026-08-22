"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Modal } from "@/components/shared-assets/modal";
import { Mail01, Send01, UserPlus01, X, CheckCircle } from "@untitledui/icons";

interface InviteModalProps {
  examId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal = ({ examId, isOpen, onClose }: InviteModalProps) => {
  const [input, setInput] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const addEmail = () => {
    const val = input.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return;
    if (!emailRegex.test(val)) {
      setError("Format email tidak valid.");
      return;
    }
    if (emails.includes(val)) {
      setError("Email sudah ditambahkan.");
      return;
    }
    setEmails((p) => [...p, val]);
    setInput("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (email: string) => setEmails((p) => p.filter((e) => e !== email));

  const handleSend = async () => {
    if (emails.length === 0) {
      setError("Tambahkan minimal satu email.");
      return;
    }
    setSending(true);
    try {
      await fetch("/api/exams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, emails }),
      });
      setSent(true);
    } catch {
      setError("Gagal mengirim undangan. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      maxWidth="md"
      title="Undang Peserta"
      description="Masukkan email peserta yang ingin diundang. Tekan Enter atau koma (,) untuk menambahkan beberapa."
      icon={UserPlus01}
      iconColor="brand"
      iconTheme="modern"
      primaryAction={
        !sent
          ? {
              label: "Kirim Undangan",
              onClick: handleSend,
              isLoading: sending,
              isDisabled: emails.length === 0,
              icon: Send01,
            }
          : undefined
      }
      secondaryAction={
        !sent
          ? {
              label: "Batal",
              onClick: onClose,
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-4">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-success-100 dark:bg-success-950/30">
              <CheckCircle className="size-6 text-success-600" />
            </div>
            <div>
              <p className="font-semibold text-primary">Undangan Terkirim!</p>
              <p className="text-sm text-tertiary mt-1">{emails.length} undangan berhasil dikirim.</p>
            </div>
            <Button size="sm" color="secondary" onClick={onClose}>
              Tutup
            </Button>
          </div>
        ) : (
          <>
            {/* Email chips */}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <span
                    key={email}
                    className="flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 px-2.5 py-1 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    <Mail01 className="size-3" />
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-0.5 text-brand-500 hover:text-brand-700 transition-colors p-0.5 rounded-full"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                size="sm"
                placeholder="nama@email.com"
                icon={Mail01}
                value={input}
                onChange={(value) => {
                  setInput(value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                isInvalid={!!error}
                wrapperClassName="flex-1"
                hint={error}
              />
              <Button onClick={addEmail} type="button" size="sm" color="primary">
                Tambah
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default InviteModal;
