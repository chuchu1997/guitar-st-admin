import { NextResponse } from "next/server";


export async function POST(
  
    
  ) {
    try {
   
        const response = NextResponse.json({ message: "Token cleared" }, { status: 200 });
        response.headers.set(
            "Set-Cookie",
            `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
          );
      
          return response;
  
    } catch (err) {
      console.log("[LOG OUT]", err);
      return new NextResponse("Interal error", { status: 500 });
    }
  }