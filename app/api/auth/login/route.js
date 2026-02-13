import { NextResponse } from "next/server";
import { users } from "../_db";

export async function POST(req) {
  const { email, password } = await req.json();

  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json(
      { message: "Email not registered" },
      { status: 404 },
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { message: "Incorrect password" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    token: "demo-token",
    user: { email },
  });
}
