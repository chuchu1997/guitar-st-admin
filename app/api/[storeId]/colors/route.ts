/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string }>;

export async function GET(
  req: Request,

  props: { params: Params }
) {
  try {
    const params = await props.params;
    const { storeId } = params;
    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(colors, { status: 200 });
  } catch (err) {
    console.log("[COLORS_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function POST(
  req: Request,

  props: { params: Params }
) {
  try {
    const params = await props.params;
    const { storeId } = params;

    const user = await getCurrentUser();

    const body = await req.json();

    const { name, hexCode } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Color Name is required", { status: 400 });
    }
    if (!hexCode) {
      return new NextResponse("Hex Color is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden ", { status: 403 });
    }
    const color = await prismadb.color.create({
      data: {
        name,
        hexCode,
        storeId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (err) {
    console.log("[COLOR_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
