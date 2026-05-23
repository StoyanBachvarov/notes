"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if user exists
  const existingUsers = await db.select().from(users).where(eq(users.email, email));
  if (existingUsers.length > 0) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const result = await db.insert(users).values({
    email,
    passwordHash,
  }).returning();

  const user = result[0];

  // Set cookie session
  await createSession(user.id, user.email);
  redirect("/");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check user
  const userResult = await db.select().from(users).where(eq(users.email, email));
  const user = userResult[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  // Set cookie session
  await createSession(user.id, user.email);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}