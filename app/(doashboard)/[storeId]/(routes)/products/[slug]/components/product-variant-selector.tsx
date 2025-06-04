"use client";

import { useState } from "react";
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
import { Dialog ,DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger, } from "@/components/ui/dialog";
import { Check, Plus, X } from "lucide-react";

interface VariantSelectorProps {
  form: any;
  loading: boolean;
  type: "color" | "size";
  title: string;
  icon: React.ReactNode;
  options: any[];
  selectedVariants: any[];
  onToggleVariant: (id: string) => void;
  onRemoveVariant: (id: string) => void;
  onAddVariant: (variant: {
    name: string;
    price: number;
    hex?: string;
    stock: number;
  }) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  form,
  loading,
  type,
  title,
  icon,
  options,
  selectedVariants,
  onToggleVariant,
  onRemoveVariant,
  onAddVariant,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // State dialog tạo mới biến thể
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newHex, setNewHex] = useState("");
  const [newStock, setNewStock] = useState<number | "">("");

  // Hàm submit thêm mới variant
  const handleAddVariant = () => {
    if (
      !newName.trim() ||
      newPrice === "" ||
      newStock === "" ||
      (type === "color" && !newHex.trim())
    ) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ");
      return;
    }
    onAddVariant({
      name: newName.trim(),
      price: Number(newPrice),
      hex: type === "color" ? newHex.trim() : undefined,
      stock: Number(newStock),
    });
    // Reset form và đóng dialog
    setNewName("");
    setNewPrice("");
    setNewHex("");
    setNewStock("");
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-x-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-x-2">
            {/* Nút tạo mới biến thể */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Thêm mới
            </Button>
            {/* Nút mở rộng/thu gọn */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isVisible && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {options.map((option) => {
                const isSelected = selectedVariants.some(
                  (variant) => variant.id === option.id
                );

                return (
                  <Button
                    key={option.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onToggleVariant(option.id.toString())}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {option.name}{" "}
                      {type === "color" && option.hex && (
                        <span
                          className="inline-block ml-2 w-4 h-4 rounded-full"
                          style={{ backgroundColor: option.hex }}
                        />
                      )}
                    </span>
                    {isSelected && <Check className="w-4 h-4 ml-2" />}
                  </Button>
                );
              })}
            </div>
          )}

          <div className="space-y-4">
            {selectedVariants.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Chưa có biến thể nào được chọn.
              </p>
            )}

            {selectedVariants.map((variant, index) => (
              <div
                key={variant.id}
                className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-4 items-center gap-4"
              >
                <div className="flex items-center gap-x-2">
                  <Badge variant="outline">{variant.name}</Badge>
                  {type === "color" && variant.hex && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: variant.hex }}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`${type === "color" ? "colors" : "sizes"}.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${type === "color" ? "colors" : "sizes"}.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveVariant(variant.id.toString())}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog thêm mới biến thể */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mới {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
                placeholder="Tên biến thể"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Giá</FormLabel>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) =>
                  setNewPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={loading}
                placeholder="Giá"
              />
            </FormItem>

            {type === "color" && (
              <FormItem>
                <FormLabel>Màu (HEX)</FormLabel>
                <Input
                  type="text"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  disabled={loading}
                  placeholder="#000000"
                />
              </FormItem>
            )}

            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <Input
                type="number"
                value={newStock}
                onChange={(e) =>
                  setNewStock(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={loading}
                placeholder="Số lượng"
              />
            </FormItem>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleAddVariant}
              disabled={loading}
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
