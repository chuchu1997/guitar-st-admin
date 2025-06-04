/** @format */

"use client";
import { Form } from "@/components/ui/form";
import {
  ImageInterface,
  ProductColorInterface,
  ProductInterface,
} from "@/types/product";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUploadSection } from "./product-image-upload";
import { BasicInfoSection } from "./product-basic-info";
import toast from "react-hot-toast";
import CategoryAPI from "@/app/api/categories/categories.api";
import { useParams } from "next/navigation";
import { CategoryInterface } from "@/types/categories";
import router from "next/router";
import { DescriptionSection } from "./product-description";
import { VariantSelector } from "./product-variant-selector";
import { Palette } from "lucide-react";
import { SettingsSection } from "./product-setting";
import { Button } from "@/components/ui/button";
import ProductAPI from "@/app/api/products/products.api";
import S3CloudAPI from "@/app/api/upload/s3-cloud";

const formSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  images: z
    .array(
      z.object({
        url: z.string(),
        file: z.instanceof(File).optional(), // <- optional ở đây
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
        id: z.number().min(1),
        name: z.string().min(1),
        hex: z.string().min(1),
        price: z.coerce.number().min(0),
        stock: z.coerce.number().min(0),
      })
    )
    .optional(),
  // Optional sizes
  sizes: z
    .array(
      z.object({
        id: z.number().min(1),
        name: z.string().min(1),
        price: z.coerce.number().min(0),
        stock: z.coerce.number().min(0),
      })
    )
    .optional(),
  viewCount: z.coerce.number().default(0).optional(),
  ratingCount: z.coerce.number().default(5).optional(),
});
interface ProductProps {
  initialData: (ProductInterface & {}) | null;
}
type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
  const { storeId } = useParams();

  const mockColors: ProductColorInterface[] = [
    {
      id: 1,
      name: "Đỏ Cổ Điển",
      productId: 1,
      hex: "#DC2626",
      price: 100000,
      stock: 15,
    },
    {
      id: 2,
      name: "Xanh Dương",
      productId: 1,
      hex: "#2563EB",
      price: 100000,
      stock: 12,
    },
  ];
  const action = initialData ? "Cập nhật sản phẩm" : "Tạo sản phẩm";
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      images: [],
      isFeatured: false,
      description: "",
      slug: "",
      sku: "",
      stock: 0,
      colors: mockColors,
      sizes: [],
      viewCount: 0,
      ratingCount: 5,
    },
  });
  const [selectedColors, setSelectedColors] = useState<ProductColorInterface[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const handleColorToggle = (colorId: string) => {
    const existing = selectedColors.find((c) => c.id?.toString() === colorId);
    if (existing) {
      setSelectedColors((prev) =>
        prev.filter((c) => c.id?.toString() !== colorId)
      );
    } else {
      const color = mockColors.find((c) => c.id?.toString() === colorId);
      if (color) {
        setSelectedColors((prev) => [...prev, color]);
      }
    }
  };
  const onSubmit = async (data: ProductFormValues) => {
    // try {
    // setLoading(true);
    console.log("DATA", data);

    // Upload ảnh lên S3

    // const oldImages = data.images.filter((img) => !img.file); // Ảnh cũ (chỉ có url)
    // const newImages = data.images.filter((img) => img.file); // Ảnh mới (có file cần upload)
    // let finalImageUrls: ImageInterface[] = [...oldImages]; // Bắt đầu từ ảnh cũ
    // if (newImages.length > 0) {
    //   const formData = new FormData();

    //   newImages.forEach((img) => {
    //     if (img.file) {
    //       formData.append("files", img.file);
    //     }
    //   });

    //   const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
    //   if (uploadRes.status !== 200) throw new Error("Upload thất bại");

    //   const { imageUrls } = uploadRes.data as { imageUrls: [] };
    //   const uploadedImageUrls: ImageInterface[] = imageUrls.map((img) => ({
    //     url: img,
    //     file: undefined,
    //   }));

    // Ghép ảnh mới vào danh sách cuối cùng
    // finalImageUrls = [...oldImages, ...uploadedImageUrls];
  };

  // const {
  //   name,
  //   description,
  //   price,
  //   isFeatured = false,
  //   slug,
  //   stock,
  //   sku,
  //   categoryId,
  // } = data;

  // const payload = {
  //   name,
  //   description,
  //   price,
  //   isFeatured,
  //   slug,
  //   stock,
  //   sku,
  //   categoryId: Number(categoryId),
  //   storeId: Number(storeId),
  //   images: finalImageUrls,
  // };

  // const res = initialData
  //   ? await ProductAPI.updateProduct({ ...payload, id: initialData.id })
  //   : await ProductAPI.createProduct(payload);

  // if (res.status === 200) {
  //   const { message } = res.data as { message: string };
  //   toast.success(message);
  //   router.push(`/${storeId}/products/`);
  // }
  // } catch (err) {
  //   toast.error("Có lỗi xảy ra, vui lòng thử lại!");
  // } finally {
  //   setLoading(false);
  // }
  useEffect(() => {
    console.log("Errors:", form.formState.errors);

    // Ví dụ: kiểm tra lỗi cụ thể
    if (form.formState.errors) {
      console.log("Có lỗi ở trường colors:", form.formState.errors.colors);
    }
  }, [form.formState.errors]);
  useEffect(() => {
    fetchCategoriesAndResetForm(); // chỉ gọi khi có dữ liệu
  }, [initialData]);

  const fetchCategoriesAndResetForm = async () => {
    setLoading(true);
    try {
      const response = await CategoryAPI.getCategoriesRelateWithStoreID({
        justGetParent: false,
        storeID: Number(storeId),
      });

      if (response.status !== 200) {
        throw new Error("Lấy danh mục thất bại");
      }

      const { categories } = response.data as {
        categories: CategoryInterface[];
      };
      setCategories(categories);

      if (categories.length <= 0) {
        const toastId = toast.error("Chưa có danh mục để tạo sản phẩm");
        setTimeout(() => {
          toast.dismiss(toastId);
          router.push(`/${storeId}/categories`);
        }, 3000);
        return; // thoát sớm nếu không có danh mục
      }

      // Reset form sau khi có danh sách danh mục
      if (initialData) {
        const formData: ProductFormValues = {
          ...initialData,
          sizes:
            initialData.sizes !== null &&
            initialData.sizes !== undefined &&
            initialData.sizes.length > 0
              ? initialData.sizes.map((size) => ({
                  id: size.id ?? 0,
                  name: size.name ?? "",
                  stock: size.stock ?? initialData.price,
                  price: size.price ?? initialData.price,
                }))
              : [],
          colors:
            initialData.colors !== null &&
            initialData.colors !== undefined &&
            initialData.colors.length > 0
              ? initialData.colors.map((color) => ({
                  id: color.id ?? 0,
                  name: color.name,
                  hex: color.hex,
                  stock: color.stock ?? initialData.price,
                  price: color.price ?? initialData.price,
                }))
              : [],
          categoryId: initialData.categoryId.toString(),
        };
        setTimeout(() => {
          form.reset(formData);
        }, 500);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh mục, vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {action} Sản Phẩm
        </h1>
        <p className="text-gray-600">
          Điền thông tin chi tiết để tạo sản phẩm mới
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ImageUploadSection form={form} loading={loading} />

          <BasicInfoSection
            form={form}
            loading={loading}
            categories={categories}
          />

          <DescriptionSection form={form} loading={loading} />

          <VariantSelector
            form={form}
            loading={loading}
            type="color"
            title="Màu sắc"
            icon={<Palette />}
            options={mockColors}
            selectedVariants={selectedColors}
            onToggleVariant={handleColorToggle}
            onRemoveVariant={(id) =>
              setSelectedColors((prev) =>
                prev.filter((c) => c.id?.toString() !== id)
              )
            }
          />

          {/* <VariantSelector
            form={form}
            loading={loading}
            type="size"
            title="Kích thước sản phẩm (Tùy chọn)"
            icon={<Ruler className="w-5 h-5 text-orange-600" />}
            options={mockSizes}
            selectedVariants={selectedSizes}
            onToggleVariant={handleSizeToggle}
            onRemoveVariant={(id) => setSelectedSizes(prev => prev.filter(s => s.sizeId !== id))}
          /> */}

          <SettingsSection form={form} loading={loading} />

          <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[150px] bg-gradient-to-r from-blue-600 to-purple-600 
                        hover:from-blue-700 hover:to-purple-700 text-white font-medium
                        shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg">
              {loading ? "Đang xử lý..." : action}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              size="lg"
              className="min-w-[100px] border-gray-300 hover:bg-gray-50">
              Hủy bỏ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
