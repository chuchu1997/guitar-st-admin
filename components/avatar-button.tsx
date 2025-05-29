/** @format */

"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { PopoverTrigger, Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { AlertModal } from "./modals/alert-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AvatarProps {
  className?: string;
}
const AvatarButton = (props: AvatarProps) => {
  const { className } = props;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSignout = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/auth/logout`);
      toast.success("Thoát thành công ");
      router.refresh();
    } catch (err) {
      toast.error("Thoát thất bại !!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        onConfirm={async () => {
          await onSignout();
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOpen={open}
        loading={loading}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className={cn("cursor-pointer ", className)}>
            <AvatarFallback className="p-2">AD</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Profile</h4>
              <p className="text-sm text-muted-foreground">
                This is your profile
              </p>
            </div>
            <div className="grid gap-4">
              <Button variant={"secondary"} disabled={true}>
                Change Password
              </Button>
              <Button
                variant={"destructive"}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(true);
                }}>
                Sign Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AvatarButton;
