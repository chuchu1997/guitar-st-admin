/** @format */

// categories-management.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Trash2, Plus, FolderTree, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import CategoryAPI from "@/app/api/categories/categories.api";
import { useParams } from "next/navigation";
import {
  CategoryInterface,
  CategoryVariant,
  CreateCategoryInterface,
  UpdateCategoryInterface,
} from "@/types/categories";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import S3CloudAPI from "@/app/api/upload/s3-cloud";
import { InputSectionWithForm } from "@/components/ui/inputSectionWithForm";
import { ImageUploadSection } from "../products/[slug]/components/product-image-upload";
import { TextAreaSectionWithForm } from "@/components/ui/textAreaSectionWithForm";
import { seoSchemaZod } from "@/schemas/seoSchema";
import SEOForm from "@/components/seo/seo";

const formSchema = z.object({
  name: z.string().min(3, "Vui lòng nhập tên của danh mục"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug chỉ được chứa chữ thường, số và dấu gạch ngang (không có khoảng trắng hoặc ký tự đặc biệt)",
    })
    .transform((val) =>
      val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    ),
  imageUrl: z
    .object({
      url: z.string().min(1, "Vui lòng chọn ảnh."),
      file: z.instanceof(File).optional(),
    })
    .refine((val) => !!val.url, {
      message: "Vui lòng chọn ảnh.",
    }),
  parentId: z.string().optional(),
  variant: z.nativeEnum(CategoryVariant).optional(),
  description: z.string().min(3, "Vui lòng nhập mô tả của danh mục"),
  seo: seoSchemaZod.optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryWithChildren extends CategoryInterface {
  children?: CategoryWithChildren[];
}

export default function CategoriesManagement() {
  const { storeId } = useParams();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
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

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchCategoriesFromAPI();
    }
  }, [isMounted]);

  if (!isMounted) return null;

  const CategoryVariantLabels: Record<CategoryVariant, string> = {
    [CategoryVariant.NEWS]: "Tin tức",
    [CategoryVariant.COURSES]: "Khóa học",
    [CategoryVariant.SERVICES]: "Dịch vụ",
    [CategoryVariant.PROMOTION]: "Khuyến mãi",
    [CategoryVariant.CONTACT]: "Liên hệ",
  };

  const fetchCategoriesFromAPI = async () => {
    let response = await CategoryAPI.getCategoriesRelateWithStoreID({
      justGetParent: false,
      storeID: Number(storeId),
    });
    if (response.status === 200) {
      const { categories } = response.data as {
        categories: CategoryInterface[];
      };
      setCategories(categories);
    }
  };

  const onCreateCategory = async (category: CreateCategoryInterface) => {
    let response = await CategoryAPI.createCategory(category);
    if (response.status === 200) {
      const { category, message } = response.data as {
        message: string;
        category: CategoryInterface;
      };
      toast.success(message);
      setCategories([...categories, category]);
      await fetchCategoriesFromAPI(); // Refresh the list
    }
  };

  const onUpdateCategory = async (
    id: number,
    category: UpdateCategoryInterface
  ) => {
    const response = await CategoryAPI.updateCategory(id, category);
    if (response.status === 200) {
      const { message } = response.data as { message: string };
      toast.success(message);
      await fetchCategoriesFromAPI(); // Refresh the list
    }
  };

  const onDeleteCategory = async (categoryId: number) => {
    try {
      const response = await CategoryAPI.deleteCategoryFromID(
        categoryId,
        Number(storeId)
      );
      if (response.status === 200) {
        const { message } = response.data as {
          message: string;
          category: CategoryInterface;
        };
        toast.success(message);

        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryId)
        );
      }
    } catch (err) {
      toast.error(
        "Phải xóa các sản phẩm liên kết với danh mục này trước khi xóa "
      );
    }
  };

  // Build category tree
  const buildCategoryTree = (
    items: CategoryInterface[],
    parentId: number | null = null
  ): CategoryWithChildren[] => {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: buildCategoryTree(items, item.id),
      }));
  };

  const categoryTree = buildCategoryTree(categories);

  // Handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      let finalImage = data.imageUrl;
      if (data.imageUrl.file) {
        const formData = new FormData();
        formData.append("files", data.imageUrl.file);
        const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
        if (uploadRes.status !== 200) throw new Error("Upload thất bại");
        const { imageUrls } = uploadRes.data as { imageUrls: string[] };
        if (imageUrls.length > 0) {
          finalImage.file = undefined;
          finalImage.url = imageUrls[0];
        }
      }
      if (editingCategoryId) {
        // Update existing category
        const updateData: UpdateCategoryInterface = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          imageUrl: finalImage.url,
          parentId:
            data.parentId === "null" || !data.parentId
              ? null
              : Number(data.parentId),
          updatedAt: new Date(),
          storeId: Number(storeId),
          variant: data.variant ?? undefined,
          seo: data.seo,
        };

        await onUpdateCategory(editingCategoryId, updateData);
      } else {
        // Create new category
        const newCategory: CreateCategoryInterface = {
          name: data.name,
          slug: data.slug,
          storeId: Number(storeId),
          imageUrl: finalImage.url,
          description: data.description,
          parentId:
            data.parentId === "null" || !data.parentId
              ? null
              : Number(data.parentId),
          variant: data.variant ?? undefined,
          seo: data.seo,
        };

        await onCreateCategory(newCategory);
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Có lỗi xảy ra khi xử lý form");
    }
  };

  // Edit a category
  const handleEditCategory = (category: CategoryInterface) => {
    setEditingCategoryId(category.id);

    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: {
        file: undefined,
        url: category.imageUrl,
      },
      parentId: category.parentId ? String(category.parentId) : "",
      variant: category.variant ?? undefined,
      seo: category.seo ?? {
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
    });
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    form.reset({
      name: "",
      slug: "",
      description: "",
      imageUrl: undefined,
      parentId: "",
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
    });
    setEditingCategoryId(null);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Render category tree with improved mobile design
  const renderCategoryTree = (
    categories: CategoryWithChildren[],
    depth = 0
  ) => {
    return (
      <div className={`${depth > 0 ? "ml-4 sm:ml-6" : ""} space-y-2`}>
        {categories.map((category) => (
          <div key={category.id} className="group">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            depth === 0
                              ? "bg-blue-500"
                              : depth === 1
                              ? "bg-green-500"
                              : "bg-purple-500"
                          }`}></div>
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">
                          {depth === 0 ? "Danh mục chính" : `Cấp ${depth + 1}`}
                        </span>
                      </div>
                      {category.children && category.children.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpansion(category.id)}
                          className="p-1 h-6 w-6 hover:bg-gray-100 rounded-full">
                          {expandedCategories.has(category.id) ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                      {category.name}
                    </h3>

                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        <span className="font-medium">Mô tả:</span>
                        <span className="break-words">
                          {category.description}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <span className="font-medium">Slug:</span>
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                          {category.slug}
                        </code>
                      </div>

                      {category.variant &&
                        CategoryVariantLabels[category.variant] && (
                          <div className="flex flex-wrap gap-1">
                            <span className="font-medium">Biến thể:</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {CategoryVariantLabels[category.variant]}
                            </span>
                          </div>
                        )}

                      {category.imageUrl && (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800 underline font-medium">
                            Xem hình ảnh
                          </summary>
                          <div className="mt-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                            <p className="text-xs break-all">
                              {category.imageUrl}
                            </p>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col sm:w-auto w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 sm:flex-none hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm">Sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        category.children && category.children.length > 0
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn xóa danh mục này?"
                          )
                        ) {
                          onDeleteCategory(category.id);
                        }
                      }}
                      className="flex-1 sm:flex-none hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50">
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="text-xs sm:text-sm">Xóa</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {category.children &&
              category.children.length > 0 &&
              expandedCategories.has(category.id) && (
                <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                  {renderCategoryTree(category.children, depth + 1)}
                </div>
              )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-3 sm:p-4 lg:p-6">
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm m-0 p-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg py-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FolderTree className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold">
                    Quản lý danh mục
                  </CardTitle>
                  <p className="text-sm text-white/80 mt-1">
                    Tổng: {categories.length} danh mục
                  </p>
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(true);
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Thêm mới</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full max-w-2xl">
                  <DialogHeader className="flex-shrink-0 pb-4 border-b">
                    <DialogTitle className="text-center text-lg sm:text-xl font-bold text-gray-800">
                      {editingCategoryId
                        ? "Chỉnh sửa danh mục"
                        : "Tạo mới danh mục"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto px-1 py-4">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 sm:space-y-6">
                        <InputSectionWithForm
                          form={form}
                          nameFormField="name"
                          loading={false}
                          title="Tên danh mục"
                          placeholder="Vui lòng nhập tên danh mục"
                        />

                        <InputSectionWithForm
                          form={form}
                          nameFormField="slug"
                          loading={false}
                          title="Slug"
                          placeholder="Vui lòng nhập slug"
                        />

                        <ImageUploadSection
                          form={form}
                          loading={false}
                          nameFormField="imageUrl"
                        />

                        <FormField
                          control={form.control}
                          name="variant"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base font-medium">
                                Biến thể
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 sm:h-11">
                                    <SelectValue placeholder="Chọn biến thể nếu có" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(CategoryVariant).map(
                                    (variant) => (
                                      <SelectItem key={variant} value={variant}>
                                        {CategoryVariantLabels[variant]}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base font-medium">
                                Danh mục cha
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 sm:h-11">
                                    <SelectValue placeholder="Chọn danh mục cha" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="null">
                                    Không (Là Danh mục Cha)
                                  </SelectItem>
                                  {categories.map((cat) => (
                                    <SelectItem
                                      key={cat.id}
                                      value={cat.id.toString()}
                                      disabled={editingCategoryId === cat.id}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <TextAreaSectionWithForm
                          form={form}
                          loading={false}
                          nameFormField="description"
                          title="Mô tả"
                          placeholder="Vui lòng nhập mô tả danh mục"
                        />

                        <SEOForm form={form} loading={false} />

                        <DialogFooter className="flex-shrink-0 pt-6 mt-6 border-t flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetForm();
                              setIsDialogOpen(false);
                            }}
                            className="w-full sm:w-auto order-2 sm:order-1">
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {form.formState.isSubmitting
                              ? "Đang xử lý..."
                              : editingCategoryId
                              ? "Lưu thay đổi"
                              : "Tạo mới"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FolderTree className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                    Danh sách danh mục
                  </h2>
                  <p className="text-sm text-gray-600">
                    Quản lý tất cả danh mục của cửa hàng
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {categoryTree.length > 0 ? (
                  <div className="p-4">{renderCategoryTree(categoryTree)}</div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FolderTree className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Chưa có danh mục nào
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Hãy thêm danh mục đầu tiên của bạn
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
