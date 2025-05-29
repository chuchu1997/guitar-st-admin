/** @format */

import { deleteFromS3 } from "@/app/services/s3-amazon";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; slug: string }>;

export async function GET(
  req: Request,

  props: { params: Params }
) {
  try {
    const params = await props.params;
    const { storeId, slug } = params;
    if (!slug) {
      return new NextResponse("SERVICE SLUG is required ", { status: 400 });
    }
    const service = await prismadb.service.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
      },
    });
    return NextResponse.json(service, { status: 200 });
  } catch (err) {
    console.log("[SERVICE_GET_IDw]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      name,
      categoryId,
      price,
      images,
      description,
      subCategoryId,
      slugData,
    } = body;
    const params = await props.params;
    const { storeId, slug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("category ID is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!slug) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: storeId,
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbinden", { status: 403 });
    }

    const serviceOld = await prismadb.service.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
      },
    });
    serviceOld?.images.forEach(async (image) => {
      //XOA IMAGE S3
      await deleteFromS3(image.url);
    });

    await prismadb.service.update({
      where: {
        slug: slug,
      },
      data: {
        description,
        slug: slug,
        name,
        price: price ?? 0,
        subcategoryId: subCategoryId ?? null,
        categoryId,
        storeId: storeId,
        images: {
          deleteMany: {},
        },
        // images: {
        //   deleteMany: {},
        // },
      },
    });

    const service = await prismadb.service.update({
      where: {
        slug: slug,
      },
      data: {
        description,

        slug: slugData,

        name,
        price: price ?? 0,
        subcategoryId: subCategoryId ?? null,

        categoryId,

        storeId: storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(service);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[SERVICE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Params }) {
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
      return new NextResponse("Slug id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const serviceOld = await prismadb.service.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
      },
    });
    serviceOld?.images.forEach(async (image) => {
      //XOA IMAGE S3
      await deleteFromS3(image.url);
    });

    const service = await prismadb.service.deleteMany({
      where: {
        slug: slug,
        storeId: storeId,
      },
    });
    return NextResponse.json(service);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
