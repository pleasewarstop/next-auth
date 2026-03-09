import cn from "classnames";
import { ChangeEvent, forwardRef, useEffect, useRef } from "react";
import { FormError } from "@/components/FormError";
import s from "./styles.module.scss";

interface Props {
  value: string;
  placeholder?: string;
  className?: string;
  error?: null | boolean | string;
  valid: boolean;
  autofocus?: boolean;
  type?: "password" | undefined;
  onChange: (value: string, e: ChangeEvent) => void;
  onBlur?: () => void;
}
export const Input = forwardRef<HTMLInputElement | null, Props>(function Input(
  {
    value,
    placeholder,
    className,
    error,
    valid,
    autofocus,
    type,
    onChange,
    onBlur,
  },
  ref
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const finalRef = ref || innerRef;

  useEffect(() => {
    if (autofocus) {
      if ("current" in finalRef) finalRef.current?.focus();
    }
  }, [autofocus, finalRef]);
  return (
    <div
      className={cn(s.container, className, {
        [s.invalid]: !!error,
        [s.valid]: valid,
      })}
    >
      <input
        className={s.input}
        value={value}
        placeholder={placeholder}
        ref={finalRef}
        onChange={(e) => onChange(e.target.value, e)}
        onBlur={onBlur}
        type={type}
      />
      <FormError className={s.error} error={error} />
    </div>
  );
});
