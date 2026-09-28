import Link from "next/link";

import { listAuthors, listPosts } from "../../prisma/posts.ts";
import { deletePostAction } from "./actions.ts";
import { PostForm } from "./post-form.tsx";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const posts = await listPosts(20).catch(() => undefined);
  const authors = await listAuthors().catch(() => []);

  return (
    <main className="shell">
      <div className="hero">
        <p className="eyebrow">Posts</p>

        <h1>Create, edit and delete posts.</h1>
        <p className="lede">
          <Link href="/">Back to users</Link> — every write here goes through the server
          actions in <code>src/app/posts/actions.ts</code>.
        </p>
      </div>

      <section className="panel">
        <div className="panelHeader">
          <h2>All posts</h2>
          <span>{posts?.length ?? 0} shown</span>
        </div>

        {!posts ? (
          <p className="empty">
            Could not query posts yet. Run <code>contract:emit</code> and apply your schema,
            then refresh.
          </p>
        ) : posts.length === 0 ? (
          <p className="empty">No posts yet. Create the first one below.</p>
        ) : (
          <ul className="users">
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <p>
                    {post.authorName ?? "Unknown author"}
                    {post.content ? ` — ${post.content}` : ""}
                  </p>
                </div>

                <div className="rowActions">
                  <time dateTime={post.createdAt}>
                    {formatter.format(new Date(post.createdAt))}
                  </time>
                  <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="linkButton">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>New post</h2>
        </div>

        {authors.length === 0 ? (
          <p className="empty">No authors available — seed the database first.</p>
        ) : (
          <PostForm authors={authors} submitLabel="Create post" />
        )}
      </section>
    </main>
  );
}
