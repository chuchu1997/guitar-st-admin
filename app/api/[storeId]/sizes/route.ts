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
    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(sizes, { status: 200 });
  } catch (err) {
    console.log("[SIZES_GET]", err);
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

    const { name, description } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Label is required", { status: 400 });
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
    const size = await prismadb.size.create({
      data: {
        name,
        description,
        storeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (err) {
    console.log("[SIZE_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
