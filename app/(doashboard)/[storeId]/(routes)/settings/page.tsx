/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function SettingsPage(props: SettingsPageProps) {
  const { params } = props;

  const { storeId } = await params;
  const user = await getCurrentUser();
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userID: user?.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store}></SettingsForm>
      </div>
    </div>
  );
}
