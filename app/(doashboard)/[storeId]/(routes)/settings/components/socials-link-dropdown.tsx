"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Minus, Package } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFieldArray } from "react-hook-form";
import { SocialType } from "@/types/store";

interface SelectCollapseSocialProps {
  form: any;
  nameFormField: string;
  loading: boolean;
  title: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

type SocialField = {
  id: string;
  type: SocialType;
  url: string;
};

export const SocialsSection = ({
  form,
  loading,
  nameFormField,
  title,
  icon: Icon = Package,
}: SelectCollapseSocialProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: nameFormField,
  });

  // Ép kiểu để truy cập 'type' an toàn
  const typedFields = fields as SocialField[];

  const selectedSocialTypes = typedFields.map((field) => field.type);

  // Các loại social chưa được chọn
  const availableSocialTypes = Object.values(SocialType).filter(
    (type) => !selectedSocialTypes.includes(type)
  );

  return (
    <Collapsible className="border rounded-lg p-4 space-y-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between items-center overflow-hidden text-sm"
        >
          {title}
          <span>{typedFields.length > 0 ? `(${typedFields.length})` : ""}</span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4">
        {typedFields.map((fieldItem, index) => {
          const currentType = fieldItem.type;

          // Cho phép chọn lại chính currentType, loại bỏ các type khác đã chọn
          const options = Object.values(SocialType).filter(
            (type) =>
              !selectedSocialTypes.includes(type) || type === currentType
          );

          return (
            <div key={fieldItem.id} className="flex flex-col md:flex-row gap-4 items-end">
              <FormField
                control={form.control}
                name={`${nameFormField}.${index}.type`}
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/3 ">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mạng xã hội" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${nameFormField}.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1  w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập URL"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                disabled={loading}
              >
                <Minus className="w-4 h-4  text-red-600" />
              </Button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          disabled={loading || availableSocialTypes.length === 0}
          onClick={() => {
            if (availableSocialTypes.length > 0) {
              append({ type: availableSocialTypes[0], url: "" });
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mạng xã hội
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};
