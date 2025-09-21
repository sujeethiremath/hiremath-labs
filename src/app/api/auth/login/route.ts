import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// IMPORTANT: Never store sensitive data like this in your code.
// This is for demonstration purposes only. Use a database instead.
const ADMIN_USERNAME = "sujeet";
// Hashed password for 'password123'. This should be a securely stored value.
const HASHED_PASSWORD =
  "$2b$10$HPYnda1cpjtIQan95zE3DuHrgS.jad3CQOF93DIUSBCLO9Wt9AQde";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    console.log("Login attempt for user:", username);
    console.log("Provided password:", password);
    const hashedInputPassword = await bcrypt.hash(password, 10);
    console.log("Hashed input password:", hashedInputPassword);
    // 2. Authenticate the user
    // In a real application, you would fetch the user from a database
    // and securely compare the password hash.
    const isPasswordCorrect = await bcrypt.compare(password, HASHED_PASSWORD);

    if (username !== ADMIN_USERNAME || !isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 3. Generate a JWT token
    const token = jwt.sign(
      { username: ADMIN_USERNAME },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // 4. Return the token in a success response
    return NextResponse.json(
      {
        message: "Login successful!",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
