"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef, useState } from "react";
import { InlineImageNode } from "./editor/nodes/InlineImageNode";

export default function ResizableImage({
  url,
  altText,
  position,
  width,
  height,
  nodeKey,
}: {
  url: string;
  altText: string;
  position: "left" | "right" | "full";
  width: number;
  height: number;
  nodeKey: string;
}) {
  const [editor] = useLexicalComposerContext();
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = useState({ width, height });

  const onResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgRef.current?.offsetWidth || size.width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + moveEvent.clientX - startX);
      setSize((prev) => ({ ...prev, width: newWidth }));

      // Update editor node state
      editor.update(() => {
        const node = editor.getEditorState().read(() =>
          editor.getEditorState()._nodeMap.get(nodeKey)
        );
        if (node instanceof InlineImageNode) {
          node.__width = newWidth;
        }
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imgRef}
        src={url}
        alt={altText}
        style={{
          width: size.width,
          height: "auto",
          float: position === "full" ? "none" : position,
          display: "block",
          maxWidth: "100%",
        }}
      />
      <div
        onMouseDown={onResize}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 10,
          height: 10,
          background: "blue",
          cursor: "nwse-resize",
        }}
      />
    </div>
  );
}