/** @format */

import api from "../interceptor";

import { CreateBannerInterface, UpdateBannerInterface } from "@/types/banner";

let url = "/banners";

const BannerAPI = {
  getBannerWithStoreID: async (storeID: number) => {
    return await api({
      method: "GET",
      url: url,
      params: {
        storeID: storeID,
      },
    });
  },
  createBanner: async (data: CreateBannerInterface) => {
    return await api({
      method: "POST",
      url: url,
      data: data,
    });
  },

  getBannerById: async (id: number) => {
    return await api({
      method: "GET",
      url: `${url}/${id}`,
    });
  },
  updateBanner: async (id: number, data: UpdateBannerInterface) => {
    return await api({
      method: "PATCH",
      url: `${url}/${id}`,
      data: data,
    });
  },
  deleteBanner: async (id: number) => {
    return await api({
      method: "DELETE",
      url: `${url}/${id}`,
    });
  },
};

export default BannerAPI;
