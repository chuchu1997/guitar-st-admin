/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; slug: string }>;

export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;

    const { storeId, slug } = params;
    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug is required ", { status: 400 });
    }
    const subCategogy = await prismadb.subcategory.findUnique({
      where: {
        slug: slug,
      },
      include: {
        billboard: true,
        products: {
          include: {
            images: true,
            category: true,
            subcategory: true,
          },
        },
        category: true,
      },
    });
    return NextResponse.json(subCategogy, { status: 200 });
  } catch (err) {
    console.log("[SUB_CATEGORY_GET_ID]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, billboardId, slugData, parentCategoryId } = body;

    const params = await props.params;
    const { storeId, slug } = params;

    if (!slugData) {
      return new NextResponse("Slug Dat is required", { status: 400 });
    }
    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Category Name is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug  is required", { status: 400 });
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
    if (!parentCategoryId) {
      return new NextResponse("Parant Category id is required", {
        status: 400,
      });
    }
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const subCategogy = await prismadb.subcategory.updateMany({
      where: {
        slug: slug,
      },
      data: {
        categoryId: parentCategoryId,
        slug: slugData,
        name,
        billboardId,
      },
    });

    return NextResponse.json(subCategogy);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[SUB_CATEGORIES_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,

  props: { params: Params }
) {
  try {
    const user = await getCurrentUser();
    const params = await props.params;
    const { storeId, slug } = params;
    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Category Slug is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const category = await prismadb.subcategory.deleteMany({
      where: {
        slug: slug,
        storeId: storeId,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[SUB_CATEGOGY_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
