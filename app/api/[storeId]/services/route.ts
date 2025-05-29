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
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "4"); // Mặc định 4 sản phẩm mỗi lần
    const currentPage = parseInt(searchParams.get("currentPage") || "1"); // Trang mặc định là 1

    const categoryId = searchParams.get("categoryId") || undefined;

    const subCategoryId = searchParams.get("subCategoryId") || undefined;

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    const services = await prismadb.service.findMany({
      where: {
        storeId: storeId,
        categoryId,
        subcategoryId: subCategoryId ?? undefined,
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
      },
      orderBy: {
        createAt: "desc",
      },
      take: limit,
      skip: (currentPage - 1) * limit,
    });

    return NextResponse.json(services, { status: 200 });
  } catch (err) {
    console.log("[SERVICES_GET]", err);
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

    const {
      name,
      price,
      images,
      description,
      slugData,
      categoryId,
      subCategoryId,
    } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Bắt buộc phải có phân loại", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Bắt buộc phải có hình ảnh ", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Bắt buộc phải có mô tả sản phẩm ", {
        status: 400,
      });
    }

    if (!slugData) {
      return new NextResponse("Bắt buộc phải có slug để tối ưu SEO", {
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

    const service = await prismadb.service.create({
      data: {
        name,
        description,
        slug: slugData,
        categoryId,
        subcategoryId: subCategoryId ?? null,
        price: price ?? 0,
        storeId: storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (err) {
    console.log("[SERVICE_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
