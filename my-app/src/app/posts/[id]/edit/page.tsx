import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost } from "../../../../prisma/posts.ts";
import { PostForm } from "../../post-form.tsx";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  const post = Number.isInteger(postId) ? await getPost(postId).catch(() => null) : null;

  if (!post) {
    notFound();
  }

  return (
    <main className="shell">
      <div className="hero">
        <p className="eyebrow">Edit post #{post.id}</p>

        <h1>{post.title}</h1>
        <p className="lede">
          <Link href="/posts">Back to posts</Link> — saving updates the row through{" "}
          <code>db.orm.public.Post</code>.
        </p>
      </div>

      <section className="panel">
        <PostForm
          postId={post.id}
          title={post.title}
          content={post.content}
          authorId={post.authorId}
          submitLabel="Save changes"
        />
      </section>
    </main>
  );
}
