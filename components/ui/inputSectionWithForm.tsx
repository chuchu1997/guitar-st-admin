/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/ImageUpload/image-upload";
import { ImageInterface } from "@/types/product";
import { Package } from "lucide-react";
import { Input } from "./input";

interface InputProps {
  form: any;
  nameFormField: string;
  loading: boolean;
  title: string;
  placeholder: string;
  type?: "text" | "number" | "email" | "password";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // hoặc bất cứ type icon nào bạn dùng
}
export const InputSectionWithForm: React.FC<InputProps> = ({
  form,
  loading,
  nameFormField,
  title,
  placeholder,
  type = "text",
  icon: Icon = Package,
}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <FormField
        control={form.control}
        name={nameFormField}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                className={type === "number" ? "appearance-none" : ""}
                {...field}
                type={type}
                pattern={nameFormField === "slug" ? "\\S*" : undefined}
                disabled={loading}
                placeholder={placeholder}></Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
