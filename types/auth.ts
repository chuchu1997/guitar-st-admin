import { User } from "@prisma/client";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<void>;
  //   register: (
  //     email: string,
  //     password: string,
  //     name?: string,
  //     role?: "USER" | "ADMIN" | "MANAGER"
  //   ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}
