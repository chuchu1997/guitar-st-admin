import { Role } from "./auth";



interface BaseUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  avatar: string;
  role: Role;
  orders: any[];
  wishlist: any[];
  reviews: any[];
  stores: any[];
  resetToken: string;
  resetTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserInterface extends BaseUser { 
    id:number;

}
export interface CreateUserInterface extends Omit<Partial<BaseUser>, 'orders' | 'wishlist' | 'reviews' | 'stores'> {
  email: string;
  password: string;
  name: string;
 
}

// Dùng khi update user: mọi field đều optional
export interface UpdateUserInterface extends Partial<Omit<UserInterface, 'id'>> {}