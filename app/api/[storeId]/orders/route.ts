/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { CreateOrderInput } from "@/types/order";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string }>;

export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { storeId } = params;

    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "4"); // Mặc định 4 sản phẩm mỗi lần
    const currentPage = parseInt(searchParams.get("currentPage") || "1"); // Trang mặc định là 1
    const customerID = searchParams.get("customerId");
    // const customerID = searchParams.get("customerId");

    if (!storeId) {
      return new NextResponse("Chỉ có admin mới có quyền truy cập  ", {
        status: 400,
      });
    }
    const orders = await prismadb.order.findMany({
      where: {
        storeId: storeId,
        customerID: customerID ?? "",
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createAt: "desc",
      },
      take: limit,
      skip: (currentPage - 1) * limit,
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.log("[ORDERS_GET]", err);
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

    const body = await req.json();
    const {
      customerID,
      isPaid,
      phone,
      username,
      address,
      note,
      paymentMethod,
      orderItems,
      totalPrice,
    }: CreateOrderInput = body;
    if (!storeId || !username || !address || !phone || !orderItems?.length) {
      return new NextResponse("Thiếu thông tin đơn hàng.", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden ", { status: 403 });
    }

    const order = await prismadb.order.create({
      data: {
        totalPrice: totalPrice,
        storeId,
        isPaid,
        phone,
        username,
        address,
        note,
        paymentMethod,
        customerID: customerID, // Assuming `user` contains the current user's ID
        orderItems: {
          create: orderItems.map((item) => ({
            product: {
              connect: {
                id: item.productId,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
    });
    ///CAP NHAT LAI SO LUONG CUA SAN PHAM KHI DAT HANG THANH CONG !!!!
    if (order) {
      for (const item of orderItems) {
        await prismadb.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.log("[ORDER_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
