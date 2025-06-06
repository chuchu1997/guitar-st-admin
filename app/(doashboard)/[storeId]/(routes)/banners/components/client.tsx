"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {  columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";
import { BannerInterface } from "@/types/banner";
import BannerAPI from "@/app/api/banners/banner.api";


export const BannerClient = () => {


  const {storeId} = useParams();
  const [banners,setBanners] = useState<BannerInterface[]>([])
  const router = useRouter();
  useEffect(()=>{
    fetchAllBanners()
  },[])
  const fetchAllBanners = async () => {
    if (storeId && typeof storeId === "string") {
      let response = await BannerAPI.getBannerWithStoreID({
        storeId: Number(storeId),
      });
      if (response.status === 200) {
        const { banners } = response.data as { banners: BannerInterface[] };
        setBanners(banners);
      }
    }
  }
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Quản lý Banner  (${banners?.length || 0})`}
          description={"Hình ảnh trong Store -()- "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${storeId}/banners/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={banners}></DataTable>
      {/* <Heading title={"API"} description={"API Call for billboards"} />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" /> */}
    </>
  );
};
