"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ServiceColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";

interface ServiceClientProps {
  data: ServiceColumn[];
}
export const ServiceClient = (props: ServiceClientProps) => {
  const params = useParams();
  const router = useRouter();

  const [isMounted , setMounted] = useState(false);
  useEffect(()=>{
    setMounted(true);

  },[ ])
  
  if (!isMounted) {
    return null;
  }
  const { data } = props;



  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Dịch Vụ (${data?.length || 0})`}
          description={"Tất cả Dịch Vụ trong Store  "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/services/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data}></DataTable>
      <Heading title={"API"} description={"API Call for Servies"} />
      <Separator />
      <ApiList entityName="services" entityIdName="slug" />
    </>
  );
};
