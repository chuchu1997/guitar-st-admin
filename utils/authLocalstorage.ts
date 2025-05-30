/** @format */

const TOKEN_KEY = "access_token";

export const AuthStorage = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/";
    }
  },
};
