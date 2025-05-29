"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<
  ApiAlertProps["variant"],
  "secondary" | "destructive" | "default" | "outline"
> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant,
}) => {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success(`API đã được copy vào clipboard `);
  };
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}

        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>

      <AlertDescription className="  mt-4 flex items-center justify-between">
        <code className="relative  rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>

        <Button
          className="cursor-pointer"
          variant={"outline"}
          size="icon"
          onClick={() => {
            onCopy(description);
          }}
        >
          <Copy />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
