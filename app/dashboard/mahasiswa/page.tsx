import MahasiswaDashboard from "@/components/view/dashboardView/mahasiswa/mahasiswaDashboard";
import HeroPage from "@/components/view/dashboardView/mahasiswa/mahasiswaHero";
import React from "react";

export default function page() {
  return (
    <div>
      <HeroPage />
      <MahasiswaDashboard />
    </div>
  );
}
