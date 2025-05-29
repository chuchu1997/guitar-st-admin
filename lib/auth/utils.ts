import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const { user } = await res.json();
  return user;
};