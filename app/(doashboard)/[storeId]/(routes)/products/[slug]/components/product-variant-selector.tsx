/** @format */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Plus, X, Palette, Ruler } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductColorInterface, ProductSizeInterface } from "@/types/product";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumericFormat } from "react-number-format";

export type Variant = ProductColorInterface | ProductSizeInterface;

// Type guards
const isColorVariant = (variant: Variant): variant is ProductColorInterface => {
  return "hex" in variant;
};

interface VariantSelectorProps {
  loading: boolean;
  type: "color" | "size";
  title: string;
  icon: React.ReactNode;
  selectedVariants: Variant[];
  onRemoveVariant: (id: number) => void;
  onAddVariant: (variant: Omit<Variant, "id">) => void;
  onUpdateVariant: (id: number, updates: Partial<Variant>) => void;
}

// Schemas
const baseVariantSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  price: z.number().min(0, "Giá phải >= 0"),
  stock: z.number().min(0, "Số lượng phải >= 0"),
});

const colorVariantSchema = baseVariantSchema.extend({
  hex: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Mã màu HEX không hợp lệ"),
});

const sizeVariantSchema = baseVariantSchema;

// Type for form data
type ColorFormData = z.infer<typeof colorVariantSchema>;
type SizeFormData = z.infer<typeof sizeVariantSchema>;
type FormData = ColorFormData | SizeFormData;

// Optimized VariantSelector Component
export const VariantSelector: React.FC<VariantSelectorProps> = ({
  loading,
  type,
  title,
  icon,

  selectedVariants,

  onRemoveVariant,
  onAddVariant,
  onUpdateVariant,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form schema and form based on type
  const formSchema = useMemo(
    () => (type === "color" ? colorVariantSchema : sizeVariantSchema),
    [type]
  );

  // Form for adding new variants with proper typing
  const addForm = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "color"
        ? { name: "", price: 0, stock: 10, hex: "#000000" }
        : { name: "", price: 0, stock: 10 },
  });

  // Memoized selected variant IDs for performance
  const selectedVariantIds = useMemo(
    () => new Set(selectedVariants.map((v) => v.id)),
    [selectedVariants]
  );

  // Callbacks for better performance

  const handleRemoveVariant = useCallback(
    (id: number) => {
      onRemoveVariant(id);
    },
    [onRemoveVariant]
  );

  const handleAddVariant = useCallback(
    async (data: FormData) => {
      try {
        onAddVariant(data);
        addForm.reset();
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error adding variant:", error);
      }
    },
    [onAddVariant, addForm]
  );

  const handleUpdateVariant = useCallback(
    (id: number, field: string, value: any) => {
      const updates = { [field]: value };
      onUpdateVariant(id, updates);
    },
    [onUpdateVariant]
  );

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return (
    <>
      <Card className="w-full shadow-md ">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                {icon}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedVariants.length} đã chọn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                disabled={loading}
                className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm mới
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 ">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Biến thể đã chọn
              </h4>
              {selectedVariants.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedVariants.length} biến thể
                </Badge>
              )}
            </div>

            {selectedVariants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                  {type === "color" ? (
                    <Palette className="w-6 h-6" />
                  ) : (
                    <Ruler className="w-6 h-6" />
                  )}
                </div>
                <p className="text-sm">Chưa có biến thể nào được chọn</p>
                <p className="text-xs mt-1">Chọn từ danh sách hoặc tạo mới</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedVariants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      {/* Variant Info */}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-medium">
                          {variant.name}
                        </Badge>
                        {type === "color" && isColorVariant(variant) && (
                          <div
                            className="w-5 h-5 rounded-full border-2 border-border"
                            style={{ backgroundColor: variant.hex }}
                          />
                        )}
                      </div>

                      {/* Price Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Giá (VND)
                        </label>
                        <NumericFormat
                          thousandSeparator="."
                          decimalSeparator=","
                          suffix=" ₫"
                          allowNegative={false}
                          placeholder="299.000 ₫"
                          disabled={loading}
                          customInput={Input}
                          className="focus:ring-2 focus:ring-blue-500"
                          value={variant.price}
                          onValueChange={(priceValue) => {
                            handleUpdateVariant(
                              variant.id ?? 0,
                              "price",
                              priceValue.floatValue
                            );
                          }}
                        />
                      </div>

                      {/* Stock Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Số lượng
                        </label>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleUpdateVariant(
                              variant.id ?? 0,
                              "stock",
                              Number(e.target.value)
                            )
                          }
                          disabled={loading}
                          className="h-9 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(variant.id ?? 0)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Variant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon}
              Thêm mới {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên biến thể *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder={`Tên ${title.toLowerCase()}`}
                      />
                    </FormControl>
                    {addForm.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {(addForm.formState.errors as any).name?.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VND ) *</FormLabel>
                      <FormControl>
                        <NumericFormat
                          thousandSeparator="."
                          decimalSeparator=","
                          suffix=" ₫"
                          allowNegative={false}
                          placeholder="299.000 ₫"
                          disabled={loading}
                          customInput={Input}
                          className="focus:ring-2 focus:ring-blue-500"
                          value={field.value}
                          onValueChange={(priceValue) => {
                            field.onChange(priceValue.floatValue);
                          }}
                        />
                      </FormControl>
                      {addForm.formState.errors.price && (
                        <p className="text-xs text-destructive">
                          {(addForm.formState.errors as any).price?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-9 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          disabled={loading}
                          placeholder="0"
                          min="10"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      {addForm.formState.errors.stock && (
                        <p className="text-xs text-destructive">
                          {(addForm.formState.errors as any).stock?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {type === "color" && (
                <FormField
                  control={addForm.control}
                  name={"hex" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã màu HEX *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="#000000"
                            className="flex-1"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <div
                                className="w-10 h-10 rounded border border-border cursor-pointer"
                                style={{
                                  backgroundColor: field.value || "#000000",
                                }}
                                title="Chọn màu"
                              />
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-2">
                              <HexColorPicker
                                color={field.value || "#000000"}
                                onChange={(color) => field.onChange(color)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      {addForm.formState.errors.hex && (
                        <p className="text-xs text-destructive">
                          {(addForm.formState.errors as any).hex?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}>
                Hủy
              </Button>
              <Button
                type="button"
                onClick={addForm.handleSubmit(handleAddVariant)}
                disabled={loading}
                className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm biến thể
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
