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

    const subCategories = await prismadb.subcategory.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        category: true,
        billboard: true,
        products: true,
      },
    });

    return NextResponse.json(subCategories, { status: 200 });
  } catch (err) {
    console.log("[SUB_CATECORIES_GET]", err);
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

    const { billboardId, name, slugData, parentCategoryId } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name  is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!slugData) {
      return new NextResponse("Slug is required", { status: 400 });
    }
    if (!parentCategoryId) {
      return new NextResponse("Parent Category ID is required ", {
        status: 400,
      });
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

    const subcategory = await prismadb.subcategory.create({
      data: {
        categoryId: parentCategoryId,
        slug: slugData,
        name: name,
        billboardId: billboardId,
        storeId: storeId,
      },
    });

    return NextResponse.json(subcategory, { status: 200 });
  } catch (err) {
    console.log("[SUB_CATEGORY_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
