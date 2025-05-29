/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string }>;

export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { storeId } = params;

    console.log("STORE ID", storeId);

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const banners = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
        isActiveBanner: true,
      },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (err) {
    console.log("[BANNER_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
