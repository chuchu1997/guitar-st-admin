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

// Define types
export interface Category {
  id?: number;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
}

// Mock data to simulate API calls
// const initialCategories: Category[] = [
//   {
//     id: 1,
//     name: "Electronics",
//     slug: "electronics",
//     description: "Electronic gadgets",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 2,
//     name: "Clothing",
//     slug: "clothing",
//     description: "Fashion items",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 3,
//     name: "Books",
//     slug: "books",
//     description: "Reading materials",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 4,
//     name: "Smartphones",
//     slug: "smartphones",
//     description: "Mobile phones",
//     parentId: 1,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 6,
//     name: "Men",
//     slug: "men",
//     description: "Men clothing",
//     parentId: 2,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 7,
//     name: "Women",
//     slug: "women",
//     description: "Women clothing",
//     parentId: 2,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: 10,
//     name: "T-shirts",
//     slug: "t-shirts",
//     description: "T-shirts for men",
//     parentId: 6,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  // const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
    setCategories([]);
    const response = await axios.get("http://localhost:3000/categories", {
      params: {
        justGetParent: true,
      },
    }); // Replace with your API endpoint
    console.log("RESPOJNMSE", response);
    if (response.status === 200) {
      const data = await response.data;

      setCategories(data);
    } else {
      console.error("Failed to fetch categories");
    }
  };
  const onCreateCategory = async (category: Category) => {
    let ss = await axios.post("http://localhost:3000/categories", category);
    console.log("SS data", ss);
  };
  const onUpdateCategory = async (category: Category) => {};
  const onDeleteCategory = async (categoryId: number) => {};

  // Build category tree
  const buildCategoryTree = (
    items: Category[],
    parentId: number | null = null
  ): Category[] => {
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
    if (!name || !description || !slug) {
      setAlertMessage("Name and description are required");
      setShowAlert(true);
      return;
    }

    const newCategory: Category = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-").trim(), // Sửa lại đúng cú pháp

      description,
      parentId: parentId === "0" ? null : parentId ? Number(parentId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await onCreateCategory(newCategory);

    // setCategories([...categories, newCategory]);
    resetForm();
    setIsDialogOpen(false);
  };

  // Edit a category
  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id ?? 0);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setParentId(category.parentId ? String(category.parentId) : "");
    setIsDialogOpen(true);
  };

  // Update category
  const handleUpdateCategory = () => {
    if (!name || !description || !slug) {
      setAlertMessage("Name ,Slug,  description are required");
      setShowAlert(true);
      return;
    }

    const updatedCategories = categories.map((cat) => {
      if (cat.id === editingCategoryId) {
        return {
          ...cat,
          name,
          slug: slug.toLowerCase().replace(/\s+/g, "-").trim(), // Sửa lại đúng cú pháp
          description,
          parentId:
            parentId === "0" ? null : parentId ? Number(parentId) : null,
          updatedAt: new Date(),
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    resetForm();
    setIsDialogOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setParentId("");
    setEditingCategoryId(null);
    setShowAlert(false);
  };

  // Delete a category
  const handleDeleteCategory = (categoryId: number) => {
    // Check if category has subcategories
    const hasSubcategories = categories.some(
      (cat) => cat.parentId === categoryId
    );

    if (hasSubcategories) {
      setAlertMessage(
        "Cannot delete a category that has subcategories. Delete the subcategories first."
      );
      setShowAlert(true);
      return;
    }

    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
  };

  // Render category tree
  const renderCategoryTree = (categories: Category[], depth = 0) => {
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
                  onClick={() => handleDeleteCategory(category.id ?? 0)}>
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
                          value={cat.id!.toString()}
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
