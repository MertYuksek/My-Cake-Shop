"use client";

import React, { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className?: String;
} & ComponentProps<"button">;

export default function FormSubmitButton({
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <button {...props} className={className} type="submit" disabled={pending}>
        {pending && (
          <span className="loading loading-spinner loading-md"></span>
        )}
        {children}
      </button>
    </>
  );
}
