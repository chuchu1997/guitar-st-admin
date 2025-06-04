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
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-x-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
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
  );
};
