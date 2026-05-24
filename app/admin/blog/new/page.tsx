import { Box } from "@mui/material";
import { connection } from "next/server";
import BlogForm from "../_components/blog-form";
import { getCategories, getHeroSlotAssignments } from "../actions";

export default async function AdminNewBlogPostPage() {
  await connection();
  const [categories, heroSlotAssignments] = await Promise.all([
    getCategories(),
    getHeroSlotAssignments(),
  ]);

  return (
    <Box>
      <BlogForm categories={categories} heroSlotAssignments={heroSlotAssignments} />
    </Box>
  );
}
