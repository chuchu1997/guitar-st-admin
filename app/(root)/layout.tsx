import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    const store = await prismadb.store.findFirst({
      where: {
        userID: user?.id,
      },
    });

    if (store) {
      redirect(`/${store.id}`);
    }
  }

  return <>{children}</>;
}
