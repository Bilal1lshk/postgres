"use client";

import axios from "axios";
import { useState } from "react";

type CreatedUser = {
  id: number;
  name: string;
  email: string;
  createdat: string;
};

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<CreatedUser | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const res = await axios.post<CreatedUser>("/api/User/creating", {
        name,
        email,
        password,
      });
      setUser(res.data);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <h1 className="text-xl font-semibold">Create user</h1>

      <input
        className="rounded border border-gray-300 px-3 py-2"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="rounded border border-gray-300 px-3 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="rounded border border-gray-300 px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create user"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {user && (
        <p className="text-sm text-green-600">
          Created {user.name} ({user.email})
        </p>
      )}
    </form>
  );
}
