"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[];
}
export const OrderClient = (props: OrderClientProps) => {
  const { data } = props;

  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Quản lý đơn đặt hàng   (${data?.length || 0})`}
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
      <DataTable searchKey="name" columns={columns} data={data}></DataTable>
      <Heading title={"API"} description={"API Call for products"} />
      <Separator />
      <ApiList entityName="news" entityIdName="slug" />
    </>
  );
};
