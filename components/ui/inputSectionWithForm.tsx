/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { ImageInterface } from "@/types/product";
import { Package } from "lucide-react";
import { Input } from "./input";

interface InputProps {
  form: any;
  nameFormField: string;
  loading: boolean;
  title: string;
  placeholder: string;
}
export const InputSectionWithForm: React.FC<InputProps> = ({
  form,
  loading,
  nameFormField,
  title,
  placeholder,
}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Package className="w-5 h-5 text-blue-600" />
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
                {...field}
                type="text"
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
