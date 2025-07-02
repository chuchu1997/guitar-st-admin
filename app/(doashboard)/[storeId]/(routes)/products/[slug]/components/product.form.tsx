/** @format */

"use client";
import { Form } from "@/components/ui/form";
import {
  ImageInterface,
  ProductColorInterface,
  ProductInterface,
  ProductSizeInterface,
} from "@/types/product";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUploadSection } from "./product-image-upload";
import { BasicInfoSection } from "./product-basic-info";
import toast from "react-hot-toast";
import CategoryAPI from "@/app/api/categories/categories.api";
import { redirect, useParams } from "next/navigation";
import { CategoryInterface } from "@/types/categories";
import router from "next/router";
import { DescriptionSection } from "./product-description";
import { VariantSelector } from "./product-variant-selector";
import { Palette, Ruler } from "lucide-react";
import { SettingsSection } from "./product-setting";
import { Button } from "@/components/ui/button";
import ProductAPI from "@/app/api/products/products.api";
import S3CloudAPI from "@/app/api/upload/s3-cloud";
import { GiftProductSelector } from "./product-gifts";
import { useRouter } from "next/navigation"; // ✅ cho App Router
import { seoSchemaZod } from "@/schemas/seoSchema";
import SEOForm from "@/components/seo/seo";

export const giftSchema = z.object({
  id: z.number(),
  slug: z.string().optional(),
});

export type GiftProduct = z.infer<typeof giftSchema>;

const formSchema = z.object({
  id: z.number().optional(), //
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  originalPrice: z.coerce.number().optional(),
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
  shortDescription: z.string().min(1, "Mô tả ngắn là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  sku: z.string().min(1, "SKU là bắt buộc"),
  stock: z.coerce.number().min(0, "Số lượng không được âm"),
  // Required colors selection
  viewCount: z.coerce.number().default(0).optional(),
  ratingCount: z.coerce.number().default(5).optional(),
  giftProducts: z.array(giftSchema).optional(),
  seo: seoSchemaZod.optional(),
});
interface ProductProps {
  initialData: (ProductInterface & {}) | null;
}
type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
  const { storeId } = useParams();
  const [mounted, setIsMounted] = useState(false);
  const router = useRouter();

  const action = initialData ? "Cập nhật sản phẩm" : "Tạo sản phẩm";
  // const formData: ProductFormValues = {
  //       ...initialData,
  //       id: initialData.id ?? null,
  //       // const currentProductID = initialData?.id ?? null;

  //       originalPrice: initialData.originalPrice ?? 0,
  //       categoryId: initialData.categoryId.toString(),
  //     };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      originalPrice: 0,
      price: 0,
      images: [],
      isFeatured: false,
      description: "",
      slug: "",
      sku: "",
      stock: 0,
      viewCount: 0,
      ratingCount: 5,
      giftProducts: [],
      seo: {
        title: "",
        description: "",
        keywords: "",
        slug: "",
        canonicalUrl: "",
        altText: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      },
    },
  });

  const [selectedColors, setSelectedColors] = useState<ProductColorInterface[]>(
    []
  );
  const [selectedSizes, setSelectedSizes] = useState<ProductSizeInterface[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(false);

  type TempProductVariantColor = Omit<ProductColorInterface, "id"> & {
    id?: number; // có thể có hoặc không
    _temp?: boolean; // đánh dấu là màu tạm
  };

  type TempProductVariantSize = Omit<ProductSizeInterface, "id"> & {
    id?: number; // có thể có hoặc không
    _temp?: boolean; // đánh dấu là màu tạm
  };
  const handleAddColor = useCallback((newVariant: TempProductVariantColor) => {
    const variant: ProductColorInterface = {
      ...(newVariant as ProductColorInterface),
      id: newVariant.id ?? Number(Date.now()),
    };

    setSelectedColors((prev) => [...prev, variant]);
  }, []);
  const handleAddSize = useCallback((newVariant: TempProductVariantSize) => {
    const variant: ProductSizeInterface = {
      ...(newVariant as ProductSizeInterface),
      id: newVariant.id ?? Number(Date.now()),
    };
    setSelectedSizes((prev) => [...prev, variant]);
  }, []);

  const handleUpdateColor = useCallback(
    (id: number, updates: Partial<ProductColorInterface>) => {
      setSelectedColors((prev) =>
        prev.map((variant) =>
          variant.id === id ? { ...variant, ...updates } : variant
        )
      );
    },
    []
  );
  const handleUpdateSize = useCallback(
    (id: number, updates: Partial<ProductSizeInterface>) => {
      setSelectedSizes((prev) =>
        prev.map((variant) =>
          variant.id === id ? { ...variant, ...updates } : variant
        )
      );
    },
    []
  );
  const handleRemoveColor = useCallback((id: number) => {
    setSelectedColors((prev) => prev.filter((c) => c.id !== id));
  }, []);
  const handleRemoveSize = useCallback((id: number) => {
    setSelectedSizes((prev) => prev.filter((c) => c.id !== id));
  }, []);
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      // Upload ảnh lên S3

      const oldImages = data.images.filter((img) => !img.file); // Ảnh cũ (chỉ có url)
      const newImages = data.images.filter((img) => img.file); // Ảnh mới (có file cần upload)
      let finalImageUrls: ImageInterface[] = [...oldImages]; // Bắt đầu từ ảnh cũ
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img) => {
          if (img.file) {
            formData.append("files", img.file);
          }
        });

        const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
        if (uploadRes.status !== 200) throw new Error("Upload thất bại");

        const { imageUrls } = uploadRes.data as { imageUrls: [] };
        const uploadedImageUrls: ImageInterface[] = imageUrls.map((img) => ({
          url: img,
          file: undefined,
        }));

        //Ghép ảnh mới vào danh sách cuối cùng
        finalImageUrls = [...oldImages, ...uploadedImageUrls];
      }

      const {
        giftProducts,
        name,
        description,
        price,
        originalPrice,
        isFeatured = false,
        slug,
        stock,
        sku,
        categoryId,
        shortDescription,
        seo,
      } = data;

      const cleanedColors = selectedColors.map((color) => {
        const tempColor = color as ProductColorInterface & { _temp?: boolean };
        if (tempColor._temp) {
          const { id, _temp, ...rest } = tempColor;
          return { ...rest };
        }
        return { ...color };
      });
      const cleanedSizes = selectedSizes.map((size) => {
        const tempSize = size as ProductSizeInterface & { _temp?: boolean };
        if (tempSize._temp) {
          const { id, _temp, ...rest } = tempSize;
          return { ...rest };
        }
        return { ...size };
      });

      const payload = {
        name,
        shortDescription,
        description,
        price,
        isFeatured,
        originalPrice,
        giftProducts,
        slug,
        stock,
        sku,
        seo,
        categoryId: Number(categoryId),
        storeId: Number(storeId),
        images: finalImageUrls,
        colors: cleanedColors, // 👈 cleaned colors
        sizes: cleanedSizes, // 👈 cleaned sizes
      };

      const res = initialData
        ? await ProductAPI.updateProduct(initialData.id, {
            ...payload,
            updatedAt: new Date(),
          })
        : await ProductAPI.createProduct(payload);

      if (res.status === 200) {
        const { message } = res.data as { message: string };
        toast.success(message);
      }
    } catch (err) {
      toast.error(`Có lỗi xảy ra, vui lòng thử lại! ${err}`);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined") {
        router.push(`/${storeId}/products`);
      }
    }
  };
  useEffect(() => {
    // Ví dụ: kiểm tra lỗi cụ thể
    console.log("FORM ERROR", form.formState.errors);
  }, [form.formState.errors]);
  useEffect(() => {
    setIsMounted(true);
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
          window.location.href = `/${storeId}/categories`;

          // router.push(`/${storeId}/categories`);
        }, 1500);
        return; // thoát sớm nếu không có danh mục
      }
      // Reset form sau khi có danh sách danh mục
      if (initialData) {
        const formattedData: ProductFormValues = {
          ...initialData,
          seo: initialData.seo ?? {
            title: "",
            description: "",
            keywords: "",
            slug: "",
            canonicalUrl: "",
            altText: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
          },
          categoryId: initialData.categoryId.toString(),
          originalPrice: initialData.originalPrice ?? 0,
        };

        if (initialData.colors?.length > 0) {
          setSelectedColors(initialData.colors);
        }

        if (initialData.sizes?.length > 0) {
          setSelectedSizes(initialData.sizes);
        }

        form.reset(formattedData); // ✅ reset sau khi có data
        if (initialData.colors.length > 0) {
          setSelectedColors(initialData.colors);
        }
        if (initialData.sizes.length > 0) {
          setSelectedSizes(initialData.sizes);
        }
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh mục, vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <>... Đang tải </>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {action} Sản Phẩm
        </h1>
        <p className="text-gray-600">
          Điền thông tin chi tiết để tạo sản phẩm mới
        </p>

        {initialData && (
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <p className="text-sm text-gray-600">
              Sản phẩm hiện tại: <strong>{initialData.name}</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">ID: {initialData.id}</p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ImageUploadSection
            form={form}
            loading={loading}
            isMultiple
            note="Kích thước 1000x1000"
          />

          <BasicInfoSection
            form={form}
            loading={loading}
            categories={categories}
          />

          <DescriptionSection form={form} loading={loading} />
          <VariantSelector
            loading={loading}
            type="color"
            title="Màu sắc"
            icon={<Palette className="w-4 h-4" />}
            selectedVariants={selectedColors}
            onRemoveVariant={handleRemoveColor}
            onAddVariant={(newColorObject) => {
              let newColorInstance = newColorObject as ProductColorInterface;
              handleAddColor({
                hex: newColorInstance.hex, // default hoặc từ UI
                name: newColorInstance.name,
                stock: newColorInstance.stock,
                price: newColorInstance.price,
                _temp: true,
              });
            }}
            onUpdateVariant={handleUpdateColor}
          />
          <VariantSelector
            loading={loading}
            type="size"
            title="Kích thước sản phẩm (Tùy chọn)"
            icon={<Ruler className="w-5 h-5 text-orange-600" />}
            selectedVariants={selectedSizes}
            onRemoveVariant={handleRemoveSize}
            onAddVariant={(newSizeObject) => {
              let newSizeInstance = newSizeObject as ProductSizeInterface;
              handleAddSize({
                name: newSizeInstance.name,
                stock: newSizeInstance.stock,
                price: newSizeInstance.price,
                _temp: true,
              });
            }}
            onUpdateVariant={handleUpdateSize}
          />
          <GiftProductSelector
            form={form}
            loading={loading}
            initValue={initialData?.giftProducts ?? []}
          />

          <SettingsSection form={form} loading={loading} />

          <SEOForm form={form} loading={loading} />

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
