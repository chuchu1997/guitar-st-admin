"use client";

import prismadb from "@/lib/primadb";
import { ProductForm } from "./components/product.form";
import { useParams } from "next/navigation";
import ProductAPI from "@/app/api/products/products.api";
import { useEffect, useState } from "react";
import { ProductInterface } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const ProductPage =  () => {

  const {storeId,slug} = useParams();
  const [productData,setProductData] = useState<ProductInterface |null>(null);

  console.log("STORE ID",storeId);
  console.log("slug",slug)
    useEffect(()=>{
      getProductBySlug();
  },[])
  const getProductBySlug = async ()=>{
    if(slug){
       const response = await ProductAPI.getProductBySlug(slug.toString())
       console.log("response",response)
       if(response.status === 200){
        const {product} = response.data as {product:ProductInterface}
      
        setProductData(product)
     


       }
    }
   
  }
 
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
      
        <ProductForm
          initialData={productData}
          // sizes={sizes}
          // colors={colors}
          // defaultCategoryId={defaultCategory?.id}
        />
      </div>
    </div>
  );
};

export default ProductPage;
