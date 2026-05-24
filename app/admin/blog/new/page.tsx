import { Box } from "@mui/material";
import { connection } from "next/server";
import BlogForm from "../_components/blog-form";
import { getCategories } from "../actions";

export default async function AdminNewBlogPostPage() {
  await connection();
  const categories = await getCategories();

  return (
    <Box>
      <BlogForm categories={categories} />
    </Box>
  );
}
