import { Box } from "@mui/material";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import BlogForm from "../../_components/blog-form";
import { getBlogPostById, getCategories, getHeroSlotAssignments } from "../../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPostPage({ params }: PageProps) {
  await connection();
  const { id } = await params;
  const [post, categories, heroSlotAssignments] = await Promise.all([
    getBlogPostById(id),
    getCategories(),
    getHeroSlotAssignments(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <Box>
      <BlogForm initialData={post} categories={categories} heroSlotAssignments={heroSlotAssignments} isEdit />
    </Box>
  );
}
