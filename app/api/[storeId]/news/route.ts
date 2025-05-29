/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string }>;

export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { storeId } = params;

    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "4"); // Mặc định 4 sản phẩm mỗi lần
    const currentPage = parseInt(searchParams.get("currentPage") || "1"); // Trang mặc định là 1

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const news = await prismadb.news.findMany({
      where: {
        storeId: storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (currentPage - 1) * limit,
    });

    return NextResponse.json(news, { status: 200 });
  } catch (err) {
    console.log("[NEWS_GET]", err);
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
    const { title, imageUrl, content, slugData } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Bắt buộc phải có tên bài viết ", {
        status: 400,
      });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Bắt buộc phải có mô tả bài viết  ", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse("Bắt buộc phải có hình ảnh ", { status: 400 });
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
    const news = await prismadb.news.create({
      data: {
        storeId,
        title,
        imageUrl,
        content,
        slug: slugData,
      },
    });

    return NextResponse.json(news, { status: 200 });
  } catch (err) {
    console.log("[NEWS_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
