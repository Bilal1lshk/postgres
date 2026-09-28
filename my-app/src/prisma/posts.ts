import { db } from "./db.ts";
import { seed } from "./seed.ts";

export type AuthorOption = {
  id: number;
  label: string;
};

export type PostRecord = {
  id: number;
  title: string;
  content: string | null;
  authorId: number;
  authorName: string | null;
  createdAt: string;
};

export type PostInput = {
  title: string;
  content: string | null;
  authorId: number;
};

export async function listPosts(limit = 20) {
  await seed();
  const posts = await db.orm.public.Post
    .select("id", "title", "content", "authorId", "createdAt")
    .include("author", (author) => author.select("name", "username"))
    .orderBy((post) => post.createdAt.desc())
    .limit(limit)
    .all();

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    authorName: post.author?.name ?? post.author?.username ?? null,
    createdAt: post.createdAt,
  })) satisfies PostRecord[];
}

export async function getPost(id: number) {
  await seed();
  const post = await db.orm.public.Post
    .select("id", "title", "content", "authorId", "createdAt")
    .include("author", (author) => author.select("name", "username"))
    .where({ id })
    .first();

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    authorName: post.author?.name ?? post.author?.username ?? null,
    createdAt: post.createdAt,
  } satisfies PostRecord;
}

export async function listAuthors(): Promise<AuthorOption[]> {
  await seed();
  const authors = await db.orm.public.User
    .select("id", "name", "username", "email")
    .orderBy((user) => user.id.asc())
    .all();

  return authors.map((author) => ({
    id: author.id,
    label: author.name ?? author.username ?? author.email,
  }));
}

export async function createPost(input: PostInput) {
  await seed();
  return await db.orm.public.Post.create(input);
}

export async function updatePost(id: number, input: PostInput) {
  await seed();
  return await db.orm.public.Post
    .select("id", "title", "content", "authorId")
    .where({ id })
    .update(input);
}

export async function deletePost(id: number) {
  await seed();
  return await db.orm.public.Post.where({ id }).delete();
}
