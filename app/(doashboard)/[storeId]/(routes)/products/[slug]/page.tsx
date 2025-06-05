"use client";

import prismadb from "@/lib/primadb";
import { ProductForm } from "./components/product.form";
import { useParams } from "next/navigation";
import ProductAPI from "@/app/api/products/products.api";
import { useEffect, useState } from "react";
import { ProductInterface } from "@/types/product";



const ProductPage =  () => {
  const {storeId,slug} = useParams();
  
  const [productData,setProductData] = useState<ProductInterface |null>(null);
    useEffect(()=>{
      if(slug){
              getProductBySlug();
      }
  
  },[slug])
  const getProductBySlug = async ()=>{
    if(slug){
       const response = await ProductAPI.getProductBySlug(slug.toString())
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
        />
      </div>
    </div>
  );
};

export default ProductPage;
