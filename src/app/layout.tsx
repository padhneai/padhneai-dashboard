import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Dashboardheader from "@/components/customui/Dashboardheader";
import Breadcrumbs from "@/components/customui/Breadcrumbs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Padhneai Dashboard",
  description: "Padhneai Dashboard for teachers and students to create and manage question papers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        
      >
        <Toaster />
         <Dashboardheader />
         <Breadcrumbs/>
        {children}
      </body>
    </html>
  );
}
