"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SidebarMahasiswa() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!pathname.startsWith("/dashboard/mahasiswa")) {
    return null;
  }

  const handleLogout = () => {
    window.location.href = "/auth/login";
  };

  return (
    <div>
      {/* Tombol hamburger untuk layar kecil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 bg-blue-700 text-white p-2 rounded-md"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed pt-16 w-64 h-screen bg-blue-200 p-6 top-0 left-0 z-10 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Mahasiswa Panel</h2>
        <ul className="space-y-4">
          {[
            { href: "/dashboard/mahasiswa", label: "Dashboard" },
            { href: "/dashboard/mahasiswa/kelas", label: "Kelas" },
            { href: "/dashboard/mahasiswa/profil", label: "Profil" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded-md text-blue-700 hover:bg-blue-400 transition duration-300 ${
                  pathname === item.href ? "bg-blue-500 text-white" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
