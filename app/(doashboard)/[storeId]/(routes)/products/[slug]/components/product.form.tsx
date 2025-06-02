/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import {
  Trash,
  Plus,
  X,
  Package,
  Tag,
  Palette,
  Ruler,
  CirclePlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import EditorComponent from "@/components/editor";
import { ImageInterface, ProductInterface } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryAPI from "@/app/api/categories/categories.api";
import { CategoryInterface } from "@/types/categories";
import { IM_Fell_English } from "next/font/google";
import S3CloudAPI from "@/app/api/upload/s3-cloud";
import ProductAPI from "@/app/api/products/products.api";

const formSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  images: z
    .array(
      z.object({
        url: z.string(),
        file: z.instanceof(File),
      })
    )
    .min(1, "Bạn phải chọn ít nhất 1 ảnh"),
  isFeatured: z.boolean().default(false).optional(),
  description: z.string().min(1, "Mô tả sản phẩm là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  sku: z.string().min(1, "SKU là bắt buộc"),
  stock: z.coerce.number().min(0, "Số lượng không được âm"),
  // Required colors selection
  colors: z
    .array(
      z.object({
        colorId: z.string().min(1),
        price: z.coerce.number().min(0),
        stockQuantity: z.coerce.number().min(0),
      })
    )
    .optional(),
  // Optional sizes
  sizes: z
    .array(
      z.object({
        sizeId: z.string().min(1),
        price: z.coerce.number().min(0),
        stockQuantity: z.coerce.number().min(0),
      })
    )
    .optional(),
  viewCount: z.coerce.number().default(0).optional(),
  ratingCount: z.coerce.number().default(5).optional(),
});

// Mock data - replace with your actual data fetching
const mockCategories = [
  { id: "1", name: "Áo thun", icon: "👕" },
  { id: "2", name: "Quần jeans", icon: "👖" },
  { id: "3", name: "Giày dép", icon: "👟" },
  { id: "4", name: "Phụ kiện", icon: "🎒" },
];

const mockColors = [
  { id: "1", name: "Đen", value: "#000000" },
  { id: "2", name: "Trắng", value: "#FFFFFF" },
  { id: "3", name: "Xanh Navy", value: "#1e40af" },
  { id: "4", name: "Đỏ", value: "#dc2626" },
  { id: "5", name: "Xám", value: "#6b7280" },
  { id: "6", name: "Xanh lá", value: "#16a34a" },
];

const mockSizes = [
  { id: "1", name: "XS", label: "Extra Small" },
  { id: "2", name: "S", label: "Small" },
  { id: "3", name: "M", label: "Medium" },
  { id: "4", name: "L", label: "Large" },
  { id: "5", name: "XL", label: "Extra Large" },
  { id: "6", name: "XXL", label: "Double Extra Large" },
];

interface ProductProps {
  initialData: (ProductInterface & {}) | null;
}

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [categories, setCategories] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null); // hoặc ref đúng với Editor bạn dùng

  const params = useParams();
  const { storeId } = params;

  const router = useRouter();
  const title = initialData ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới";
  const description = initialData
    ? "Cập nhật thông tin sản phẩm của bạn"
    : "Thêm sản phẩm mới vào cửa hàng";
  const toastMessage = initialData
    ? "Sản phẩm đã được cập nhật!"
    : "Sản phẩm đã được tạo thành công!";
  const action = initialData ? "Cập nhật sản phẩm" : "Tạo sản phẩm";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: initialData?.categoryId.toString() ?? "",
      price: initialData?.price || 0,
      images: initialData?.images || [],
      isFeatured: initialData?.isFeatured || false,
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      stock: initialData?.stock || 0,
      colors: initialData?.colors || [],
      sizes: initialData?.sizes || [],
      viewCount: initialData?.viewCount || 0,
      ratingCount: initialData?.ratingCount || 5,
    },
  });
  useEffect(() => {
    if (showEditor && editorRef.current) {
      // Focus vào editor sau khi hiển thị
      setTimeout(() => {
        editorRef.current?.focus();
      }, 0); // dùng setTimeout để đảm bảo DOM đã render xong
    }
  }, [showEditor]);
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      // Upload ảnh lên S3
      const formData = new FormData();
      data.images.forEach((img) => formData.append("files", img.file));
      const uploadRes = await S3CloudAPI.uploadImageToS3(formData);

      if (uploadRes.status !== 200) throw new Error("Upload thất bại");

      const { imageUrls } = uploadRes.data as { imageUrls: ImageInterface[] };
      const {
        name,
        description,
        price,
        isFeatured = false,
        slug,
        stock,
        sku,
        categoryId,
      } = data;

      const payload = {
        name,
        description,
        price,
        isFeatured,
        slug,
        stock,
        sku,
        categoryId: Number(categoryId),
        storeId: Number(storeId),
        images: imageUrls,
      };

      const res = initialData
        ? await ProductAPI.updateProduct({ ...payload, id: initialData.id })
        : await ProductAPI.createProduct(payload);

      if (res.status === 200) {
        const { message } = res.data as { message: string };
        toast.success(message);
        router.push(`/${storeId}/products/`);
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.slug}`);
      router.refresh();
      router.push(`/${params.storeId}/products/`);
      toast.success("Sản phẩm đã được xóa thành công!");
    } catch (error) {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addColorVariant = (colorId: string) => {
    const colors = form.getValues("colors") || [];
    const existingColor = colors.find((c) => c.colorId === colorId);

    if (!existingColor) {
      form.setValue("colors", [
        ...colors,
        { colorId, price: form.getValues("price"), stockQuantity: 0 },
      ]);
    }
  };
  const createNewColorVariant = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    const colors = form.getValues("colors") || [];

    const newColor = {
      id: "4",
      name: name,
      value: value,
    };
    const existingColor = colors.find((c) => c.colorId === newColor.id);
    if (!existingColor) {
    }

    // { id: "1", name: "Đen", value: "#000000" },
  };
  const removeColorVariant = (colorId: string) => {
    const colors = form.getValues("colors") || [];
    form.setValue(
      "colors",
      colors.filter((c) => c.colorId !== colorId)
    );
  };

  const addSizeVariant = (sizeId: string) => {
    const sizes = form.getValues("sizes") || [];
    const existingSize = sizes.find((s) => s.sizeId === sizeId);

    if (!existingSize) {
      form.setValue("sizes", [
        ...sizes,
        { sizeId, price: form.getValues("price"), stockQuantity: 0 },
      ]);
    }
  };

  const removeSizeVariant = (sizeId: string) => {
    const sizes = form.getValues("sizes") || [];
    form.setValue(
      "sizes",
      sizes.filter((s) => s.sizeId !== sizeId)
    );
  };

  useEffect(() => {
    setIsMounted(true);

    fetchCategoriesFromSV();
  }, []);
  const fetchCategoriesFromSV = async () => {
    let response = await CategoryAPI.getCategoriesRelateWithStoreID({
      justGetParent: false,
      storeID: Number(storeId),
    });
    if (response.status === 200) {
      const { categories } = response.data as {
        categories: CategoryInterface[];
      };
      if (categories.length <= 0) {
        const toastId = toast.error("Chưa có danh mục để tạo sản phẩm");
        setTimeout(() => {
          toast.dismiss(toastId); // Đảm bảo toast biến mất trước khi đi
          router.push(`/${storeId}/categories`);
        }, 3000);
      }
    }
  };

  if (!isMounted) return null;

  const selectedColors = form.watch("colors") || [];
  const selectedSizes = form.watch("sizes") || [];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          setOpen(false);
          await onDelete();
        }}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Heading title={title} description={description} />
        </div>
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => setOpen(true)}
            className="gap-2">
            <Trash className="w-4 h-4" />
            Xóa sản phẩm
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
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
                        isMultiple
                        disabled={loading}
                        value={field.value!.map((img) => ({
                          file: img.file, // giữ nguyên file thật
                          url: img.url,
                        }))}
                        onChange={(images) => {
                          field.onChange(
                            images.map((img) => ({
                              file: img.file, // giữ nguyên File gốc
                              url: img.url,
                            }))
                          );
                          console.log("IMAGES", field.value);
                        }}
                        onRemove={(url) =>
                          field.onChange(
                            field.value!.filter((img) => img.url !== url)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
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
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.name}
                            </div>
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
                      />
                    </FormControl>
                    <FormDescription>Mã sản phẩm duy nhất</FormDescription>
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
                      <Input
                        type="number"
                        disabled={loading}
                        {...field}
                        placeholder="299000"
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {!showEditor ? (
                      <div
                        className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => setShowEditor(true)}>
                        <div className="text-4xl mb-2">✍️</div>
                        <p className="text-gray-500">
                          Click để thêm mô tả sản phẩm
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FormControl>
                          <EditorComponent
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <div className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditor(false)}>
                            Ẩn Editor
                          </Button>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Color Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Màu sắc của sản phẩm (Tùy chọn)
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColors(!showColors)}>
                  {showColors ? "Ẩn" : "Thêm"} Màu Sắc
                </Button>
              </div>
            </CardHeader>
            {showColors && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {mockColors.map((color) => {
                    const isSelected = selectedColors.some(
                      (s) => s.colorId === color.id
                    );

                    return (
                      <div
                        key={color.id}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            removeColorVariant(color.id);
                          } else {
                            addColorVariant(color.id);
                          }
                        }}>
                        <div className="font-bold text-lg">{color.name}</div>
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-xs text-gray-500">
                          {color.value}
                        </div>
                        {isSelected && (
                          <div className="mt-1 text-blue-500 text-xs">
                            ✓ Đã chọn
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    className="min-h-[100px] border-2 rounded-lg p-3 cursor-pointer transition-all text-center">
                    Tạo mới Màu Sắc
                  </Button>
                </div>

                {selectedColors.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">
                      Cấu hình kích thước đã chọn:
                    </h4>
                    {selectedColors.map((colorVariant, index) => {
                      const color = mockColors.find(
                        (s) => s.id === colorVariant.colorId
                      );
                      return (
                        <div
                          key={colorVariant.colorId}
                          className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline">{color?.name}</Badge>
                            <span className="text-sm text-gray-600">
                              {color?.value}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeColorVariant(colorVariant.colorId)
                              }>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`colors.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Giá</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={loading}
                                      {...field}
                                      placeholder="299000"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`colors.${index}.stockQuantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số lượng</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={loading}
                                      {...field}
                                      placeholder="10"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
          {/* Size Variants (Optional) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Kích thước sản phẩm (Tùy chọn)
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSizes(!showSizes)}>
                  {showSizes ? "Ẩn" : "Thêm"} kích thước
                </Button>
              </div>
            </CardHeader>
            {showSizes && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {mockSizes.map((size) => {
                    const isSelected = selectedSizes.some(
                      (s) => s.sizeId === size.id
                    );
                    return (
                      <div
                        key={size.id}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all text-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            removeSizeVariant(size.id);
                          } else {
                            addSizeVariant(size.id);
                          }
                        }}>
                        <div className="font-bold text-lg">{size.name}</div>
                        <div className="text-xs text-gray-500">
                          {size.label}
                        </div>
                        {isSelected && (
                          <div className="mt-1 text-blue-500 text-xs">
                            ✓ Đã chọn
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedSizes.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium">
                      Cấu hình kích thước đã chọn:
                    </h4>
                    {selectedSizes.map((sizeVariant, index) => {
                      const size = mockSizes.find(
                        (s) => s.id === sizeVariant.sizeId
                      );
                      return (
                        <div
                          key={sizeVariant.sizeId}
                          className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline">{size?.name}</Badge>
                            <span className="text-sm text-gray-600">
                              {size?.label}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeSizeVariant(sizeVariant.sizeId)
                              }>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`sizes.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Giá</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={loading}
                                      {...field}
                                      placeholder="299000"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`sizes.${index}.stockQuantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Số lượng</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={loading}
                                      {...field}
                                      placeholder="10"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">
                        Sản phẩm nổi bật
                      </FormLabel>
                      <FormDescription>
                        Sản phẩm sẽ được hiển thị trong danh sách sản phẩm nổi
                        bật trên trang chủ
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[150px] cursor-pointer"
              size="lg">
              {loading ? "Đang xử lý..." : action}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              size="lg">
              Hủy bỏ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
