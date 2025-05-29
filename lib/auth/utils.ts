import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "@prisma/client";
import { cookies } from "next/headers";
import prismadb from "../primadb";

// import { User } from "@prisma/client";

// Hash password


export async function hashPassword(password: string): Promise<string> {

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions


  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: Partial<User>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "",
    { expiresIn: "10d" } // Token will expire in 10 days
  );
}

export async function getCurrentUser(): Promise<User | null> {

  
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  

  if (!token) {
    return null;
  }

  const userVerify = verifyToken(token) as User;

    try{
      const user = await prismadb.user.findUnique({
        where:{
          id:userVerify.id
        }
      })
      if(user){
        return user;

      }
      return user;
      
    
    }catch(err){
      return null;

    }
  // try {
  //   // Verify the token and fetch user
  //   const user = await prismadb.user.findUnique({
  //     where: { 
  //       // Assuming you have a token field in your User model
  //       token: token.value 
  //     }
  //   });

  //   return user;
  // } catch (error) {
  //   console.error('Error fetching current user:', error);
  //   return null;
  // }
}

// Verify JWT token
export function verifyToken(token: string){
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "");
  } catch (error) {
    console.log(error)
    return null;
  }
}
