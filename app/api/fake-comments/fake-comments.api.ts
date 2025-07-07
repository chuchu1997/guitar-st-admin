/** @format */

import { FakeComment, FakeCommentCreate } from "@/types/fake-comments";
import api from "../interceptor";

const url = "/fakecomments";
const FakeCommentAPI = {
  updateFakeComment: async (id: number, fakeData: FakeComment) => {
    return await api({
      method: "PATCH",
      url: `${url}/${id}`,
      data: fakeData,
    });
  },

  createFakeComment: async (fakeParams: FakeCommentCreate) => {
    return await api({
      method: "POST",
      url,
      data: fakeParams,
    });
  },

  getFakeComments: async ({
    storeID,
    limit,
    currentPage,
  }: {
    storeID: number;
    limit: number;
    currentPage: number;
  }) => {
    return await api({
      method: "GET",
      url,
      params: {
        storeID,
        limit,
        currentPage,
      },
    });
  },
};

export default FakeCommentAPI;
