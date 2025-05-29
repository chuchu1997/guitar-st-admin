import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function middleware(request: NextRequest) {

  // Các đường dẫn công khai không cần đăng nhập
  const publicPaths = ["/login", "/register", "/public", "/api"];

  const token = request.cookies.get("token")?.value || "";
  const pathname = request.nextUrl.pathname;

  // ✅ Lấy domain thật từ headers
  const host = request.headers.get("host");
  const protocol = request.nextUrl.protocol || "https:";
  const fullUrl = `${protocol}//${host}${pathname}`;

  console.log("🧭 Full URL:", fullUrl);
  console.log("🔐 Token:", token);

  // Set CORS headers
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Origin", "*"); // Replace with domain if needed
  res.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Nếu là route công khai => cho qua
  if (publicPaths.some((publicPath) => pathname.startsWith(publicPath))) {
    return res;
  }

  // Nếu chưa có token => redirect về login
  if (!token) {
    return NextResponse.redirect(new URL("/login", `${protocol}//${host}`));
  }

  try {
 
    let isValidToken =  await jwtVerify(token, JWT_SECRET);
      if(!isValidToken){
      return NextResponse.redirect(new URL("/login", `${protocol}//${host}`));
      }
    // Gửi yêu cầu xác thực token đến API nội bộ
    // const verifyResponse = await fetch(`${protocol}//${host}/api/auth/verify`, {
    //   method: "GET",
    //   headers: {
    //     Cookie: `token=${token}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (verifyResponse.status !== 200) {
    //   console.warn("❌ Token invalid, redirecting to login.");
    //   return NextResponse.redirect(new URL("/login", `${protocol}//${host}`));
    // }

    // ✅ Token hợp lệ
    return res;
  } catch (error) {
    console.error("🔴 Lỗi khi xác thực token:", error);
    return NextResponse.redirect(new URL("/login", `${protocol}//${host}`));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};