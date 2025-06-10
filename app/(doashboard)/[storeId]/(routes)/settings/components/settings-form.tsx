/** @format */
"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash,
  Store,
  Save,
  Settings2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  PhoneCall,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { userOrigin } from "@/hooks/use-origin";
import { ApiList } from "@/components/ui/api-list";
import { SocialType, StoreInterface } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import StoresAPI from "@/app/api/stores/stores.api";
import { InputSectionWithForm } from "@/components/ui/inputSectionWithForm";
import { TextAreaSectionWithForm } from "@/components/ui/textAreaSectionWithForm";
import { ImageUploadSection } from "../../products/[slug]/components/product-image-upload";
import { SocialsSection } from "./socials-link-dropdown";
import S3CloudAPI from "@/app/api/upload/s3-cloud";

interface SettingsProps {
  initialData: StoreInterface;
}

const socialSchema = z.object({
  id: z.number().optional(),
  type: z.nativeEnum(SocialType),
  url: z.string().url(),
});
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Tên store không được để trống")
    .min(3, "Tên store phải có ít nhất 3 ký tự")
    .max(50, "Tên store không được quá 50 ký tự"),
  description: z.string().max(200, "Mô tả không được quá 200 ký tự").optional(),

  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/i, { message: "Số điện thoại không hợp lệ" })
    .optional(),
  logo: z.object({
    url: z.string(),
    file: z.instanceof(File).optional(), // <- optional ở đây
  }),

  favicon: z.object({
    url: z.string(),
    file: z.instanceof(File).optional(), // <- optional ở đây
  }),

  socials: z.array(socialSchema).optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

// Performance optimization: Memoized sub-components
const StoreStats = ({ storeName }: { storeName: string }) => {
  const stats = useMemo(
    () => [
      {
        label: "Trạng thái",
        value: "Hoạt động",
        color: "bg-green-100 text-green-800",
      },
      {
        label: "Ngày tạo",
        value: new Date().toLocaleDateString("vi-VN"),
        color: "bg-blue-100 text-blue-800",
      },
      {
        label: "Tên hiện tại",
        value: storeName,
        color: "bg-purple-100 text-purple-800",
      },
    ],
    [storeName]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className=" overflow-hidden bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {stat.value}
              </p>
            </div>
            <Badge className={stat.color} variant="secondary">
              <Store className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const DangerZone = ({
  onDelete,
  loading,
}: {
  onDelete: () => void;
  loading: boolean;
}) => (
  <Card className="border-red-200 bg-red-50/50">
    <CardHeader className="pb-3">
      <CardTitle className="text-red-800 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Vùng Nguy Hiểm
      </CardTitle>
      <CardDescription className="text-red-600">
        Hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực
        hiện.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button
        variant="destructive"
        onClick={onDelete}
        disabled={loading}
        className="w-full sm:w-auto hover:bg-red-600 transition-colors">
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Trash className="w-4 h-4 mr-2" />
        )}
        Xóa Store Vĩnh Viễn
      </Button>
    </CardContent>
  </Card>
);

export const SettingsForm: React.FC<SettingsProps> = ({ initialData }) => {
  const { storeId } = useParams();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // email: z.string().email().optional(),
  //   phone: z
  //     .string()
  //     .regex(/^0\d{9}$/i, { message: "Số điện thoại không hợp lệ" })
  //     .optional(),
  //   logo: z.string().optional(),
  //   favicon: z.string().optional(),
  //   socials: z.array(socialSchema).optional(),
  // Performance optimization: Memoized form configuration
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      socials: initialData.socials || undefined,
      logo: initialData.logo
        ? {
            file: undefined,
            url: initialData.logo,
          }
        : undefined,
      favicon: initialData.favicon
        ? {
            file: undefined,
            url: initialData.favicon,
          }
        : undefined,
    },
  });

  const {
    watch,
    formState: { errors, isDirty, isValid },
  } = form;
  const watchedValues = watch();

  // Track changes for better UX
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (storeId) {
      setIsReady(true);
    }
  }, [storeId]);
  // useEffect(() => {
  //   if (initialData) {
  //     const formData: SettingsFormValues = {
  //       ...initialData,
  //       logo: {
  //         file: undefined,
  //         url: initialData.logo ?? "",
  //       },
  //       favicon: {
  //         file: undefined,
  //         url: initialData.favicon ?? "",
  //       },
  //     };
  //     setTimeout(() => {
  //       form.reset(formData);
  //     });
  //   }
  // }, [initialData]);

  // Performance optimization: Memoized callbacks
  const onSubmit = useCallback(
    async (data: SettingsFormValues) => {
      console.log("DATA", data);
      try {
        setLoading(true);
        if (storeId) {
          const finalLogo = data.logo;
          const finalFav = data.favicon;
          if (finalLogo.file) {
            const formData = new FormData();
            formData.append("files", finalLogo.file);
            const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
            if (uploadRes.status !== 200) throw new Error("Upload thất bại");
            const { imageUrls } = uploadRes.data as { imageUrls: string[] };
            if (imageUrls.length > 0) {
              finalLogo.file = undefined;
              finalLogo.url = imageUrls[0];
            }
          }
          if (finalFav.file) {
            const formData = new FormData();
            formData.append("files", finalFav.file);
            const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
            if (uploadRes.status !== 200) throw new Error("Upload thất bại");
            const { imageUrls } = uploadRes.data as { imageUrls: string[] };
            if (imageUrls.length > 0) {
              finalFav.file = undefined;
              finalFav.url = imageUrls[0];
            }
          }
          const payload = {
            name: data.name,
            description: data.description,
            email: data.email,
            phone: data.phone,
            logo: finalLogo.url,
            favicon: finalFav.url,
            socials: data.socials?.map((social) => ({
              id: social.id ?? undefined,
              type: social.type,
              url: social.url,
              storeId: Number(storeId),
            })),
            updatedAt: new Date(),
          };
          console.log("PAYLOAD", payload);
          await StoresAPI.updateStore(storeId.toString(), payload);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);

          router.refresh();
          toast.success("Cập nhật thông tin store thành công! 🎉");

          // Reset form dirty state
          form.reset(data);
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    },
    [storeId, router, form]
  );

  const onDelete = useCallback(async () => {
    try {
      setLoading(true);
      if (storeId) {
        await StoresAPI.deleteStore(storeId.toString());

        toast.success("Xóa store thành công!");
        setOpen(false);
        router.push("/");
      }
    } catch (error) {
      toast.error(
        "Phải xóa tất cả các (Danh mục ,  Sản phẩm , Tin Tức , Banners , Socials liên kết với Store) sau đó mới xóa được "
      );
    } finally {
      setLoading(false);
    }
  }, [storeId, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <Heading
              title="Cài Đặt Store"
              description="Quản lý thông tin và cấu hình của store"
            />
          </div>
        </div>

        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Đã lưu!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Stats Overview */}
      <StoreStats storeName={initialData?.name || "Chưa đặt tên"} />

      {/* Main Settings Form */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Store className="w-5 h-5 p-2" />
            Thông Tin Store
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cơ bản của store của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputSectionWithForm
                  form={form}
                  nameFormField="name"
                  loading={loading}
                  title="Tên cửa hàng"
                  placeholder="Vui lòng nhập tên cửa hàng"
                  icon={Store}
                />
                <TextAreaSectionWithForm
                  form={form}
                  nameFormField="description"
                  loading={loading}
                  title="Mô tả Cửa Hàng"
                  placeholder="Vui lòng nhập mô tả cho cửa hàng"
                />

                {/* ImageUploadSection */}

                <InputSectionWithForm
                  form={form}
                  nameFormField="email"
                  loading={loading}
                  title="Email liên hệ của cửa hàng"
                  placeholder="Vui lòng nhập email cửa hàng"
                  icon={Mail}
                />
                <InputSectionWithForm
                  form={form}
                  nameFormField="phone"
                  loading={loading}
                  type="number"
                  title="Hotline của cửa hàng"
                  placeholder="Vui lòng nhập số hotline của cửa hàng"
                  icon={PhoneCall}
                />
                <ImageUploadSection
                  form={form}
                  nameFormField="logo"
                  loading={loading}
                  title="Logo của cửa hàng"
                  note="Kích thước nên là 200x200"
                />
                <ImageUploadSection
                  form={form}
                  nameFormField="favicon"
                  loading={loading}
                  title="Icon nhỏ của website"
                  note="Định dạng (.ico) kích thước 32x32 "
                />
                <div className="col-span-1 md:col-span-2">
                  <SocialsSection
                    form={form}
                    nameFormField="socials"
                    title="Mạng xã hội Và Sàn Thương Mại (link)"
                    loading={loading}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 justify-center">
                <Button
                  type="submit"
                  disabled={loading || !isValid || !hasChanges}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu Thay Đổi
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || !hasChanges}
                  onClick={() => form.reset()}
                  className="hover:bg-gray-50 transition-colors">
                  Hủy Bỏ
                </Button>

                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center text-amber-600 text-sm ml-auto">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Có thay đổi chưa lưu
                  </motion.div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <DangerZone onDelete={() => setOpen(true)} loading={loading} />
      </motion.div>
    </div>
  );
};
