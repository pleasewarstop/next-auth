"use client";

import { ReactNode } from "react";
import cn from "classnames";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRow } from "@/components/Page/Row";
import s from "./styles.module.scss";

interface Props {
  children: ReactNode;
  contentClassName?: string;
  hasFooter?: boolean;
}
export function Page({ children, contentClassName, hasFooter = true }: Props) {
  return (
    <div className={s.container}>
      <Header />
      <PageRow className={cn(contentClassName, s.content)}>{children}</PageRow>
      {hasFooter && <Footer />}
    </div>
  );
}
