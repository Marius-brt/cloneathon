import { Header } from "@/components/layout/header";
import type { ReactNode } from "react";

export default function AuthenticatedLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="relative h-screen">{children}</main>
    </>
  );
}
