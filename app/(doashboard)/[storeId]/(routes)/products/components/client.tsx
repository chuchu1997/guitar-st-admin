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
import { ProductInterface } from "@/types/product";
import ProductAPI from "@/app/api/products/products.api";
import { useEffect, useState } from "react";

export const ProductClient = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const [productColumns, setProductColumns] = useState<ProductInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalProduct, setTotalProduct] = useState<number>(1);

  const getListProductsRelateWithStoreID = async () => {
    if (storeId) {
      let response = await ProductAPI.getListProducts({
        currentPage: currentPage,
        storeID: Number(storeId),
      });
      if (response.status === 200) {
        const { products, total } = response.data as {
          products: ProductInterface[];
          total: number;
        };

        if (products) {
          setProductColumns(products);
          setTotalProduct(total);
        }
      }
    }
  };
  useEffect(() => {
    getListProductsRelateWithStoreID();
  }, [currentPage]);

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Sản Phẩm (${totalProduct})`}
          description={"Tất cả Product trong Store  "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${storeId}/products/new`)}>
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable
        currentPage={currentPage}
        onPageChange={async (page: number) => {
          setCurrentPage(page);
        }}
        totalItems={totalProduct}
        searchKey="name"
        columns={columns}
        data={productColumns}></DataTable>

      <Separator />

      {/* <ApiList entityName="products" entityIdName="slug" /> */}
    </>
  );
};
