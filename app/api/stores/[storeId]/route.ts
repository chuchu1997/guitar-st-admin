/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string }>;

export async function PATCH(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name } = body;

    const params = await props.params;
    const { storeId } = params;
    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userID: user.id,
      },
      data: {
        name,
      },
    });
    console.log("STORE CALL NE ", store);

    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();

    const params = await props.params;
    const { storeId } = params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userID: user.id,
      },
    });

    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
