import React from "react";
import { connection } from "next/server";
import { getCategories } from "../blog/actions";
import CategoryList, { CategoryRow } from "./_components/category-list";

export default async function AdminBlogCategoryPage() {
  await connection();
  const categories: CategoryRow[] = await getCategories();

  return <CategoryList categories={categories} />;
}
