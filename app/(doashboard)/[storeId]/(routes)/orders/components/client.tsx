/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";
import { OrderAPI } from "@/app/api/orders/orders.api";

export const OrderClient = () => {
  const { storeId } = useParams();
  const [orders, setOrders] = useState<OrderColumn[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchOrders = async () => {
    let res = await OrderAPI.getAllOrders({
      limit: 4,
      currentPage,
    });

    if (res.status === 200) {
      setTotalOrders(res.data.total);
      setOrders(
        res.data.orders.map((order: any) => ({
          id: order.id,
          phone: order.user.phone,
          username: order.user.name,
          address: order.address,
          items: [
            {
              name: "1221",
              quantity: 1,
              price: 1,
            },
          ],
          createdAt: order.createdAt,
          totalPrice: order.total,
        }))
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // const params = useParams();
  // const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Quản lý đơn đặt hàng   `}
          description={"Tất đơn đặt hàng  trong Store  "}
        />
        {/* <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/orders/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button> */}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={orders}
        totalItems={totalOrders}
        currentPage={currentPage}
        onPageChange={async (page) => {
          setCurrentPage(page);
        }}></DataTable>
      {/* <Heading title={"API"} description={"API Call for products"} /> */}
      {/* <Separator />
      <ApiList entityName="news" entityIdName="slug" /> */}
    </>
  );
};
