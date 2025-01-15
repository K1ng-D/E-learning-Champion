"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [scrollActive, setScrollActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!pathname.startsWith("/dashboard/siswa")) {
    return null;
  }

  const handleLogout = () => {
    window.location.href = "/auth/login";
  };

  const MotionImage = motion.create(Image);

  const menuVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-30 transition-all ${
          scrollActive
            ? "bg-[#000080] text-white shadow-md"
            : "bg-[#000080] text-white"
        }`}
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <Link
              href="/dashboard/siswa"
              onClick={() => setActiveLink("beranda")}
              className="cursor-pointer flex gap-2 font-bold items-center text-[20px]"
            >
              <MotionImage
                src="/assets/images/LogoLearningChampion.png"
                alt="LogoLerningChampion"
                width={50}
                height={50}
                className="cursor-pointer"
              />
              Learning Champion
            </Link>

            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 focus:outline-none"
              >
                <div
                  className={`w-6 h-0.5 bg-current transition-all ${
                    isOpen ? "transform rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-current mt-1 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-current mt-1 transition-all ${
                    isOpen ? "transform -rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </button>
            </div>

            <ul className="hidden font-bold lg:flex items-center space-x-6">
              <li
                className={`relative cursor-pointer ${
                  activeLink === "beranda"
                    ? "text-[#9d9dff] shadow-[#9d9dff]"
                    : "font-bold hover:text-[#9d9dff]"
                } transition-all duration-300`}
              >
                <Link
                  href="/dashboard/siswa"
                  onClick={() => setActiveLink("beranda")}
                >
                  Beranda
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#000080] transform scale-x-0 transition-all duration-300"></span>
                </Link>
              </li>
              <li
                className={`relative cursor-pointer ${
                  activeLink === "materi"
                    ? "text-[#9d9dff] shadow-[#9d9dff]"
                    : "font-bold hover:text-[#9d9dff]"
                } transition-all duration-300`}
              >
                <Link
                  href="/dashboard/siswa/materi"
                  onClick={() => setActiveLink("materi")}
                >
                  Materi
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#000080] transform scale-x-0 transition-all duration-300"></span>
                </Link>
              </li>
              <li
                className={`relative cursor-pointer  ${
                  activeLink === "diskusi"
                    ? "text-[#9d9dff] shadow-[#9d9dff]"
                    : "font-bold hover:text-[#9d9dff]"
                } transition-all duration-300`}
              >
                <Link
                  href="/dashboard/siswa/diskusi"
                  onClick={() => setActiveLink("diskusi")}
                >
                  Diskusi
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#000080] transform scale-x-0 transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          <motion.div
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={menuVariants}
            className="lg:hidden overflow-hidden"
          >
            <ul className="flex flex-col items-center pb-4 bg-[#000080] text-white w-full">
              <li
                className={`w-full text-center py-2 hover:bg-[#9d9dff] ${
                  activeLink === "beranda" ? "bg-white text-[#000080]" : ""
                }`}
              >
                <Link
                  href="/dashboard/siswa"
                  onClick={() => {
                    setActiveLink("beranda");
                    setIsOpen(false);
                  }}
                >
                  Beranda
                </Link>
              </li>
              <li
                className={`w-full text-center py-2 hover:bg-[#9d9dff] ${
                  activeLink === "materi" ? "bg-white text-[#000080]" : ""
                }`}
              >
                <Link
                  href="/dashboard/siswa/materi"
                  onClick={() => {
                    setActiveLink("materi");
                    setIsOpen(false);
                  }}
                >
                  Materi
                </Link>
              </li>
              <li
                className={`w-full text-center py-2 hover:bg-[#9d9dff] ${
                  activeLink === "diskusi" ? "bg-white text-[#000080]" : ""
                }`}
              >
                <Link
                  href="/dashboard/siswa/diskusi"
                  onClick={() => {
                    setActiveLink("diskusi");
                    setIsOpen(false);
                  }}
                >
                  Diskusi
                </Link>
              </li>
            </ul>
          </motion.div>
        </nav>
      </header>
    </>
  );
}
