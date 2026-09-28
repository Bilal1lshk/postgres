"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createPost, deletePost, updatePost, type PostInput } from "../../prisma/posts.ts";

export type PostFormState = {
  error: string | null;
};

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readPostInput(formData: FormData): PostInput {
  return {
    title: readField(formData, "title"),
    content: readField(formData, "content") || null,
    authorId: Number(readField(formData, "authorId")),
  };
}

function validate(input: PostInput): string | null {
  if (!input.title) {
    return "Title is required.";
  }

  if (input.title.length > 200) {
    return "Title must be 200 characters or fewer.";
  }

  if (!Number.isInteger(input.authorId) || input.authorId < 1) {
    return "Pick an author.";
  }

  return null;
}

export async function savePostAction(
  postId: number | null,
  _state: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const input = readPostInput(formData);
  const error = validate(input);

  if (error) {
    return { error };
  }

  try {
    if (postId === null) {
      await createPost(input);
    } else {
      await updatePost(postId, input);
    }
  } catch (cause) {
    console.error("Failed to save post", cause);
    return { error: "Could not save the post. Try again." };
  }

  revalidatePath("/posts");

  if (postId !== null) {
    redirect(`/posts/${postId}/edit`);
  }

  redirect("/posts");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const id = Number(readField(formData, "id"));

  if (!Number.isInteger(id)) {
    return;
  }

  try {
    await deletePost(id);
  } catch (cause) {
    console.error("Failed to delete post", cause);
    return;
  }

  revalidatePath("/posts");
}
