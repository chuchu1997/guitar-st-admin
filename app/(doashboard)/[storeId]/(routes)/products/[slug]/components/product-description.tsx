import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Edit3, Eye, X } from "lucide-react";
import EditorComponent from "@/components/editor";
interface DescriptionSectionProps {
  form: any;
  loading: boolean;
}
export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ form, loading }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const EmptyState = () => (
    <div 
      className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 
                 p-12 rounded-xl text-center cursor-pointer transition-all duration-300 
                 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 
                 hover:shadow-lg transform hover:-translate-y-1"
      onClick={() => setIsEditorOpen(true)}
    >
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 
                       rounded-full flex items-center justify-center shadow-lg">
          <Edit3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bắt đầu viết mô tả sản phẩm
          </h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Tạo mô tả chi tiết và hấp dẫn để thu hút khách hàng
          </p>
        </div>
      </div>
    </div>
  );

  const EditorView = ({ field }:any) => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Trình soạn thảo mô tả
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Tự động lưu</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <FormControl>
            <EditorComponent
              value={field.value}
              onChange={field.onChange}
              className="min-h-[300px] focus:outline-none"
              placeholder="Bắt đầu viết mô tả sản phẩm..."
            />
          </FormControl>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>
            <span className="font-medium">{field.value?.length || 0}</span> ký tự
          </span>
          <span>
            Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditorOpen(false)}
          >
            <X className="w-4 h-4 mr-2" />
            Đóng
          </Button>
          <Button type="button" variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Xem trước
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Edit3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Mô tả sản phẩm
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Tạo mô tả chi tiết và hấp dẫn
              </p>
            </div>
          </div>
          {isEditorOpen && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Đang chỉnh sửa
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              {!isEditorOpen ? <EmptyState /> : <EditorView field={field} />}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
