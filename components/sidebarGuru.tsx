"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SidebarGuru() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Menggunakan useRouter untuk navigasi

  // Sidebar hanya muncul pada path tertentu
  if (!pathname.startsWith("/dashboard/guru")) {
    return null;
  }

  return (
    <div>
      {/* Button untuk menampilkan sidebar di layar kecil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 bg-[#000080] text-white p-2 rounded-md"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed pt-16 font-bold w-64 h-screen bg-gradient-to-r from-[#000080] to-[#87CEEB] p-6 shadow-lg top-0 left-0 z-10 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-semibold text-white mb-8">Panel Guru</h2>
        <ul className="space-y-6">
          {[
            { href: "/dashboard/guru", label: "Dashboard" },
            {
              href: "/dashboard/guru/daftar-siswa",
              label: "Daftar Siswa-Siswi",
            },
            {
              href: "/dashboard/guru/materi-pembelajaran",
              label: "Materi Pembelajaran",
            },
            { href: "/dashboard/guru/forum-diskusi", label: "Forum Diskusi" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded-md text-white hover:bg-[#FFD700] transition duration-300 ${
                  pathname === item.href ? "bg-[#FFD700]" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
