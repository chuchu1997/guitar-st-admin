"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "./button";
import { 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Plus,
  Check,
  AlertCircle,
  FileImage,
  Loader2
} from "lucide-react";
import Image from "next/image";

export interface TempImage {
  file?: File;
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setIsProcessing(true);
    
    const { valid, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      setUploadError(errors.join("; "));
      setTimeout(() => setUploadError(null), 5000);
    }

    if (valid.length === 0) {
      setIsProcessing(false);
      return;
    }

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const previews: TempImage[] = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = isMultiple ? [...value, ...previews] : previews;
    onChange(updatedImages);
    setUploadError(null);
    setIsProcessing(false);
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
    
    if (disabled || isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    processFiles(files);
  }, [disabled, isProcessing, processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) setIsDragOver(true);
  }, [disabled, isProcessing]);

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

  const getFormatDisplayText = () => {
    const formats = acceptedFormats.map(format => format.split('/')[1].toUpperCase());
    return formats.join(", ");
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group
          ${isDragOver 
            ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 scale-105" 
            : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-800/50 dark:hover:to-blue-950/20"
          }
          ${disabled || isProcessing ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:scale-102"}
          ${value.length > 0 ? "p-6" : "p-8"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          multiple={isMultiple}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isProcessing}
        />

        <div className="space-y-4">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                Đang xử lý ảnh...
              </p>
            </div>
          ) : (
            <>
              <div className={`
                w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300
                ${isDragOver 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110" 
                  : "bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-700 dark:to-blue-900 text-slate-600 dark:text-slate-300 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:text-blue-600"
                }
              `}>
                <Upload className="w-8 h-8" />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {isDragOver ? "Thả ảnh vào đây" : "Kéo thả ảnh hoặc nhấn để chọn"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                  <span className="block">Hỗ trợ: {getFormatDisplayText()}</span>
                  <span className="block">Tối đa {maxFileSize}MB mỗi ảnh
                    {isMultiple && ` • Tối đa ${maxFiles} ảnh`}
                  </span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={disabled || isProcessing}
                className={`
                  pointer-events-none mx-auto transition-all duration-200 border-2
                  ${isDragOver 
                    ? "border-blue-400 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" 
                    : "hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                  }
                `}
              >
                <FileImage className="w-4 h-4 mr-2" />
                {disabled || isProcessing ? "Đang xử lý..." : "Chọn ảnh"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Có lỗi xảy ra</h4>
              <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Ảnh đã chọn ({value.length}{isMultiple ? `/${maxFiles}` : ""})
              </h4>
              {value.length > 0 && (
                <div className="flex items-center gap-1 ">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Sẵn sàng</span>
                </div>
              )}
            </div>
            
            {isMultiple && value.length < maxFiles && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isProcessing}
                className="hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm ảnh
              </Button>
            )}
          </div>

          <div   className={`${
    isMultiple ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid grid-cols-1'
  } gap-4`}>
            {value.map((item, index) => (
              <div
                key={item.url}
                className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-102"
              >
                {/* Image */}
                <div className="aspect-square max-h-[500px] w-full relative">
                  <Image
                    src={item.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-102"
                  />
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 s group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.url);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 backdrop-blur-sm"
                    disabled={disabled || isProcessing}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Success indicator */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* File info */}
                <div className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/20">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mb-1">
                    {item.file?.name || `Image ${index + 1}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.file && formatFileSize(item.file.size)}
                    </p>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          {value.length > 1 && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  value.forEach(img => URL.revokeObjectURL(img.url));
                  onChange([]);
                }}
                disabled={disabled || isProcessing}
                className="text-red-600 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tất cả ({value.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;