import React, { useState, useRef, useEffect } from "react";
import {
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
} from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $createInlineImageNode, InlineImageNode } from "../../nodes/InlineImageNode";

type Props = {
  url: string;
  alt: string;
  width: number;
  height: number;
  position: "left" | "right" | "full";
  nodeKey: string;
};

export function InlineImageComponent({
  url,
  alt,
  width,
  height,
  position,
  nodeKey,
}: Props) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);


  const widthRef = useRef(width);
const heightRef = useRef(height);

const [size, setSize] = useState({ width, height });

  const imgRef = useRef<HTMLImageElement>(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !imgRef.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    widthRef.current = Math.max(50, widthRef.current + dx);
    heightRef.current = Math.max(50, heightRef.current + dy);
    setSize({ width: widthRef.current, height: heightRef.current }); // Optional UI update
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node instanceof InlineImageNode) {
          const newNode = $createInlineImageNode(
            node.__url,
            node.__altText,
            widthRef.current,
            heightRef.current,
            node.__position
          );
          node.replace(newNode);
        }
      });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn click lan ra ngoài
    if (!e.shiftKey) {
      clearSelection();
    }

    setSelected(true); // 


    // const newSelected = isSelected ? false : true;
    // editor.update(() => {
    //   const nodeSelection = $createNodeSelection();
    //   if (newSelected) {
    //     nodeSelection.add(nodeKey);
    //   }
    //   $setSelection(nodeSelection);
    // });
    // return newSelected;
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isNodeSelection(selection) && selection.has(nodeKey)) {
            const node = $getNodeByKey(nodeKey);
            if (node instanceof InlineImageNode) {
            console.log("DELETE DC GOI NE ")
              node.remove();
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isNodeSelection(selection) && selection.has(nodeKey)) {
            const node = $getNodeByKey(nodeKey);
            if (node instanceof InlineImageNode) {
              node.remove();
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, nodeKey]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        float: position === "left" ? "left" : position === "right" ? "right" : "none",
        margin: "8px 0",
        maxWidth: "100%",
        border: isSelected ? "2px solid #3b82f6" : "none",
        borderRadius: 4,
      }}
      onClick={handleClick}
    >
      <img
        ref={imgRef}
        src={url}
        alt={alt}
        width={size.width}
        height={size.height}
        style={{ display: "block", userSelect: "none", pointerEvents: "none" }}
      />
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 16,
          height: 16,
          background: "rgba(0,0,0,0.5)",
          cursor: "nwse-resize",
          zIndex: 10,
        }}
      />
    </div>
  );
}