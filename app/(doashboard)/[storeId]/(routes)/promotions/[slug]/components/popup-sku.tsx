/** @format */

"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDownIcon,
  PlusCircleIcon,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

interface SkuPopupProps {
  className?: string;
}

export default function SkuPopup({ className }: SkuPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Chọn store"
          className={cn("w-[200px] justify-between", className)}>
          <StoreIcon className="mr-2 h-4 w-4" />
          {/* {currentStore?.label} */}
          <ChevronsUpDownIcon className="w-4 h-4 shrink-0 ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Tìm Store ..."></CommandInput>
            <CommandEmpty>Không tìm thấy Store</CommandEmpty>
            <CommandGroup heading="Stores">
              {/* {formatItems.map((store) => (
                <CommandItem
                  className="text-sm"
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}>
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))} */}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  //   storeModal.onOpen();
                }}>
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                <span>Tạo 1 SKU mới</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
