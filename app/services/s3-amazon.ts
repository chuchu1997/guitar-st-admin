/** @format */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteFromS3(imageUrl: string) {
  try {
    // Tách fileKey từ URL
    const match = imageUrl.match(
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/(.*)`
    );

    if (!match || !match[1]) {
      throw new Error("Không thể tách fileKey từ URL");
    }

    const fileKey = match[1];
    console.log("FileKey:", fileKey); // Kiểm tra fileKey tách được từ URL

    // Lệnh xóa đối tượng trong S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    });

    // Thực hiện lệnh xóa
    const result = await s3.send(command);

    if (result) return { success: true, message: "Tệp đã được xóa thành công" };
  } catch (err) {
    console.error("Lỗi khi xóa tệp từ S3:", err);
    throw new Error("Không thể xóa tệp từ S3");
  }
}
export async function uploadToS3({
  buffers,
  mimetypes,
  originalFilenames,
}: {
  buffers: Buffer[];
  mimetypes: string[];
  originalFilenames: string[];
}) {
  const imageUrls: string[] = [];

  // Duyệt qua từng tệp và upload lên S3
  for (let i = 0; i < buffers.length; i++) {
    const fileKey = `happyfurniture/${uuidv4()}-${originalFilenames[i]}`;
    // Tạo lệnh PutObjectCommand cho mỗi tệp
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffers[i],
      ContentType: mimetypes[i],
    });

    try {
      console.log(`Uploading ${originalFilenames[i]} to S3...`);

      // Gửi yêu cầu upload lên S3
      const result = await s3.send(command);
      console.log(`Kết quả upload ${originalFilenames[i]}:`, result);

      // Tạo URL của tệp đã tải lên
      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      console.log(`Tạo URL thành công cho ${originalFilenames[i]}:`, imageUrl);

      // Thêm URL vào danh sách
      imageUrls.push(imageUrl);
    } catch (err) {
      console.error(`Lỗi khi upload ${originalFilenames[i]} lên S3:`, err);
      throw err;
    }
  }

  // Trả về danh sách các URL của các hình ảnh đã tải lên
  return imageUrls;
}
