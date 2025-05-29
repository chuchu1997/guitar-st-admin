/** @format */

import { deleteFromS3 } from "@/app/services/s3-amazon";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; slug: string }>;
export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { slug } = params;

    if (!slug) {
      return new NextResponse("Product Id is required ", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        category: true,
        images: true,
        subcategory: true,
        productSizes: {
          include: {
            size: true, // 🟢 Lấy thông tin từ bảng Size
          },
        },
        productColors: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_GET_ID]", err);
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
      isFeatured,
      isArchived,
      description,
      subCategoryId,
      shortDescription,
      slugData,
      sku,
      stockQuantity,
      viewCount,
      ratingCount,
      sizes,
      colors,
    } = body;

    const params = await props.params;
    const { storeId, slug } = params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!shortDescription) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!sku) {
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

    const productOld = await prisma?.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
      },
    });
    productOld?.images.forEach(async (image) => {
      //XOA IMAGE S3
      await deleteFromS3(image.url);
    });
    await prismadb.product.update({
      where: {
        slug: slug,
      },
      data: {
        description,
        shortDescription,
        sku,
        slug: slug,
        stockQuantity,
        name,
        price,
        subcategoryId: subCategoryId ?? null,
        isFeatured,
        isArchived,
        categoryId,
        viewCount,
        ratingCount,
        storeId: storeId,
        images: {
          deleteMany: {},
        },
        productSizes: {
          deleteMany: {},
        },
        productColors: {
          deleteMany: {},
        },
        // images: {
        //   deleteMany: {},
        // },
      },
    });

    const product = await prismadb.product.update({
      where: {
        slug: slug,
      },
      include: {
        productSizes: true,
        productColors: true,
        images: true,
      },
      data: {
        description,
        shortDescription,
        sku,
        slug: slugData,
        stockQuantity,
        name,
        price,
        subcategoryId: subCategoryId ?? null,
        isFeatured,
        isArchived,
        categoryId,
        viewCount,
        ratingCount,
        storeId: storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    if (sizes && sizes.length > 0) {
      await createProductWithSizes(product.id, sizes);
    }

    // Tạo lại màu nếu có
    if (colors && colors.length > 0) {
      await createProductWithColors(product.id, colors);
    }

    return NextResponse.json(product);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
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
    const productOld = await prismadb.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
      },
    });
    productOld?.images.forEach(async (image) => {
      //XOA IMAGE S3
      await deleteFromS3(image.url);
    });
    await prismadb.product.update({
      where: {
        slug: slug,
      },
      data: {
        storeId: storeId,
        images: {
          deleteMany: {},
        },
        productSizes: {
          deleteMany: {},
        },
        productColors: {
          deleteMany: {},
        },
        orderItems: {
          deleteMany: {},
        },
        // images: {
        //   deleteMany: {},
        // },
      },
    });

    const product = await prismadb.product.deleteMany({
      where: {
        slug: slug,
        storeId: storeId,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
type SizesForProduct = {
  sizeId: string;
  price: number;
  stockQuantity: number;
};

type ColorsForProduct = {
  colorId: string;
  price: number;
  stockQuantity: number;
};
const createProductWithSizes = async (
  productID: string,
  sizes: SizesForProduct[]
) => {
  await Promise.all(
    sizes.map(async (size) => {
      const { sizeId, price, stockQuantity } = size;
      // Tạo mới bản ghi trong bảng productSize
      await prismadb.productSize.create({
        data: {
          productId: productID,
          sizeId,
          price,
          stockQuantity,
        },
      });
    })
  );
};
const createProductWithColors = async (
  productID: string,
  colors: ColorsForProduct[]
) => {
  await Promise.all(
    colors.map(async (colors) => {
      const { colorId, price, stockQuantity } = colors;
      // Tạo mới bản ghi trong bảng productSize
      await prismadb.productColor.create({
        data: {
          productId: productID,
          colorId,
          price,
          stockQuantity,
        },
      });
    })
  );
};
