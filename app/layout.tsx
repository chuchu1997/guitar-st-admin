import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { AppSidebar } from "@/components/app-sidebar";

import { ToastProvider } from "@/providers/toast-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nguyen Cuong ADMIN Site",
  description: "Create By Nguyen Cuong ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const store = prismadb.store.

  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider />
        <ModalProvider />
        <div className=" w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
