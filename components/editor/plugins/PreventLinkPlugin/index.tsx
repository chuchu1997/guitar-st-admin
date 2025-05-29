
'use client';
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const PreventLinkOpenPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerRootListener((rootElement) => {
      if (rootElement === null) return;

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target && target.tagName === "A") {
          e.preventDefault(); // 🚫 Ngăn mở tab mới
        }
      };

      rootElement.addEventListener("click", handleClick);

      return () => {
        rootElement.removeEventListener("click", handleClick);
      };
    });
  }, [editor]);

  return null;
};