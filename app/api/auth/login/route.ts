/** @format */

// import { NextApiRequest, NextApiResponse } from "next";

import { comparePassword, generateToken } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Validate input

    const body = await req.json();

    const { name, password } = body;


    const user = await prismadb.user.findFirst({
      where: { name },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.role != "ADMIN") {
      return NextResponse.json(
        { message: "Invalid credentials You Are Not Admin" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);


    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Wrong Password Please Check" },
        { status: 401 }
      );
    }

    console.log("KHONG TIM THAY ")

    // Generate token
    const token = generateToken(user);

    // Set token in HTTP-only cookie

    // res.setHeader(
    //   "Set-Cookie",
    //   `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    // );
    console.log("GENERATE TOKEN", token);

    const response = NextResponse.json(
      { message: "Login successful", user },

      {
        headers: {
          // Set cookie in response headers
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          }`,
        },
      }
    );

    return response;


  } catch (error) {
    console.error("Login error:", error);
    // return res.status(500).json({ message: "Internal Server Error" });
  }
}
