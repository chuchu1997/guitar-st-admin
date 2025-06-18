/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";

import { PromotionAPI } from "@/app/api/promotions/promotion.api";
import { PromotionType } from "@/types/promotions";

export const PromotionClient = () => {
  const { storeId } = useParams();
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [totalPromotions, setTotalPromotions] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    fetchPromotions();
  }, []);
  const fetchPromotions = async () => {
    if (storeId) {
      let response = await PromotionAPI.getAllPromotionsFromStore({
        storeID: Number(storeId),
        currentPage: currentPage,
      });
      if (response.status === 200) {
        console.log("RESPONSE", response);
        setPromotions(response.data);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Các chương trình khuyến mãi   (${totalPromotions})`}
          description={"Tất cả chương trình khuyến mãi trong STORE  "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${storeId}/promotions/new`)}>
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={promotions}
        totalItems={totalPromotions}
        currentPage={currentPage}
        onPageChange={async (page: number) => {
          setCurrentPage(page);
        }}></DataTable>
      {/* <Heading title={"API"} description={"API Call for products"} />
      <Separator />
      <ApiList entityName="news" entityIdName="slug" /> */}
    </>
  );
};
