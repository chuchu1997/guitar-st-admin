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
import { Edit, Trash2, Plus, FolderTree } from "lucide-react";
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
    },
  });

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
    console.log("RES", response);
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
            data.parentId === "0" || !data.parentId
              ? null
              : Number(data.parentId),
          updatedAt: new Date(),
          storeId: Number(storeId),
          variant: data.variant ?? undefined,
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
            data.parentId === "0" || !data.parentId
              ? null
              : Number(data.parentId),
          variant: data.variant ?? undefined,
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
    });
    setEditingCategoryId(null);
  };

  // Auto-generate slug from name

  // Render category tree
  const renderCategoryTree = (
    categories: CategoryWithChildren[],
    depth = 0
  ) => {
    return (
      <ul className={`${depth > 0 ? "pl-6" : "pl-0"} list-none`}>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <div className="flex items-center">
              <div
                className={`flex-1 p-2 ${
                  depth > 0 ? "border-l-2 border-gray-200" : ""
                }`}>
                <div className="font-medium">
                  Tên danh mục :{" "}
                  <span className="uppercase">{`( ${category.name} )`}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Mô tả : {category.description}
                </div>
                <div className="text-sm text-gray-500">
                  Slug : {category.slug}
                </div>
                {category.variant &&
                  CategoryVariantLabels[category.variant] && (
                    <div className="text-sm text-gray-500">
                      Có biến thể : {CategoryVariantLabels[category.variant]}
                    </div>
                  )}
                {category.imageUrl && (
                  <details className="text-sm text-blue-500 cursor-pointer">
                    <summary className="text-blue-600 underline">
                      Xem link hình ảnh
                    </summary>
                    <div className="mt-1">Hình ảnh: {category.imageUrl}</div>
                  </details>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}>
                  <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                </Button>
                <Button
                  variant="outline"
                  disabled={category.children && category.children.length > 0}
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")
                    ) {
                      onDeleteCategory(category.id);
                    }
                  }}>
                  <Trash2 className="h-4 w-4 mr-1" /> Xóa
                </Button>
              </div>
            </div>
            {category.children &&
              category.children.length > 0 &&
              renderCategoryTree(category.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quản lý danh mục</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                <Plus className="h-4 w-4 mr-1" /> Thêm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-scroll ">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>
                  <div className="text-center text-xl italic font-semibold">
                    {editingCategoryId
                      ? "Chỉnh sửa danh mục"
                      : "Tạo mới danh mục"}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-1">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <InputSectionWithForm
                      form={form}
                      nameFormField="name"
                      loading={false}
                      title={"Tên danh mục"}
                      placeholder={"Vui lòng nhập tên danh mục"}
                    />

                    <InputSectionWithForm
                      form={form}
                      nameFormField="slug"
                      loading={false}
                      title={"Vui lòng nhập slug"}
                      placeholder={"Vui lòng nhập slug"}
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
                          <FormLabel>Biến thể</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục cha" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CategoryVariant).map((variant) => (
                                <SelectItem key={variant} value={variant}>
                                  {CategoryVariantLabels[variant]}
                                </SelectItem>
                              ))}
                              {/* <SelectItem value="0">
                                Không (Là Danh mục Cha)
                              </SelectItem>
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.id.toString()}
                                  disabled={editingCategoryId === cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))} */}
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
                          <FormLabel>Danh mục cha</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục cha" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">
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

                    <DialogFooter className="flex-shrink-0 pt-6 mt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm();
                          setIsDialogOpen(false);
                        }}>
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}>
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
        </CardHeader>
        <CardContent>
          {/* Category Tree View */}
          <div className="mt-4">
            <div className="flex items-center mb-4">
              <FolderTree className="h-5 w-5 mr-2" />
              <h2 className="text-base font-semibold">
                Thông tin tất cả danh mục
              </h2>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              {categoryTree.length > 0 ? (
                renderCategoryTree(categoryTree)
              ) : (
                <p className="text-gray-500">
                  Chưa có danh mục nào hãy thêm 1 danh mục !!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
