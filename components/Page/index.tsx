"use client";

import { ReactNode } from "react";
import cn from "classnames";
import { TMe } from "@/api/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRow } from "@/components/Page/Row";
import s from "./styles.module.scss";

interface Props {
  children: ReactNode;
  me: TMe;
  meError: string | null;
  year: number;
  contentClassName?: string;
  hasFooter?: boolean;
}
export function Page({
  children,
  me,
  meError,
  year,
  contentClassName,
  hasFooter = true,
}: Props) {
  return (
    <div className={s.container}>
      <Header me={me} meError={meError} />
      <PageRow className={cn(contentClassName, s.content)}>{children}</PageRow>
      {hasFooter && <Footer me={me} year={year} />}
    </div>
  );
}
