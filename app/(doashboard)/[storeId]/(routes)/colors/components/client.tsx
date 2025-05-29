"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorsColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";


  //  id:color.id,
  //   name:color.name,
  //   hexCode:color.hexCode,
  //   createAt:format(color.createdAt,"MM/dd/yyyy")
interface ColorsClientProps {
  data: ColorsColumn[];
}
export const ColorsClient = (props: ColorsClientProps) => {
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
          title={`Colors (${data?.length || 0})`}
          description={"Hình ảnh đại diện cho danh mục colors  của Store () "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data}></DataTable>
      <Heading title={"API"} description={"API Call for billboards"} />
      <Separator />
      <ApiList entityName="name" entityIdName="colorId" />
    </>
  );
};
