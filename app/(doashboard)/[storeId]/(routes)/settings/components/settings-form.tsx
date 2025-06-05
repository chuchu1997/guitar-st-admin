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
import { StoreInterface } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import StoresAPI from "@/app/api/stores/stores.api";

interface SettingsProps {
  initialData: StoreInterface;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Tên store không được để trống")
    .min(3, "Tên store phải có ít nhất 3 ký tự")
    .max(50, "Tên store không được quá 50 ký tự"),
  description: z.string().max(200, "Mô tả không được quá 200 ký tự").optional(),
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

  // Performance optimization: Memoized form configuration
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
    mode: "onChange",
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

  // Performance optimization: Memoized callbacks
  const onSubmit = useCallback(
    async (data: SettingsFormValues) => {
      console.log("DATA", data);
      try {
        setLoading(true);
        if (storeId) {
          await StoresAPI.updateStore(storeId.toString(), {
            name: data.name,
            description: data.description,
            updatedAt: new Date(),
          });
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
      console.error("Delete error:", error);
      toast.error(
        "Phải xóa tất cả các (Danh mục và Sản phẩm liên kết với Store) sau đó mới xóa được "
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Tên Store *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="Nhập tên store của bạn..."
                            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                          <Store className="absolute left-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Tên này sẽ hiển thị cho khách hàng của bạn
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Mô Tả Store
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={loading}
                          placeholder="Mô tả ngắn gọn về store của bạn..."
                          className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Tối đa 200 ký tự
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
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
