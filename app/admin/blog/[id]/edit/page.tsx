import { Box, Container } from "@mui/material";
import { notFound } from "next/navigation";
import BlogForm from "../../_components/blog-form";
import { getBlogPostById, getCategories } from "../../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getBlogPostById(id),
    getCategories()
  ]);

  if (!post) {
    notFound();
  }

  return (
    <Box>
      <BlogForm initialData={post} categories={categories} isEdit />
    </Box>
  );
}
