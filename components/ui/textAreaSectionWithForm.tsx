/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Podcast } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

interface TextAreaProps {
  form: any;
  nameFormField: string;
  loading: boolean;
  title: string;
  placeholder: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // hoặc bất cứ type icon nào bạn dùng
}
export const TextAreaSectionWithForm: React.FC<TextAreaProps> = ({
  form,
  loading,
  nameFormField,
  title = "Mô tả",
  placeholder,
  icon: Icon = Podcast,
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
              <Textarea
                {...field}
                disabled={loading}
                placeholder={placeholder}
                className="min-h-[80px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              Tối đa 200 ký tự
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
