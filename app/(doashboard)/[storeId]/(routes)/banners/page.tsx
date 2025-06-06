"use client";
import { useEffect, useState } from "react";

import { BannerClient } from "./components/client";
const BannerPage =  () => {
  const [isMounted,setIsMounted] = useState(false);

  useEffect(()=>{
    setIsMounted(true);
  },[])
  if(!isMounted) return null
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerClient />
      </div>
    </div>
  );
};

export default BannerPage;
