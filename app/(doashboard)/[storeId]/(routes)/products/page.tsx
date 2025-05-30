/** @format */

"use client";

import { ProductClient } from "./components/client";
import { format } from "date-fns";
import { redirect, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ProductAPI from "@/app/api/products/products.api";
import { ProductInterface } from "@/types/product";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductPage = (props: CategoriesPageProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient />
      </div>
    </div>
  );
};
export default ProductPage;
