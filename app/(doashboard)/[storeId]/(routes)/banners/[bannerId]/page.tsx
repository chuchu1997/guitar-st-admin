/** @format */

"use client";

import { useEffect, useState } from "react";
import { BannerForm } from "./components/banner-form";
import { useParams } from "next/navigation";
import BannerAPI from "@/app/api/banners/banner.api";
import { BannerInterface } from "@/types/banner";

const BannerPage = () => {
  const { bannerId } = useParams();
  const [initialData, setInitialData] = useState<BannerInterface | null>(null);
  useEffect(() => {
    fetchBannerById();
  }, []);
  const fetchBannerById = async () => {
    if (bannerId !== "new") {
      let response = await BannerAPI.getBannerById(Number(bannerId));
      if (response.status === 200) {
        const { banner } = response.data as { banner: BannerInterface };
        setInitialData(banner);
      }
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerForm initialData={initialData}></BannerForm>
      </div>
    </div>
  );
};

export default BannerPage;
