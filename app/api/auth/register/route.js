import { NextResponse } from "next/server";
import { users } from "../_db";

export async function POST(req) {
  const { email, password } = await req.json();

  const exists = users.find((u) => u.email === email);

  if (exists) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 400 },
    );
  }

  users.push({ email, password });

  return NextResponse.json({ message: "Account created" });
}
