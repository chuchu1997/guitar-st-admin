/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; slug: string }>;
export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { slug } = params;

    if (!slug) {
      return new NextResponse("Slug là bắt buộc  ", { status: 400 });
    }
    const news = await prismadb.news.findUnique({
      where: {
        slug: slug,
      },
    });
    return NextResponse.json(news, { status: 200 });
  } catch (err) {
    console.log("[NEWS_GET_SLUG]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const params = await props.params;
    const { storeId, slug } = params;
    const { title, imageUrl, content, slugData } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Tiêu đề bài viết là bắt buộc ", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Bắt buộc phải có hình ảnh ", { status: 400 });
    }
    if (!content) {
      return new NextResponse("Bắt buộc phải có nội dung ", { status: 400 });
    }

    if (!slug) {
      return new NextResponse("Bắt buộc phải có slug ", { status: 400 });
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

    const news = await prismadb.news.update({
      where: {
        slug: slug,
      },
      data: {
        title,
        content,
        imageUrl,
        slug: slugData,
      },
    });
    console.log("NEWS", news);

    return NextResponse.json(news);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[NEWS_PATCH]", err);
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

    const news = await prismadb.news.delete({
      where: {
        slug: slug,
      },
    });

    return NextResponse.json(news);
  } catch (err) {
    console.log("[NEWS_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
