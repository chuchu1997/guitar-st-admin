import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface LinkInputDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

export default function LinkInputDialog({ open, onClose, onConfirm }: LinkInputDialogProps) {
  const [url, setUrl] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <DialogHeader>Chèn liên kết</DialogHeader>
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onConfirm(url);
              setUrl("");
              onClose();
            }}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}