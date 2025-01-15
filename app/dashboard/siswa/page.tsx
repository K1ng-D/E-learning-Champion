import SiswaDashboard from "@/components/view/dashboardView/mahasiswa/siswaDashboard";
import HeroPage from "@/components/view/dashboardView/mahasiswa/siswaHero";
import React from "react";

export default function page() {
  return (
    <div>
      <HeroPage />
      <SiswaDashboard />
    </div>
  );
}
