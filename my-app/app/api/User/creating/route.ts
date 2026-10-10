import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import next from "next/dist/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
 console.log("Received user data:", { name, email, password });

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdat: true,
      },
    });
    if(!user) return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    console.log(user)

    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
  console.error("User creation error:", error);

  return NextResponse.json(
    {
      error: "Internal server error",
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred",
      stack:
        error instanceof Error
          ? error.stack
          : undefined,
    },
    { status: 500 }
  );
}
}

