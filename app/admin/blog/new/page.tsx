import { Box } from "@mui/material";
import BlogForm from "../_components/blog-form";
import { getCategories } from "../actions";

export default async function AdminNewBlogPostPage() {
  const categories = await getCategories();

  return (
    <Box>
      <BlogForm categories={categories} />
    </Box>
  );
}
