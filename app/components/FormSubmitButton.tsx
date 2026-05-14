"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  className?: string;
  pendingClassName?: string;
  disabled?: boolean;
};

export default function FormSubmitButton({
  label,
  pendingLabel,
  className,
  pendingClassName,
  disabled,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  const buttonClassName = [className, pending ? pendingClassName : null]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="submit"
      className={buttonClassName}
      disabled={pending || disabled}
      aria-busy={pending || undefined}
    >
      {pending ? pendingLabel || label : label}
    </button>
  );
}
