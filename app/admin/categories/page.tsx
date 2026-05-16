import React from "react";
import { getCategories } from "../blog/actions";
import CategoryList, { CategoryRow } from "./_components/category-list";

export default async function AdminBlogCategoryPage() {
  const categories: CategoryRow[] = await getCategories();

  return <CategoryList categories={categories} />;
}
