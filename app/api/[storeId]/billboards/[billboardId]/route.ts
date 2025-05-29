/** @format */

import { deleteFromS3 } from "@/app/services/s3-amazon";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{
  storeId: string;
  billboardId: string;
}>;

export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { billboardId } = params;

    if (!billboardId) {
      return new NextResponse("Billboard Id is required ", { status: 400 });
    }

    const billboards = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (err) {
    console.log("[BILLBOARDS_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,

  props: { params: Params }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { label, imageUrl, isActiveBanner, linkHref } = body;
    const params = await props.params;

    const { storeId, billboardId } = params;
    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }
    // await deleteFromS3(imageUrl);

    const billboardOld = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
        storeId: storeId,
      },
    });

    if (billboardOld?.imageUrl !== imageUrl) {
      await deleteFromS3(billboardOld!.imageUrl);
      //REMOVE IMAGE IN S3
    }

    const billboardUpdate = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
        storeId: storeId,
      },
      data: {
        label: label,
        imageUrl: imageUrl,
        isActiveBanner: isActiveBanner,
        linkHref,
      },
    });
    return NextResponse.json(billboardUpdate);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[STORE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const params = await props.params;
    const { storeId, billboardId } = params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const billboardOld = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
        storeId: storeId,
      },
    });

    await deleteFromS3(billboardOld!.imageUrl);
    //REMOVE IMAGE IN S3

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
        storeId: storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
