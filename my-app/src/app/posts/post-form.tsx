"use client";

import { useActionState } from "react";

import { savePostAction, type PostFormState } from "./actions.ts";
import type { AuthorOption } from "../../prisma/posts.ts";

const initialState: PostFormState = { error: null };

type PostFormProps = {
  postId?: number | null;
  title?: string;
  content?: string | null;
  authorId?: number | null;
  authors?: AuthorOption[];
  submitLabel?: string;
};

export function PostForm({
  postId = null,
  title = "",
  content = null,
  authorId = null,
  authors,
  submitLabel = "Save post",
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(
    savePostAction.bind(null, postId),
    initialState,
  );

  return (
    <form action={formAction} className="form">
      <label htmlFor="title">Title</label>
      <input id="title" name="title" defaultValue={title} maxLength={200} required />

      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" defaultValue={content ?? ""} rows={4} />

      {authors ? (
        <>
          <label htmlFor="authorId">Author</label>
          <select id="authorId" name="authorId" defaultValue={authorId ?? authors[0]?.id}>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <input type="hidden" name="authorId" value={authorId ?? ""} />
      )}

      {state.error ? <p className="error">{state.error}</p> : null}

      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
