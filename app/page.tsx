"use client";

import React from "react";
import { IoArrowDownCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const variants = {
  offscreen: { y: 150, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 1.5 },
  },
};

export default function Home() {
  return (
    <>
      {/* Cover Section */}
      <div className="w-full h-screen bg-sekolahbg bg-cover bg-center">
        <div className="h-full w-full py-[125px] px-8 flex md:items-end items-center justify-center bg-black/60">
          <motion.div
            className="w-full md:w-[55%] flex flex-col items-center justify-center"
            variants={variants}
            initial="offscreen"
            animate="onscreen"
          >
            <div className="w-[90%] md:w-[100%] text-center ">
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100">
                SELAMAT DATANG DI{" "}
                <span className="text-[#2222c9]">LEARNING CHAMPION</span>
              </p>
            </div>
            <div className="py-4 space-y-2 text-center">
              <p className="text-slate-100 text-md md:text-lg">
                Ikuti perkembangan terbaru dan aktivitas seru yang dilakukan
                oleh siswa/siswi dalam menjaga lingkungan sekolah.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-slate-100 bg-[#2222c9] px-4 py-2 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-[#20209f] scroll-smooth"
              >
                MASUK
                <IoArrowDownCircleOutline
                  size={24}
                  className="text-slate-100"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
