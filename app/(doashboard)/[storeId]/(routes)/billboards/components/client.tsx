"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";

interface BillboardClientProps {
  data: BillboardColumn[];
}
export const BillboardClient = (props: BillboardClientProps) => {
  const { data } = props;

  const params = useParams();
  const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
  
      useEffect(()=>{
        setIsMounted(true);
        
      },[ ])
      
      if (!isMounted) {
        return null;
      }

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Quản lý hình ảnh  (${data?.length || 0})`}
          description={"Hình ảnh trong Store () "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data}></DataTable>
      <Heading title={"API"} description={"API Call for billboards"} />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
