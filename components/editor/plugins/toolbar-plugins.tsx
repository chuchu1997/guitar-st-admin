/** @format */

"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Smile,
  CameraIcon,
} from "lucide-react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $getRoot,
  TextFormatType,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { createEmptyHistoryState } from "@lexical/history";
import ImagePickerDialog from "@/components/modals/image-picker";
import { INSERT_INLINE_IMAGE_COMMAND } from "./InlineImagePlugin";

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[36px] h-9
      ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
      }
      ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-gray-900 dark:hover:text-gray-200"
      }
    `}>
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
);

const ToolbarPlugins = () => {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [historyState] = useState(() => createEmptyHistoryState());
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Text formats
          const formats = new Set<string>();
          if (selection.hasFormat("bold")) formats.add("bold");
          if (selection.hasFormat("italic")) formats.add("italic");
          if (selection.hasFormat("underline")) formats.add("underline");
          if (selection.hasFormat("code")) formats.add("code");
          setActiveFormats(formats);

          // Block type
          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          if ($isHeadingNode(element)) {
            setBlockType(element.getTag());
          } else if ($isListNode(element)) {
            setBlockType(element.getListType() === "bullet" ? "ul" : "ol");
          } else {
            setBlockType(element.getType());
          }
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    const updateToolbar = () => {
      setCanUndo(historyState.undoStack.length > 0);
      setCanRedo(historyState.redoStack.length > 0);
    };

    const unregisterListener = editor.registerUpdateListener(updateToolbar);
    updateToolbar();

    return unregisterListener;
  }, [editor, historyState]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const insertList = (type: "bullet" | "number") => {
    if (type === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="w-[300px] overflow-x-scroll md:w-full md:overflow-hidden flex items-center gap-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-lg">
      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={undo}
          disabled={!canUndo}
          title="Hoàn tác (Ctrl+Z)">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={redo}
          disabled={!canRedo}
          title="Làm lại (Ctrl+Y)">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* Block Types */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={formatParagraph}
          isActive={blockType === "paragraph"}
          title="Đoạn văn">
          <Type className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatHeading("h1")}
          isActive={blockType === "h1"}
          title="Tiêu đề 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatHeading("h2")}
          isActive={blockType === "h2"}
          title="Tiêu đề 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatHeading("h3")}
          isActive={blockType === "h3"}
          title="Tiêu đề 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => formatText("bold")}
          isActive={activeFormats.has("bold")}
          title="Đậm (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatText("italic")}
          isActive={activeFormats.has("italic")}
          title="Nghiêng (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatText("underline")}
          isActive={activeFormats.has("underline")}
          title="Gạch chân (Ctrl+U)">
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => formatText("code")}
          isActive={activeFormats.has("code")}
          title="Code (Ctrl+`)">
          <Code className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* Lists & Blocks */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => insertList("bullet")}
          isActive={blockType === "ul"}
          title="Danh sách dấu đầu dòng">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList("number")}
          isActive={blockType === "ol"}
          title="Danh sách đánh số">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={formatQuote}
          isActive={blockType === "quote"}
          title="Trích dẫn">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* Special */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => {
            /* Handle emoji picker */
          }}
          title="Emoji">
          <Smile className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            /* Handle emoji picker */
            setImageDialogOpen(true);
          }}
          title="📷 Thêm hình ảnh">
          <CameraIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <ImagePickerDialog
        open={isImageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={(url, position) => {
          editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, {
            url,
            position,
          });
        }}
      />
    </div>
  );
};

export default ToolbarPlugins;
