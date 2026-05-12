import { Box } from "@mui/material";
import React from "react";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { FreshlyPublished } from "./components/freshly-published";
import { FeaturedPosts } from "./components/featured-posts";
import { FeaturedCategories } from "./components/featured-categories";
import { Newsletter } from "./components/newsletter";
import { Footer } from "./components/footer";
import { HoroscopeShowcase } from "./components/horoscope-showcase";
import { LuckyNumbers } from "./components/lucky-numbers";
import { getWeeklyShowcaseData } from "@/lib/horoscopes";
import { getLuckyNumbersData } from "@/lib/lucky-numbers";

export default async function Home() {
  const weeklyData = await getWeeklyShowcaseData();
  const luckyNumbersData = await getLuckyNumbersData();

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* 
          Horoscope Showcase (Maintaining the app's core feature)
      */}
      <Box sx={{ mt: -5, position: 'relative', zIndex: 5 }}>
        <HoroscopeShowcase signs={weeklyData.signs} weekLabel={weeklyData.weekLabel} />
      </Box>

      {/* Lucky Numbers Section */}
      <LuckyNumbers data={luckyNumbersData} />

      {/* Freshly Published Section */}
      <FreshlyPublished />

      {/* Featured Posts Section */}
      <FeaturedPosts />

      {/* Featured Categories Section */}
      <FeaturedCategories />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer Section */}
      <Footer />
    </Box>
  );
}
