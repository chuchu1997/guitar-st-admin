/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { ImageInterface } from "@/types/product";
import { BadgeCheckIcon, Package } from "lucide-react";
import { Input } from "./input";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckFormProps {
  form: any;
  nameFormField: string;
  loading: boolean;
  title: string;
  action: string;
  description: string;
}
export const CheckActiveSectionWithForm: React.FC<CheckFormProps> = ({
  form,
  loading,
  nameFormField,
  title,
  action,
  description,
}) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BadgeCheckIcon className="w-5 h-5 text-blue-600" />
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
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}></Checkbox>
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{action} </FormLabel>
              <FormDescription>{`(${description})`}</FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);
