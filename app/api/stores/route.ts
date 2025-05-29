/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return new NextResponse("OK", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const body = await req.json();

    const { name } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }
    const store = await prismadb.store.create({
      data: {
        name,
        userID: user.id,
      },
    });
    return NextResponse.json(store, { status: 200 });

    // const store = await prismadb.store.create({
    //   data: {
    //     name,
    //     userID: "11",
    //   },
    // });

    // return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
