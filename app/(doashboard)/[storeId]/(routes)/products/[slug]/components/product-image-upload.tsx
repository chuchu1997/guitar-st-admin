import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { ImageInterface } from "@/types/product";
import { Package } from "lucide-react";

interface ImageUploadSectionProps {
  form: any;
  loading: boolean;
  isMultiple?:boolean;
}
export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ form, loading ,isMultiple}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        Hình ảnh sản phẩm
      </CardTitle>
    </CardHeader>
    <CardContent>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                isMultiple = {isMultiple ?? false}
                disabled={loading}
                value={field.value.map((img:any) => ({
                  file: img.file,
                  url: img.url,
                }))}
                onChange={(images) => {
                  field.onChange(
                    images.map((img) => ({
                      file: img.file,
                      url: img.url,
                    }))
                  );
                }}
                onRemove={(url) =>
                  field.onChange(field.value.filter((img:any) => img.url !== url))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);