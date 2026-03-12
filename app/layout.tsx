import type { Metadata } from "next";
import "@fontsource/roboto";
import "@/components/ProgressBar/useProgress";
import "./globals.scss";

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
      <body>{children}</body>
    </html>
  );
}
