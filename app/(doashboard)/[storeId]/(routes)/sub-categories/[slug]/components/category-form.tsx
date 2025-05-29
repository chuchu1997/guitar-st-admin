/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard, Subcategory, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

interface CategoryProps {
  initialData: Subcategory | null;
  billboards: Billboard[];
  parentCategories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
  parentCategoryId: z.string().min(1),
  slugData: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryProps> = ({
  initialData,
  parentCategories,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Sub Category" : "Create Sub Category";
  const description = initialData
    ? "Edit a Sub Category"
    : "Add a new Sub Category";
  const toastMessage = initialData
    ? "Sub Category Update"
    : "Sub Category created";
  const action = initialData ? "Save change " : "Create Sub Category";

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          billboardId: initialData.billboardId,
          slugData: initialData.slug, // Map `slug` → `slugData`
          parentCategoryId: initialData.categoryId,
        }
      : {
          name: "",
          billboardId: "",
          slugData: "",
          parentCategoryId: "",
        },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sub-categories/${params.slug}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sub-categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sub-categories/`);
      toast.success(toastMessage);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      toast.error("Something when wrong !!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/sub-categories/${params.slug}`
      );
      router.refresh();
      toast.success("Xóa Sub Category thành công !!");
    } catch (err) {
      toast.error(
        `Make sure you removed all products using this category first !! ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          await onDelete();
          setOpen(false);
        }}
      />
      <div className="flex items-center justify-between my-4">
        <Heading title={title} description={description} />
        {/* BUTTON DELETE JUST WORKING ON EDIT MODE  */}
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={async () => {
              setOpen(true);
            }}>
            <Trash className="w-4 h-4 "></Trash>
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
          <div className="grid grid-cols-3 gap-8 mt-[15px]">
            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn 1 Category Cha: </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Chọn 1 Category Cha "
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {parentCategories.map((parentCategory) => (
                        <SelectItem
                          key={parentCategory.id}
                          value={parentCategory.id}>
                          {parentCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Category Label  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slugData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      pattern="\S*"
                      disabled={loading}
                      {...field}
                      placeholder="Slug Label  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto mt-4" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </div>
  );
};
