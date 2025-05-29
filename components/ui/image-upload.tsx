/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface ImageUploadProps {
  disabled?: boolean;
  onRemove: (value: string) => void;
  onChange: (value: string) => void; // Updated to accept an array
  value: string[];
  isMultiple?: boolean; // Thêm prop isMultiple
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onRemove,
  onChange,
  value,
  isMultiple = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();

    if (isMultiple) {
      Array.from(files).forEach((file) => formData.append("files", file));
    } else {
      formData.append("files", files[0]); // Nếu chỉ là 1 tệp, chỉ thêm tệp đầu tiên
    }
    // Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = res.data;
      if (Array.isArray(data.imageUrl)) {
        data.imageUrl.map((url: string) => {
          onChange(url);
        });
      } else {
        console.warn("Dữ liệu trả về không đúng định dạng:", data);
      }

      // console.log("DATA",data)
      // onChange([...value, ...data.imageUrl]);
      // if (Array.isArray(data.imageUrl)) {
      //   // Merge newly uploaded URLs with existing ones

      // }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 relative overflow-x-auto">
        <div className="flex flex-wrap items-center gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button
                  variant={"destructive"}
                  size="icon"
                  type="button"
                  onClick={() => onRemove(url)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <Image
                fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="eager" // ✅ Ensures images load immediately
                alt="Image"
                src={url}></Image>
            </div>
          ))}
        </div>
      </div>

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={true} // Nếu isMultiple là true, cho phép chọn nhiều tệp
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}>
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
