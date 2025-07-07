/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload, {
  TempImage,
} from "@/components/ui/ImageUpload/image-upload";
import { ImageInterface } from "@/types/product";
import { Package } from "lucide-react";

interface ImageUploadSectionProps {
  form: any;
  loading: boolean;
  isMultiple?: boolean;
  note?: string;
  title?: string;
  nameFormField?: string;
}
export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  note,
  form,
  loading,
  isMultiple,
  title = "Hình ảnh sản phẩm",
  nameFormField = "images",
}) => (
  <Card className="shadow-sm ">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        {title}
      </CardTitle>

      <div className="italic text-center text-gray-800 bg-gray-200 px-3 py-1 rounded-md text-sm max-w-fit mt-1 font-medium">
        {note && `(${note})`}
      </div>
    </CardHeader>
    <CardContent>
      <FormField
        control={form.control}
        name={nameFormField}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                isMultiple={isMultiple ?? false}
                disabled={loading}
                value={field.value} // Can be TempImage[], TempImage, or null
                onChange={(images: TempImage[] | TempImage | null) => {
                  field.onChange(
                    Array.isArray(images)
                      ? images.map((img: TempImage) => ({
                          file: img.file,
                          url: img.url,
                        }))
                      : images
                      ? {
                          file: images.file,
                          url: images.url,
                        }
                      : undefined
                  );
                }}
                onRemove={(url) => {
                  const currentValue = Array.isArray(field.value)
                    ? field.value
                    : field.value
                    ? [field.value]
                    : [];

                  const filtered = currentValue.filter(
                    (img: any) => img.url !== url
                  );

                  // Nếu muốn trả về null khi không còn ảnh nào
                  field.onChange(filtered.length > 0 ? filtered : undefined);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
