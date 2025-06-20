/** @format */

import React, { useEffect, useState } from "react";
import {
  Search,
  Globe,
  Tag,
  FileText,
  Link,
  AppWindowMac,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
// import { Input, Textarea, Card, CardHeader, CardTitle, CardContent, ProgressBar, Badge } from "."; // Assuming these components are imported correctly

const SEOForm = ({ loading = false, form }: any) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [seoScore, setSeoScore] = useState(0);

  const ProgressBar = ({ value, max, className = "" }: any) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${
          value / max > 0.8
            ? "bg-red-500"
            : value / max > 0.6
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );
  const getSEOScore = () => {
    let score = 0;
    const seo = form.watch("seo");

    if (seo?.title?.length >= 30 && seo.title.length <= 60) score += 20;
    if (seo?.description?.length >= 120 && seo.description.length <= 160)
      score += 20;
    if (seo?.keywords?.split(",").length >= 3) score += 15;
    if (seo?.slug) score += 10;
    if (seo?.canonicalUrl) score += 10;
    if (seo?.ogTitle && seo?.ogDescription) score += 10;
    return score;
  };
  useEffect(() => {
    const subscription = form.watch((_: any, { name }: any) => {
      if (name?.startsWith("seo")) {
        setSeoScore(getSEOScore());
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  //   const seoScore = getSEOScore();

  const tabs = [
    { id: "basic", label: "Cơ bản", icon: FileText },
    { id: "social", label: "Mạng xã hội", icon: Globe },
    { id: "preview", label: "Xem trước", icon: Eye },
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
            <Badge
              variant={
                seoScore >= 80
                  ? "default"
                  : seoScore >= 60
                  ? "secondary"
                  : "destructive"
              }>
              {seoScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ProgressBar value={seoScore} max={100} />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {seoScore >= 80 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" /> Tuyệt vời!
                  SEO của bạn đã được tối ưu tốt.
                </>
              ) : seoScore >= 60 ? (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-500" /> Khá tốt,
                  nhưng vẫn có thể cải thiện thêm.
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" /> Cần cải thiện
                  SEO để tăng hiệu quả.
                </>
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
          </div>
        </CardHeader>

        <>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
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
                    <FormField
                      control={form.control}
                      name="seo.title"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="Nhập tiêu đề SEO (30-60 ký tự)"
                          maxLength={60}
                        />
                      )}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {form.watch("seo.title")?.length || 0}/60 ký tự
                      </span>
                      <span
                        className={
                          form.watch("seo.title")?.length >= 30 &&
                          form.watch("seo.title")?.length <= 60
                            ? "text-green-600"
                            : "text-red-600"
                        }>
                        {form.watch("seo.title")?.length >= 30 &&
                        form.watch("seo.title")?.length <= 60
                          ? "Tốt"
                          : "Cần cải thiện"}
                      </span>
                    </div>
                  </div>

                  {/* Focus Keyword */}
                </div>

                {/* SEO Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Mô tả SEO
                  </label>
                  <FormField
                    control={form.control}
                    name="seo.description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        disabled={loading}
                        placeholder="Mô tả ngắn gọn về nội dung trang (120-160 ký tự)"
                        rows={3}
                        maxLength={160}
                      />
                    )}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {form.watch("seo.description")?.length || 0}/160 ký tự
                    </span>
                    <span
                      className={
                        form.watch("seo.description")?.length >= 120 &&
                        form.watch("seo.description")?.length <= 160
                          ? "text-green-600"
                          : "text-red-600"
                      }>
                      {form.watch("seo.description")?.length >= 120 &&
                      form.watch("seo.description")?.length <= 160
                        ? "Tốt"
                        : "Cần cải thiện"}
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
                    <FormField
                      control={form.control}
                      name="seo.keywords"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          disabled={loading}
                          placeholder="Các từ khóa phụ, cách nhau bằng dấu phẩy"
                          rows={2}
                        />
                      )}
                    />
                    <div className="text-xs text-gray-500">
                      {form.watch("seo.keywords")
                        ? `${
                            form.watch("seo.keywords").split(",").length
                          } từ khóa`
                        : "0 từ khóa"}
                    </div>
                  </div>

                  {/* URL Slug */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Link className="w-4 h-4" />
                      URL Slug
                    </label>
                    <FormField
                      control={form.control}
                      name="seo.slug"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="url-slug-cua-trang"
                        />
                      )}
                    />
                    <div className="text-xs text-gray-500">
                      URL: /.../{form.watch("seo.slug") || "url-slug"}
                    </div>
                  </div>
                </div>

                {/* Canonical URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Globe className="w-4 h-4" />
                    Canonical URL
                  </label>
                  <FormField
                    control={form.control}
                    name="seo.canonicalUrl"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="https://example.com/duong-dan-chinh-thuc"
                      />
                    )}
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
                      <label className="text-sm font-medium text-gray-700">
                        OG Title
                      </label>
                      <FormField
                        control={form.control}
                        name="seo.ogTitle"
                        render={({ field }) => (
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="Tiêu đề khi chia sẻ"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        OG Image URL
                      </label>
                      <FormField
                        control={form.control}
                        name="seo.ogImage"
                        render={({ field }) => (
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="https://example.com/image.jpg"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      OG Description
                    </label>
                    <FormField
                      control={form.control}
                      name="seo.ogDescription"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          disabled={loading}
                          placeholder="Mô tả khi chia sẻ trên mạng xã hội"
                          rows={2}
                        />
                      )}
                    />
                  </div>
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
                      {form.watch("seo.title") || "Tiêu đề trang của bạn"}
                    </div>
                    <div className="text-green-700 text-sm">
                      {process.env.NEXT_PUBLIC_BASE_URL_WEBSITE}/
                      {form.watch("seo.slug") || "url-slug"}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {form.watch("seo.description") ||
                        "Mô tả SEO sẽ hiển thị ở đây khi bạn nhập vào..."}
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
                    {form.watch("seo.ogImage") && (
                      <div className="w-full h-32">
                        <img
                          src={form.watch("seo.ogImage")}
                          className="h-35 object-contain"
                          alt="Open Graph"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="font-semibold text-gray-900">
                        {form.watch("seo.ogTitle") ||
                          form.watch("seo.title") ||
                          "Tiêu đề khi chia sẻ"}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {form.watch("seo.ogDescription") ||
                          form.watch("seo.description") ||
                          "Mô tả khi chia sẻ trên mạng xã hội"}
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
      </Card>
    </div>
  );
};

export default SEOForm;
