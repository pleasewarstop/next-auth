import type { Metadata } from "next";
import "@fontsource/roboto";
import "./globals.scss";
import { ScrollRestoration } from "@/components/ScrollRestoration";

export const metadata: Metadata = {
  title: "Auth App",
  description: "Auth App on Next",
};

interface Props {
  children: React.ReactNode;
}
export default async function Layout({ children }: Props) {
  return (
    <html lang="en">
      <ScrollRestoration />
      <body>{children}</body>
    </html>
  );
}
