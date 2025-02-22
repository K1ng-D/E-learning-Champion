import { Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/navbar";
import { SidebarGuru } from "@/components/sidebarGuru";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "LEARNING CHAMPION",
  description: "LEARNING CHAMPION",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.className} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <SidebarGuru />

        <div className="flex flex-1 w-full">
          <main className="w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
