"use client";

import { userOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}
export const ApiList: React.FC<ApiListProps> = ({
  entityIdName,
  entityName,
}) => {
  const params = useParams();
  const router = useRouter();

  const origin = userOrigin();
  const baseUrl = `${origin}/${params.storeId}`;

  return (
    <div className = "overflow-hidden">
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      ></ApiAlert>

      {/* <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/${entityIdName}`}
      ></ApiAlert>
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}/new`}
      ></ApiAlert>
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entityIdName}`}
      ></ApiAlert>
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entityIdName}`}
      ></ApiAlert> */}
    </div>
  );
};
