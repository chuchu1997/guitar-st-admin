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
                 p-6 sm:p-8 md:p-12 rounded-xl text-center cursor-pointer transition-all duration-300 
                 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 
                 hover:shadow-lg transform hover:-translate-y-1"
      onClick={() => setIsEditorOpen(true)}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 
                       rounded-full flex items-center justify-center shadow-lg">
          <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div className="px-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
            Bắt đầu viết mô tả sản phẩm
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto leading-relaxed">
            Tạo mô tả chi tiết và hấp dẫn để thu hút khách hàng
          </p>
        </div>
      </div>
    </div>
  );

  const EditorView = ({ field }: any) => (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                Trình soạn thảo mô tả
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <span className="text-xs text-gray-500 hidden sm:inline">Tự động lưu</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="p-3 sm:p-4">
          <FormControl>
            <EditorComponent
              value={field.value}
              onChange={field.onChange}
              className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] focus:outline-none"
              placeholder="Bắt đầu viết mô tả sản phẩm..."
            />
          </FormControl>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
          <span>
            <span className="font-medium">{field.value?.length || 0}</span> ký tự
          </span>
          <span className="hidden sm:inline">
            Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
          </span>
        </div>

        <div className="flex items-center justify-end space-x-2 sm:space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditorOpen(false)}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Đóng</span>
            <span className="sm:hidden">Đóng</span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Xem trước</span>
            <span className="sm:hidden">Xem</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm w-full overflow-hidden">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg flex-shrink-0">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold truncate">
                Mô tả sản phẩm
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">
                Tạo mô tả chi tiết và hấp dẫn
              </p>
            </div>
          </div>
          {isEditorOpen && (
            <div className="flex items-center justify-start sm:justify-end">
              <span className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 sm:mr-2 animate-pulse"></div>
                Đang chỉnh sửa
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
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