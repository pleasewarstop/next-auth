import { ReactNode } from "react";
import cn from "classnames";
import s from "./styles.module.scss";

export interface Props {
  children: ReactNode;
  className?: string;
}
export function PageRow({ children, className }: Props) {
  return <div className={cn(s.container, className)}>{children}</div>;
}
