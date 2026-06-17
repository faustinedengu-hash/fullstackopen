"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addBlog, incrementLikes } from "./services/blogs";

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
export const likeBlog = async (formData) => {
  // Extract the ID from the hidden input field
  const id = formData.get("id");
  
  // Update the backend
  incrementLikes(id);
  
  // Revalidate BOTH paths so the new like count shows up instantly
  // on the individual page AND the main list!
  revalidatePath(`/blogs/${id}`);
  revalidatePath("/blogs");
};