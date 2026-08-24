"use client";

import { Modal } from "@/components/shared-assets/modal";
import { AlertCircle } from "@untitledui/icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "primary-destructive" | "primary" | "secondary";
  iconColor?: "error" | "warning" | "brand" | "gray" | "success";
  isLoading?: boolean;
  hideCancelButton?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  confirmColor = "primary-destructive",
  iconColor = "error",
  isLoading = false,
  hideCancelButton = false,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      maxWidth="sm"
      title={title}
      description={description}
      icon={AlertCircle}
      iconColor={iconColor}
      iconTheme="modern"
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        color: confirmColor,
        isLoading,
      }}
      secondaryAction={hideCancelButton ? undefined : {
        label: cancelLabel,
        onClick: onClose,
      }}
    />
  );
};

export default ConfirmationModal;
