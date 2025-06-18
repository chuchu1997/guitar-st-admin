import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Settings } from "lucide-react";

interface SettingsSectionProps {
  form: any;
  loading: boolean;
  name?:string
}
export const SettingsSection: React.FC<SettingsSectionProps> = ({ form, loading,name = "isFeatured" }) => (
  <Card className="shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Settings className="w-5 h-5 text-gray-600" />
        </div>
        Cài đặt hiển thị (hoạt động)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 
                             rounded-lg border border-gray-200 p-4 bg-gray-50/50 
                             hover:bg-gray-50 transition-colors">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
                className="mt-1"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base font-medium cursor-pointer">
                Hiển thị 
              </FormLabel>
         
            </div>
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);