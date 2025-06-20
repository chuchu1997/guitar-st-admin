import React, { useState } from "react";
import {
  Search,
  Globe,
  Tag,
  FileText,
  Image,
  Link,
  ToggleLeft,
  ToggleRight,
  AppWindowMac,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import ImageUpload from "../ui/ImageUpload/image-upload";

// Mock form components for demonstration
const Card = ({ children, className = "" }:any) => (
  <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }:any) => (
  <div className="px-6 py-4 border-b border-gray-100">
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }:any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children }:any) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

const Input = ({ placeholder, value, onChange, disabled, className = "", maxLength, ...props }:any) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    maxLength={maxLength}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
    } ${className}`}
    {...props}
  />
);

const Textarea = ({ placeholder, value, onChange, disabled, rows = 3, maxLength, className = "", ...props }:any) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    rows={rows}
    maxLength={maxLength}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
      disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
    } ${className}`}
    {...props}
  />
);

const Toggle = ({ enabled, onToggle, disabled = false }:any) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      enabled ? 'bg-blue-600' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

type BadgeVariant = "default" | "success" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ value, max, className = "" }:any) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className={`h-2 rounded-full transition-all duration-300 ${
        value / max > 0.8 ? 'bg-red-500' : value / max > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
      }`}
      style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
    />
  </div>
);

const SEOForm = ({ loading = false }) => {
  const [seoData, setSeoData] = useState({
    enabled: true,
    title: "",
    description: "",
    keywords: "",
    slug: "",
    canonicalUrl: "",
    focusKeyword: "",
    altText: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",

    robotsIndex: true,
    robotsFollow: true,
    xmlSitemap: true,
    structuredData: true
  });

  const [activeTab, setActiveTab] = useState("basic");

  const updateField = (field:any, value:any) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title:any) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value:any) => {
    updateField('title', value);
    if (!seoData.slug) {
      updateField('slug', generateSlug(value));
    }
  };

  const getSEOScore = () => {
    let score = 0;
    if (seoData.title && seoData.title.length >= 30 && seoData.title.length <= 60) score += 20;
    if (seoData.description && seoData.description.length >= 120 && seoData.description.length <= 160) score += 20;
    if (seoData.keywords && seoData.keywords.split(',').length >= 3) score += 15;
    if (seoData.focusKeyword) score += 15;
    if (seoData.slug) score += 10;
    if (seoData.canonicalUrl) score += 10;
    if (seoData.ogTitle && seoData.ogDescription) score += 10;
    return score;
  };

  const seoScore = getSEOScore();

  const tabs = [
    { id: "basic", label: "Cơ bản", icon: FileText },
    { id: "social", label: "Mạng xã hội", icon: Globe },
    { id: "technical", label: "Kỹ thuật", icon: Search },
    { id: "preview", label: "Xem trước", icon: Eye }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* SEO Score Card */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              Điểm SEO của bạn
            </CardTitle>
            <Badge variant={seoScore >= 80 ? "success" : seoScore >= 60 ? "warning" : "error"}>
              {seoScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ProgressBar value={seoScore} max={100} />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {seoScore >= 80 ? (
                <><CheckCircle className="w-4 h-4 text-green-500" /> Tuyệt vời! SEO của bạn đã được tối ưu tốt.</>
              ) : seoScore >= 60 ? (
                <><AlertCircle className="w-4 h-4 text-yellow-500" /> Khá tốt, nhưng vẫn có thể cải thiện thêm.</>
              ) : (
                <><AlertCircle className="w-4 h-4 text-red-500" /> Cần cải thiện SEO để tăng hiệu quả.</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main SEO Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AppWindowMac className="w-5 h-5 text-blue-600" />
              </div>
              Tối ưu hóa SEO
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Bật SEO</span>
              <Toggle
                enabled={seoData.enabled}
                onToggle={() => updateField('enabled', !seoData.enabled)}
                disabled={loading}
              />
            </div>
          </div>
        </CardHeader>

        {seoData.enabled && (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                     type = "button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <CardContent>
              {/* Basic SEO Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* SEO Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FileText className="w-4 h-4" />
                        Tiêu đề SEO
                      </label>
                      <Input
                        value={seoData.title}
                        onChange={(e:any) => handleTitleChange(e.target.value)}
                        disabled={loading}
                        placeholder="Nhập tiêu đề SEO (30-60 ký tự)"
                        maxLength={60}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{seoData.title.length}/60 ký tự</span>
                        <span className={seoData.title.length >= 30 && seoData.title.length <= 60 ? "text-green-600" : "text-red-600"}>
                          {seoData.title.length >= 30 && seoData.title.length <= 60 ? "Tốt" : "Cần cải thiện"}
                        </span>
                      </div>
                    </div>

                    {/* Focus Keyword */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag className="w-4 h-4" />
                        Từ khóa chính
                      </label>
                      <Input
                        value={seoData.focusKeyword}
                        onChange={(e:any) => updateField('focusKeyword', e.target.value)}
                        disabled={loading}
                        placeholder="Từ khóa chính của trang"
                      />
                    </div>
                  </div>

                  {/* SEO Description */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FileText className="w-4 h-4" />
                      Mô tả SEO
                    </label>
                    <Textarea
                      value={seoData.description}
                      onChange={(e:any) => updateField('description', e.target.value)}
                      disabled={loading}
                      placeholder="Mô tả ngắn gọn về nội dung trang (120-160 ký tự)"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{seoData.description.length}/160 ký tự</span>
                      <span className={seoData.description.length >= 120 && seoData.description.length <= 160 ? "text-green-600" : "text-red-600"}>
                        {seoData.description.length >= 120 && seoData.description.length <= 160 ? "Tốt" : "Cần cải thiện"}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Keywords */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag className="w-4 h-4" />
                        Từ khóa phụ
                      </label>
                      <Textarea
                        value={seoData.keywords}
                        onChange={(e:any) => updateField('keywords', e.target.value)}
                        disabled={loading}
                        placeholder="Các từ khóa phụ, cách nhau bằng dấu phẩy"
                        rows={2}
                      />
                      <div className="text-xs text-gray-500">
                        {seoData.keywords ? `${seoData.keywords.split(',').length} từ khóa` : "0 từ khóa"}
                      </div>
                    </div>

                    {/* URL Slug */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Link className="w-4 h-4" />
                        URL Slug
                      </label>
                      <Input
                        value={seoData.slug}
                        onChange={(e:any) => updateField('slug', e.target.value)}
                        disabled={loading}
                        placeholder="url-slug-cua-trang"
                      />
                      <div className="text-xs text-gray-500">
                        URL: /.../{seoData.slug || "url-slug"}
                      </div>
                    </div>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Globe className="w-4 h-4" />
                      Canonical URL
                    </label>
                    <Input
                      value={seoData.canonicalUrl}
                      onChange={(e:any) => updateField('canonicalUrl', e.target.value)}
                      disabled={loading}
                      placeholder="https://example.com/duong-dan-chinh-thuc"
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Info className="w-3 h-3" />
                      URL chính thức để tránh nội dung trùng lặp
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  {/* Open Graph */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Open Graph (Facebook, LinkedIn)
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">OG Title</label>
                        <Input
                          value={seoData.ogTitle}
                          onChange={(e:any) => updateField('ogTitle', e.target.value)}
                          disabled={loading}
                          placeholder="Tiêu đề khi chia sẻ"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">OG Image URL</label>
                        <Input
                          value={seoData.ogImage}
                          onChange={(e:any) => updateField('ogImage', e.target.value)}
                          disabled={loading}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">OG Description</label>
                      <Textarea
                        value={seoData.ogDescription}
                        onChange={(e:any) => updateField('ogDescription', e.target.value)}
                        disabled={loading}
                        placeholder="Mô tả khi chia sẻ trên mạng xã hội"
                        rows={2}
                      />
                    </div>
                  </div>

             
              
                </div>
              )}

              {/* Technical SEO Tab */}
              {activeTab === "technical" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Robots Settings */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-800">Cài đặt Robots</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Index (Cho phép lập chỉ mục)</span>
                          <Toggle
                            enabled={seoData.robotsIndex}
                            onToggle={() => updateField('robotsIndex', !seoData.robotsIndex)}
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Follow (Theo dõi liên kết)</span>
                          <Toggle
                            enabled={seoData.robotsFollow}
                            onToggle={() => updateField('robotsFollow', !seoData.robotsFollow)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-800">Cài đặt bổ sung</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">XML Sitemap</span>
                          <Toggle
                            enabled={seoData.xmlSitemap}
                            onToggle={() => updateField('xmlSitemap', !seoData.xmlSitemap)}
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Structured Data</span>
                          <Toggle
                            enabled={seoData.structuredData}
                            onToggle={() => updateField('structuredData', !seoData.structuredData)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alt Text */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Image className="w-4 h-4" />
                      Alt Text cho hình ảnh chính
                    </label>
                    <Input
                      value={seoData.altText}
                      onChange={(e:any) => updateField('altText', e.target.value)}
                      disabled={loading}
                      placeholder="Mô tả hình ảnh cho accessibility và SEO"
                    />
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="space-y-6">
                  {/* Google Search Preview */}
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Xem trước Google Search
                    </h4>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                        {seoData.title || "Tiêu đề trang của bạn"}
                      </div>
                      <div className="text-green-700 text-sm">
                        {process.env.NEXT_PUBLIC_BASE_URL_WEBSITE}/{seoData.slug || "url-slug"}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {seoData.description || "Mô tả SEO sẽ hiển thị ở đây khi bạn nhập vào..."}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Preview */}
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Xem trước mạng xã hội
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      {seoData.ogImage && (
                        <div className="w-full h-32 ">
                         
                            <img src = {seoData.ogImage} className = "h-35 object-contain"></img>
                          {/* <Image className="w-8 h-8 text-gray-400" /> */}
                        </div>
                      )}
                      <div className="p-4">
                        <div className="font-semibold text-gray-900">
                          {seoData.ogTitle || seoData.title || "Tiêu đề khi chia sẻ"}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {seoData.ogDescription || seoData.description || "Mô tả khi chia sẻ trên mạng xã hội"}
                        </div>
                        <div className="text-gray-400 text-xs mt-2">
                          {process.env.NEXT_PUBLIC_BASE_URL_WEBSITE}
                       
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default SEOForm;