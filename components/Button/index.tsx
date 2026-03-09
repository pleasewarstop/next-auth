import { ReactNode } from "react";
import cn from "classnames";
import s from "./styles.module.scss";

export interface Props {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}
export function Button({ children, className, disabled, onClick }: Props) {
  return (
    <button
      className={cn(s.container, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
