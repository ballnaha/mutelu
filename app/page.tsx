import { Box } from "@mui/material";
import React from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Footer } from "./components/footer";
import { LuckyNumbers } from "./components/lucky-numbers";
import { CategoryTabs } from "./components/category-tabs";
import { getWeeklyShowcaseData } from "@/lib/horoscopes";
import { getLuckyNumbersData } from "@/lib/lucky-numbers";

export default async function Home() {
  const weeklyData = await getWeeklyShowcaseData();
  const luckyNumbersData = await getLuckyNumbersData();

  return (
    <Box sx={{ bgcolor: "#242b32", minHeight: "100vh" }}>
      <Header />
      
      {/* Hero Section */}
      <Hero signs={weeklyData.signs} weekLabel={weeklyData.weekLabel} />

      {/* Lucky Numbers Section */}
      <LuckyNumbers data={luckyNumbersData} />

      {/* Category Tabs Section */}
      <Box id="categories" sx={{ scrollMarginTop: { xs: "80px", md: "96px" } }}>
        <CategoryTabs />
      </Box>

      {/* Footer Section */}
      <Footer />
    </Box>
  );
}
