"use client";
import { useEffect, useRef, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { createPortal } from "react-dom";

const LinkEditor = () => {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const parent = node.getParent();
          const linkNode = $isLinkNode(node) ? node : $isLinkNode(parent) ? parent : null;

          if (linkNode) {
            const dom = editor.getElementByKey(linkNode.getKey());
            if (dom) {
              const rect = dom.getBoundingClientRect();
              setAnchorRect(rect);
              setLinkUrl(linkNode.getURL());
              setIsEditing(true);
            }
          } else {
            setIsEditing(false);
          }
        }
        return false;
      },
      1
    );
  }, [editor]);

  const updateLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: linkUrl,
      target: "_blank",
    });
    setIsEditing(false);
  };

  if (!isEditing || !anchorRect) return null;

  return createPortal(
    <div
      className="absolute z-50 bg-white border shadow rounded p-2"
      style={{
        top: anchorRect.bottom + window.scrollY + 5,
        left: anchorRect.left + window.scrollX,
      }}>
      <input
        className="border p-1 rounded mr-2"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded"
        onClick={updateLink}>
        Save
      </button>
    </div>,
    document.body
  );
};

export default LinkEditor;