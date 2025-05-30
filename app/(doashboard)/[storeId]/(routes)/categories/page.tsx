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
  CreateCategoryInterface,
  UpdateCategoryInterface,
} from "@/types/categories";
import toast from "react-hot-toast";

// Extended interface for tree rendering
interface CategoryWithChildren extends CategoryInterface {
  children?: CategoryWithChildren[];
}

// const initialCategories: CategoryInterface[] = [
//   {
//     id: 1,
//     name: "Electronics",
//     slug: "electronics",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Electronic gadgets",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 2,
//     name: "Clothing",
//     slug: "clothing",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Fashion items",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 3,
//     name: "Books",
//     slug: "books",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Reading materials",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 4,
//     name: "Smartphones",
//     slug: "smartphones",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Mobile phones",
//     parentId: 1,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 6,
//     name: "Men",
//     slug: "men",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Men clothing",
//     parentId: 2,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 7,
//     name: "Women",
//     slug: "women",
//     storeId: 1,
//     imageBillboard: "",
//     description: "Women clothing",
//     parentId: 2,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 10,
//     name: "T-shirts",
//     slug: "t-shirts",
//     storeId: 1,
//     imageBillboard: "",
//     description: "T-shirts for men",
//     parentId: 6,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

export default function CategoriesManagement() {
  const { storeId } = useParams();

  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageBillboard, setImageBillboard] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchCategoriesFromAPI();
    }
  }, [isMounted]);

  if (!isMounted) return null;

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
    }

    // let ss = await axios.post("http://localhost:3000/categories", category);
    // console.log("SS data", ss);
  };

  const onUpdateCategory = async (category: UpdateCategoryInterface) => {
    // TODO: Implement update API call

    const response = await CategoryAPI.updateCategory(category);
    if (response.status === 200) {
      const { message } = response.data as { message: string };
      toast.success(message);
    }
  };

  const onDeleteCategory = async (categoryId: number) => {
    // TODO: Implement delete API call
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
    //  setCategories(prev => prev.filter(category => category.id !== categoryId));
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

  // Create a new category
  const handleCreateCategory = async () => {
    if (!name || !description || !slug || !imageBillboard) {
      setAlertMessage("Tên , mô tả , slug , imageURL không được bỏ trống");
      setShowAlert(true);
      return;
    }

    const newCategory: CreateCategoryInterface = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-").trim(),
      storeId: Number(storeId),
      imageBillboard,
      description,
      parentId: parentId === "0" ? null : parentId ? Number(parentId) : null,
    };

    await onCreateCategory(newCategory);
    resetForm();
    setIsDialogOpen(false);
  };

  // Edit a category
  const handleEditCategory = (category: CategoryInterface) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setImageBillboard(category.imageBillboard);
    setParentId(category.parentId ? String(category.parentId) : "");
    setIsDialogOpen(true);
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!name || !description || !slug || !imageBillboard) {
      setAlertMessage(
        "Name, slug, imageBillboard and description are required"
      );
      setShowAlert(true);
      return;
    }

    const updatedCategories = categories.map((cat) => {
      if (cat.id === editingCategoryId) {
        return {
          ...cat,
          name,
          slug: slug.toLowerCase().replace(/\s+/g, "-").trim(),
          description,
          imageBillboard,
          parentId:
            parentId === "0" ? null : parentId ? Number(parentId) : null,
          updatedAt: new Date(),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);

    const editingCategory = updatedCategories.find(
      (cat) => cat.id === editingCategoryId
    );
    if (editingCategory) {
      await onUpdateCategory(editingCategory);
      // xử lý nếu không tìm thấy category
    }

    resetForm();
    setIsDialogOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setImageBillboard("");
    setParentId("");
    setEditingCategoryId(null);
    setShowAlert(false);
  };

  // Delete a category

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
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-500">
                  {category.description}
                </div>
                <div className="text-sm text-gray-500">{category.slug}</div>
                {category.imageBillboard && (
                  <div className="text-sm text-blue-500">
                    Billboard: {category.imageBillboard}
                  </div>
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
      <Card className="w-full">
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <div className="text-center text-xl italic font-semibold">
                    {editingCategoryId
                      ? "Chỉnh sửa danh mục"
                      : "Tạo mới danh mục"}
                  </div>
                </DialogTitle>
              </DialogHeader>

              {showAlert && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageBillboard" className="text-right">
                    Billboard
                  </Label>
                  <Input
                    id="imageBillboard"
                    value={imageBillboard}
                    onChange={(e) => setImageBillboard(e.target.value)}
                    className="col-span-3"
                    placeholder="URL hình ảnh billboard"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parent" className="text-right">
                    Danh mục
                  </Label>
                  <Select value={parentId} onValueChange={setParentId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Không (Là Danh mục Cha)</SelectItem>
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
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingCategoryId
                      ? handleUpdateCategory
                      : handleCreateCategory
                  }>
                  {editingCategoryId ? "Lưu thay đổi" : "Tạo mới"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Category Tree View */}
          <div className="mt-4">
            <div className="flex items-center mb-4">
              <FolderTree className="h-5 w-5 mr-2" />
              <h2 className="text-base font-semibold">
                Thông tin tất cả danh mục{" "}
              </h2>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              {categoryTree.length > 0 ? (
                renderCategoryTree(categoryTree)
              ) : (
                <p className="text-gray-500">
                  Chưa có danh mục nào hãy thêm 1 danh mục !!{" "}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
