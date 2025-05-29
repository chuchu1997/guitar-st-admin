/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

type Params = Promise<{ storeId: string; id: string }>;
export async function GET(req: Request, props: { params: Params }) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return new NextResponse("ID là bắt buộc  ", { status: 400 });
    }
    const news = await prismadb.news.findUnique({
      where: {
        slug: id,
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
    // Lấy các thông tin từ request params
    const params = await props.params;
    const { storeId, id } = params; // action có thể là 'cancelled' hoặc các giá trị khác
    const { action, orderStatus, customerID } = await req.json(); // Lấy action và orderStatus từ body
    //NEU GUI TU CUSTOMER THI CHI CO HUY DON !!!!
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!id) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Tìm đơn hàng theo ID
    const order = await prismadb.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: true,
      },
    });

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }
    //LUU Y CONDITION NAY CHI HOAT DONG DOI VOI CUSTOMER
    if (customerID) {
      // THAO TAC HUY TU CUSTOMER
      // Xử lý hủy đơn hàng nếu action là 'cancelled'
      if (action === "cancelled") {
        if (!customerID || order.customerID !== customerID) {
          console.log("ACTION", action);
          return new NextResponse(
            "You are not authorized to cancel this order",
            {
              status: 403,
            }
          );
        }

        //TRA STOCK VE CHO PRODUCT
        if (order) {
          for (const item of order.orderItems) {
            await prismadb.product.update({
              where: {
                id: item.productId,
              },
              data: {
                stockQuantity: {
                  increment: item.quantity, // Sửa thành increment
                },
              },
            });
          }
        }

        // Cập nhật trạng thái đơn hàng thành "cancelled"
        const updatedOrder = await prismadb.order.update({
          where: {
            id: id,
          },
          data: {
            orderStatus: "cancelled", // Cập nhật trạng thái đơn hàng thành "Đã huỷ"
            updateAt: new Date(),
          },
        });
        return NextResponse.json(updatedOrder);
      }
    }

    // DAY LA HOAT DONG DANH CHO ADMIN
    const user = await getCurrentUser();

    // Kiểm tra nếu người dùng chưa đăng nhập hoặc không có quyền admin
    if (!user) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedOrder = await prismadb.order.update({
      where: {
        id: id,
      },
      data: {
        orderStatus: orderStatus, // Cập nhật trạng thái từ request body
        updateAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.log("[Order_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Params }) {
  try {
    const user = await getCurrentUser();

    const params = await props.params;
    const { storeId, id } = params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!id) {
      return new NextResponse("Id is required ", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    await prismadb.order.update({
      where: {
        id: id,
      },
      data: {
        orderItems: {
          deleteMany: {},
        },
      },
    });

    const order = await prismadb.order.deleteMany({
      where: {
        id: id,
        storeId: storeId,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.log("[Order_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
