/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Category as PrismaCategory, Service, Image } from "@prisma/client";

interface Category extends PrismaCategory {
  subcategories?: { id: string; name: string }[];
}
import { Trash } from "lucide-react";
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
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import EditorComponent from "@/components/editor";

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().optional(),
  images: z.object({ url: z.string() }).array(),
  description: z.string().min(1),
  slugData: z.string().min(1),
  categoryId: z.string().min(1),
  subCategoryId: z.string().optional(),
});
interface ServicesProps {
  initialData:
    | (Service & {
        category: Category;

        images: Image[];
      })
    | null;
  defaultCategoryId?: string;
}

type ProductFormValues = z.infer<typeof formSchema>;

export const ServiceForm: React.FC<ServicesProps> = ({
  initialData,
  defaultCategoryId,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ";
  const description = initialData ? "Chỉnh sửa dịch vụ" : "Tạo mới dịch vụ ";
  const toastMessage = initialData ? "Dịch vụ đã chỉnh sửa" : "Dịch vụ đã tạo";
  const action = initialData ? "Lưu thay đổi  " : "Tạo dịch vụ ";

  const [open, setOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const [loading, setLoading] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)),
          slugData: initialData.slug,
          subCategoryId: initialData.subcategoryId ?? "",
        }
      : {
          name: "",
          price: 0,
          images: [],
          description: "",
          subCategoryId: "",
          categoryId: defaultCategoryId ?? "",
          slugData: "",
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/services/${params.slug}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/services`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/services/`);
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

      await axios.delete(`/api/${params.storeId}/services/${params.slug}`);
      router.refresh();
      toast.success("Xóa Dịch vụ thành công !!");
    } catch (err) {
      toast.error(
        `Có lỗi ở đâu đó hãy xem lại !! ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  if (!isMounted) return null;
  return (
    <div className="flex flex-col gap-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          await onDelete();
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
              setOpen(false);
            }}>
            <Trash className="w-4 h-4 "></Trash>
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" w-full md:w-1/2 mx-auto">
          <div className="grid grid-cols-1 gap-8 mt-[15px] ">
            {initialData?.category?.subcategories &&
              initialData.category.subcategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục con</FormLabel>
                      <div className="relative">
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục con" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent position="popper">
                            {initialData?.category?.subcategories?.map(
                              (subcategory) => (
                                <SelectItem
                                  key={subcategory.id}
                                  value={subcategory.id}>
                                  {subcategory.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh : </FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={loading}
                      onChange={(url) => {
                        field.onChange(
                          (field.value = [...field.value, { url }])
                        );
                      }}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                      value={field.value.map(
                        (image) => image.url
                      )}></ImageUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dịch vụ </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Tên dịch vụ  "></Input>
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
                      placeholder="Slug "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả dịch vụ </FormLabel>
                  {!showEditor ? (
                    <div
                      className="border p-4 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100"
                      onClick={() => setShowEditor(true)}>
                      ✍️ Click để thêm dịch vụ
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormControl>
                        <EditorComponent
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <div className="text-right">
                        <Button
                          type="button"
                          onClick={() => setShowEditor(false)}>
                          Ẩn Text Editor
                        </Button>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá tiền dịch vụ </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        {...field}
                        placeholder="Lưu ý (Nếu dịch vụ có giá cụ thể thì nhập , không thì để trống !!!!)  "></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            disabled={loading}
            className="ml-auto mt-4 cursor-pointer"
            type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </div>
  );
};
