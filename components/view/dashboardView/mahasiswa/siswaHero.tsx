"use client";
import React, { useState, useEffect } from "react";

const HeroPage = () => {
  return (
    <div>
      <section className="bg-sekolahbg bg-center text-white py-20 min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-screen-md mx-auto px-6 sm:px-8 lg:px-16 text-center">
          <h1 className="text-6xl font-bold mb-4">
            SELAMAT DATANG <span className="text-white">SISWA-SISWI</span>{" "}
            CHAMPION
          </h1>
          <p className="text-lg mb-8 text-white uppercase">
            Ikuti perkembangan terbaru dan aktivitas seru yang dilakukan oleh
            siswa/siswi dalam menjaga lingkungan sekolah.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;
