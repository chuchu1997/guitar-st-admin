/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag } from "lucide-react";
import { NumericFormat } from "react-number-format";

interface BasicInfoSectionProps {
  form: any;
  loading: boolean;
  categories: Array<{ id: number; name: string }>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  loading,
  categories,
}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <Tag className="w-5 h-5 text-green-600" />
        </div>
        Thông tin cơ bản
      </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên sản phẩm *</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                {...field}
                placeholder="Nhập tên sản phẩm"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Danh mục *</FormLabel>
            <Select
              disabled={loading}
              onValueChange={field.onChange}
              value={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug *</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                {...field}
                placeholder="san-pham-moi"
                pattern="\S*"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              URL thân thiện (không dấu, không khoảng trắng)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU *</FormLabel>
            <FormControl>
              <Input
                disabled={loading}
                {...field}
                placeholder="SP-001"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>Mã sản phẩm duy nhất</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="originalPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giá cũ </FormLabel>
            <FormControl>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                suffix=" ₫"
                allowNegative={false}
                placeholder="299.000 ₫"
                disabled={loading}
                customInput={Input}
                className="focus:ring-2 focus:ring-blue-500"
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.floatValue); // Lưu số thật, không phải chuỗi
                }}
              />
            </FormControl>
            <FormDescription>Giá bán cơ bản (VNĐ)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giá cơ bản *</FormLabel>
            <FormControl>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                suffix=" ₫"
                allowNegative={false}
                placeholder="299.000 ₫"
                disabled={loading}
                customInput={Input}
                className="focus:ring-2 focus:ring-blue-500"
                value={field.value}
                onValueChange={(values) => {
                  field.onChange(values.floatValue); // Lưu số thật, không phải chuỗi
                }}
              />
            </FormControl>
            <FormDescription>Giá bán cơ bản (VNĐ)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số lượng tồn kho</FormLabel>
            <FormControl>
              <Input
                type="number"
                disabled={loading}
                {...field}
                placeholder="100"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
