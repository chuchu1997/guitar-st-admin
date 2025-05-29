/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import { uploadToS3 } from "@/app/services/s3-amazon";

import { NextResponse } from "next/server";
import { parseFormDataFromRequest } from "@/lib/parseFormDataFromRequest";

export async function POST(req: Request) {
  try {
    // Kiểm tra người dùng có quyền không
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Bạn không có quyền truy cập", { status: 403 });
    }

    // Phân tích tệp tải lên từ form

    const { buffers, mimetypes, originalFilenames } =
      await parseFormDataFromRequest(req);

    const imageUrl = await uploadToS3({
      buffers,
      mimetypes,
      originalFilenames,
    });

    // Trả về URL của hình ảnh đã tải lên
    return NextResponse.json({ imageUrl: imageUrl }, { status: 200 });

    // Trả về URL của hình ảnh đã tải lên
  } catch (err) {
    console.error("[UPLOAD_IMAGE_API]", err);
    return new NextResponse("Lỗi gì đó ", { status: 500 });
  }
}
