/** @format */

"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    console.log("SETUPP PAGE CALL ");
    if (!isOpen) {
      //FIRST INIT IS OPEN = TRUE
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
