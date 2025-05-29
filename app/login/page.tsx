/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// import authApi from "@/api/auth";
import toast from "react-hot-toast";
import authApi from "../api/auth/auth.api";
import { AuthStorage } from "@/utils/authLocalstorage";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/"); // nhanh và không lưu vào history stack
    } else {
      setCheckingAuth(false); // Chỉ render giao diện khi chưa login
    }
  }, []);

  if (checkingAuth) {
    // Có thể là null hoặc 1 splash/loading screen
    return null;
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let response = await authApi.login(data);

      if (response.status === 200) {
        const { accessToken, message } = response.data;
        AuthStorage.setToken(accessToken);
        toast.success(message, {
          duration: 1000,
        });

        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}></div>
        </div>
      </div>

      {/* Login container */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/90 border border-yellow-150 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-3 shadow-lg">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Image
                  className="rounded-full"
                  src="/logo.jpg"
                  width={40}
                  height={40}
                  alt="logo"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 italic">
              <p>Guitar Sài Thành </p>
              <p className="text-lg"> (Đăng Nhập)</p>
            </h1>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                hoặc đăng nhập bằng email
              </span>
            </div>
          </div>

          {/* Login form */}
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            {...field}
                            className="w-full pl-10 pr-4 py-6 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập email của bạn"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-sm font-medium text-gray-700">
                        Mật khẩu
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="w-full pl-10 pr-4 py-6 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </Form>

            {/* Remember me & Forgot password */}
            {/* <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-400 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors">
                Quên mật khẩu?
              </a>
            </div> */}
          </div>

          {/* Sign up link */}
          {/* <p className="text-center text-gray-600 mt-6">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors">
              Đăng ký ngay
            </Link>
          </p> */}
        </div>

        {/* Bottom decorations */}
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-xl"></div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
      </div>
    </div>

    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    //   {/* Nền trang */}
    //   <div className="absolute inset-0 overflow-hidden">
    //     <div className="absolute -inset-10 opacity-50">
    //       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
    //       <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
    //       <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
    //     </div>
    //   </div>

    //   {/* Khung đăng nhập */}
    //   <div className="relative w-full max-w-md">
    //     <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
    //       {/* Tiêu đề */}
    //       <div className="text-center mb-8">
    //         <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-3">
    //           {/* <Lock className="w-8 h-8 text-white" /> */}
    //           <Image
    //             className="rounded-full"
    //             src="/images/logo.jpg"
    //             width={40}
    //             height={40}
    //             alt="logo"></Image>
    //         </div>
    //         <h1 className="text-3xl font-bold text-white mb-2">
    //           Chào mừng trở lại
    //         </h1>
    //         <p className="text-gray-300">Đăng nhập để tiếp tục</p>
    //       </div>

    //       {/* Đăng nhập bằng MXH */}
    //       <div className="space-y-3 mb-6">
    //         <button className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-white transition-all duration-200 hover:scale-105">
    //           <Chrome className="w-5 h-5" />
    //           Tiếp tục với Google
    //         </button>
    //       </div>

    //       {/* Dòng chia cách */}
    //       <div className="relative mb-6">
    //         <div className="absolute inset-0 flex items-center">
    //           <div className="w-full border-t border-white/20"></div>
    //         </div>
    //         <div className="relative flex justify-center text-sm">
    //           <span className="bg-transparent px-4 text-gray-300">
    //             hoặc đăng nhập bằng email
    //           </span>
    //         </div>
    //       </div>

    //       {/* Biểu mẫu đăng nhập */}
    //       <div className="space-y-6">
    //         <Form {...form}>
    //           <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="space-y-6">
    //             <FormField
    //               control={form.control}
    //               name="email"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <Label
    //                     htmlFor="password"
    //                     className="text-sm font-medium text-gray-200">
    //                     Email
    //                   </Label>
    //                   <FormControl>
    //                     <div className="relative">
    //                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    //                       <Input
    //                         id="email"
    //                         type="email"
    //                         {...field}
    //                         className="w-full pl-10 pr-4 py-6 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
    //                         placeholder="Nhập email của bạn"
    //                         required
    //                       />
    //                     </div>
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />

    //             <FormField
    //               control={form.control}
    //               name="password"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <Label
    //                     htmlFor="password"
    //                     className="text-sm font-medium text-gray-200">
    //                     Mật khẩu
    //                   </Label>
    //                   <FormControl>
    //                     <div className="relative">
    //                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    //                       <Input
    //                         id="password"
    //                         type={showPassword ? "text" : "password"}
    //                         {...field}
    //                         className="w-full pl-10 pr-12 py-6 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
    //                         placeholder="Nhập mật khẩu của bạn"
    //                         required
    //                       />
    //                       <button
    //                         type="button"
    //                         onClick={() => setShowPassword(!showPassword)}
    //                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
    //                         {showPassword ? (
    //                           <EyeOff className="w-5 h-5" />
    //                         ) : (
    //                           <Eye className="w-5 h-5" />
    //                         )}
    //                       </button>
    //                     </div>
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />

    //             <button
    //               type="submit"
    //               disabled={isLoading}
    //               className="cursor-pointer w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
    //               {isLoading ? (
    //                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    //               ) : (
    //                 <>
    //                   Đăng nhập
    //                   <ArrowRight className="w-4 h-4" />
    //                 </>
    //               )}
    //             </button>
    //           </form>
    //         </Form>

    //         {/* Ghi nhớ & Quên mật khẩu */}
    //         <div className="flex items-center justify-between">
    //           <label className="flex items-center">
    //             <input
    //               type="checkbox"
    //               className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
    //             />
    //             <span className="ml-2 text-sm text-gray-300">
    //               Ghi nhớ đăng nhập
    //             </span>
    //           </label>
    //           <a
    //             href="#"
    //             className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
    //             Quên mật khẩu?
    //           </a>
    //         </div>

    //         {/* Nút đăng nhập */}
    //       </div>

    //       {/* Đăng ký */}
    //       <p className="text-center text-gray-300 mt-6">
    //         Chưa có tài khoản?{" "}
    //         <a
    //           href="#"
    //           className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
    //           Đăng ký ngay
    //         </a>
    //       </p>
    //     </div>

    //     {/* Trang trí dưới cùng */}
    //     <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
    //     <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
    //   </div>
    // </div>
  );
};

export default LoginPage;
