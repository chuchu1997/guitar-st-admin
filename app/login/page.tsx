'use client';
import React, { useEffect }  from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
// import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";
import useAuthStore from '@/providers/auth/auth-provider';
// import Link from 'next/link';

// Zod Schema
const formSchema = z.object({
  name: z.string().min(1, "Bắt buộc phải nhập username"),
  password: z.string().min(1, "Bắt buộc phải nhập password")
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const {  login,loading  } = useAuthStore();
  useEffect(()=>{
    console.log("MOUNTED !!");
  },[])
  
    //   const { login, loading } = useAuthStore();

  // React Hook Form with Zod Resolver
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema)
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormData) => {

    try {
       await login(data.name,data.password);
      
    //   await login(data.name, data.password);
    } catch (error) {
      // Additional error handling if needed
      toast.error(error instanceof Error ? error.message : String(error))
      console.error('Login error', error);
    }finally{
      console.log("CO GOI REDIRECT VE ./ ")
      redirect('/')
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Đăng Nhập
          </h2>

          {/* Username Input */}
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tài khoản
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nhập tài khoản"
              {...register('name')}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none 
                ${errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2
              `}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register('password')}
              className={`
                w-full px-3 py-2 border rounded-md focus:outline-none 
                ${errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-blue-500 text-white py-2 rounded-md 
                hover:bg-blue-600 transition duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </div>

          {/* Optional: Forgot Password Link */}
          {/* <div className="text-center mt-4">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Quên mật khẩu?
            </Link>
          </div> */}
        </form>

       
      </div>
    </div>
  );
}

