"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addBlog } from "./services/blogs";

export const createBlog = async (formData) => {
  // Extract values from the form
  const title = formData.get("title");
  const author = formData.get("author");
  const url = formData.get("url");

  // Add it to our array
  addBlog(title, author, url);

  // Clear the Next.js cache so the new blog appears instantly
  revalidatePath("/blogs");
  
  // Redirect the user back to the list
  redirect("/blogs");
};