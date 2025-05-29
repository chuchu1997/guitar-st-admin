
'use client';


import React from 'react';
import { Separator } from '@/components/ui/separator';
import { HeartIcon, GithubIcon, LinkedinIcon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t py-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Admin Dashboard</h3>
            <p className="text-muted-foreground text-sm">
              Manage your business with our powerful admin tools
            </p>
            <div className="flex space-x-4">
              <GithubIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-muted-foreground hover:text-primary text-sm">Dashboard</a>
              </li>
              <li>
                <a href="/users" className="text-muted-foreground hover:text-primary text-sm">Users</a>
              </li>
              <li>
                <a href="/settings" className="text-muted-foreground hover:text-primary text-sm">Settings</a>
              </li>
              <li>
                <a href="/help" className="text-muted-foreground hover:text-primary text-sm">Help Center</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact</h3>
            <p className="text-muted-foreground text-sm">
              info@admincompany.com
            </p>
            <p className="text-muted-foreground text-sm">
              +84 123 456 789
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Admin Company. All rights reserved.
          </p>
          
          <p className="text-sm flex items-center">
            <span className="font-medium text-primary">thiết kế website bởi nguyễn cường</span>
            <HeartIcon className="h-4 w-4 text-red-500 ml-2" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;