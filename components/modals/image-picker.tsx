/** @format */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  AlignLeft,
  AlignRight,
  Maximize2,
  X,
  Check,
  Loader2,
} from "lucide-react";
import S3CloudAPI from "@/app/api/upload/s3-cloud";

interface ImagePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, position: "left" | "right" | "full") => void;
}

export default function ImagePickerDialog({
  open,
  onClose,
  onInsert,
}: ImagePickerDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<"left" | "right" | "full">("full");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await S3CloudAPI.uploadImageToS3(formData);
    if (res.status === 200) {
      const { imageUrls } = res.data;
      return imageUrls[0];
    }
    throw new Error("Upload failed");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Có lỗi xảy ra khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInsert = () => {
    if (previewUrl) {
      onInsert(previewUrl, position);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation completes
    setTimeout(() => {
      setPreviewUrl(null);
      setPosition("full");
      setIsUploading(false);
      setDragActive(false);
    }, 200);
  };

  const positionOptions = [
    { value: "left", label: "Trái", icon: AlignLeft },
    { value: "right", label: "Phải", icon: AlignRight },
    { value: "full", label: "Toàn bộ", icon: Maximize2 },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Chèn hình ảnh
                </DialogTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tải lên và định vị hình ảnh của bạn
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
              ${
                dragActive
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-105"
                  : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }
              ${isUploading ? "pointer-events-none opacity-75" : ""}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="space-y-4">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                    Đang tải lên...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Kéo thả hoặc nhấp để chọn ảnh
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Hỗ trợ PNG, JPG, GIF (tối đa 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-80 object-contain"
                />
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Position Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Chọn vị trí hiển thị
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {positionOptions.map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={position === value ? "default" : "outline"}
                      onClick={() => setPosition(value)}
                      className={`
                        h-16 flex-col gap-2 transition-all duration-200
                        ${
                          position === value
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                            : "hover:scale-105 hover:shadow-md"
                        }
                      `}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleClose} className="px-6">
              Hủy bỏ
            </Button>
            <Button
              onClick={handleInsert}
              disabled={!previewUrl || isUploading}
              className={`
                px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                ${previewUrl ? "shadow-lg hover:shadow-xl" : ""}
              `}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Chèn ảnh
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
