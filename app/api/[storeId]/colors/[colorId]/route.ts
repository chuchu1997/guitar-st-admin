/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; colorId: string }>;

export async function GET(
  req: Request,

  props: { params: Params }
) {
  try {
    const params = await props.params;
    const { colorId, storeId } = params;

    if (!colorId) {
      return new NextResponse("Color Id is required ", { status: 400 });
    }

    const color = await prismadb.size.findUnique({
      where: {
        storeId: storeId,
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (err) {
    console.log("[SIZE_ID_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, hexCode } = body;
    const params = await props.params;
    const { storeId, colorId } = params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color ID id is required", { status: 400 });
    }
    if (!hexCode) {
      return new NextResponse("Hex Code id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const colorUpdate = await prismadb.color.updateMany({
      where: {
        id: colorId,
        storeId: storeId,
      },
      data: {
        name,
        hexCode,
      },
    });
    return NextResponse.json(colorUpdate);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[COLOR_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();

    const params = await props.params;
    const { storeId, colorId } = params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const colorDelete = await prismadb.color.deleteMany({
      where: {
        id: colorId,
        storeId: storeId,
      },
    });
    return NextResponse.json(colorDelete);
  } catch (err) {
    console.log("[SIZE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
