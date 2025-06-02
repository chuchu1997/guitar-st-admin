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
  const [totalProduct, setTotalProduct] = useState<number>(1);

  const getListProductsRelateWithStoreID = async () => {
    if (storeId) {
      let response = await ProductAPI.getListProducts({
        storeID: parseInt(storeId.toString()),
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
  }, []);

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
        searchKey="name"
        columns={columns}
        data={productColumns}></DataTable>
      <Heading title={"API"} description={"API Call for products"} />
      <Separator />
      {/* <ApiList entityName="products" entityIdName="slug" /> */}
    </>
  );
};
