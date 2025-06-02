/** @format */

import { UserInterface } from "@/types/user";
import authApi from "../auth/auth.api";
import { Role } from "@/types/auth";
import { uploadToS3 } from "@/app/services/s3-amazon";
import api from "../interceptor";

const url = "/upload";
const S3CloudAPI = {
  uploadImageToS3: async (formData: FormData) => {
    return await api({
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: url,
      data: formData,
    });
  },
};

export default S3CloudAPI;
