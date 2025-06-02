"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "./button";
import { Trash, Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import Image from "next/image";

export interface TempImage {
  file: File;
  url: string;
}

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (images: TempImage[]) => void;
  onRemove?: (previewUrl: string) => void;
  value: TempImage[];
  isMultiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled = false,
  onChange,
  onRemove,
  value = [],
  isMultiple = false,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFiles = useCallback((files: FileList | File[]): { valid: File[]; errors: string[] } => {
    const fileArray = Array.from(files);
    const valid: File[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        errors.push(`${file.name}: Định dạng không được hỗ trợ`);
        continue;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name}: Kích thước vượt quá ${maxFileSize}MB`);
        continue;
      }

      // Check max files limit
      if (isMultiple && value.length + valid.length >= maxFiles) {
        errors.push(`Chỉ được tải lên tối đa ${maxFiles} ảnh`);
        break;
      }

      valid.push(file);
    }

    return { valid, errors };
  }, [acceptedFormats, maxFileSize, maxFiles, isMultiple, value.length]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const { valid, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setUploadError(errors.join("; "));
      setTimeout(() => setUploadError(null), 5000);
    }

    if (valid.length === 0) return;

    const previews: TempImage[] = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = isMultiple ? [...value, ...previews] : previews;
    onChange(updatedImages);
    setUploadError(null);
  }, [validateFiles, isMultiple, value, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
    // Reset input
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    processFiles(files);
  }, [disabled, processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = (previewUrl: string) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrl);
    
    const filtered = value.filter((img) => img.url !== previewUrl);
    onChange(filtered);
    if (onRemove) onRemove(previewUrl);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver 
            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" 
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          multiple={isMultiple}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Upload className={`w-8 h-8 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragOver ? "Thả ảnh vào đây" : "Kéo thả ảnh hoặc nhấn để chọn"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hỗ trợ: JPG, PNG, WebP, GIF - Tối đa {maxFileSize}MB
              {isMultiple && ` - Tối đa ${maxFiles} ảnh`}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="pointer-events-none"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {disabled ? "Đang xử lý..." : "Chọn ảnh"}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
        </div>
      )}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Ảnh đã chọn ({value.length})
            </h4>
            {isMultiple && value.length < maxFiles && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm ảnh
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {value.map((item, index) => (
              <div
                key={item.url}
                className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <Image
                    src={item.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.url);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    disabled={disabled}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* File info */}
                <div className="p-2 space-y-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;