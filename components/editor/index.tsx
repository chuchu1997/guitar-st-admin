/** @format */

"use client";

import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import InitialEditorState from "@/lib/editor-state.json";
import ToolbarPlugins from "@/components/editor/plugins/toolbar-plugins";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useEffect, useState } from "react";
import EmojisPlugin from "./plugins/EmojisPlugin";
import { EmojiNode } from "./nodes/EmojiNode";
import { InlineImageNode } from "./nodes/InlineImageNode";
import { InlineImagePlugin } from "./plugins/InlineImagePlugin";
// ✅ Child component to read editor content
import LinkPlugin from "./plugins/LinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import LinkEditor from "./plugins/LinkEditor";
import { PreventLinkOpenPlugin } from "./plugins/PreventLinkPlugin";
import LoadEditorStatePlugin from "./plugins/LoadStatePlugin";
import RichTextWrapper from "./editor-wrapper";

interface EditorInterface {
  value?: string; // serialized JSON string
  onChange?: (content: string) => void;
}

const EditorComponent: React.FC<EditorInterface> = ({ value, onChange }) => {
  // const SaveButton = () => {
  //   const [editor] = useLexicalComposerContext();
  //   const handleClick = useCallback(() => {
  //     editor.update(async () => {
  //       const editorState = editor.getEditorState();
  //       const serialized = editorState.toJSON();
  //       const saveJSONString = JSON.stringify(serialized, null, 2);
  //       onSave(saveJSONString);
  //     });
  //   }, [editor]);

  //   return (
  //     <div className="px-8 pb-4">
  //       <Button onClick={handleClick}>Lưu Nội Dung </Button>
  //     </div>
  //   );
  // };

  const config: InitialConfigType = {
    namespace: "lexical-editor",

    theme: {
      text: {
        underline: "underline",
        italic: "italic",
        bold: "font-bold",
      },
      heading: {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-semibold",
        h3: "text-xl font-semibold",
        h4: "text-lg font-medium",
        h5: "text-base font-medium",
        h6: "text-sm font-medium",
      },
      paragraph: "text-base", // optional
      quote: "pl-4 border-l-4 border-gray-300 italic text-gray-600", // optional
      list: {
        ul: "list-disc pl-5",
        ol: "list-decimal pl-5",
        listitem: "mb-1",
      },
      link: "text-blue-600 underline cursor-pointer",
    },

    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      EmojiNode,
      InlineImageNode,
    ],

    // editorState: JSON.stringify(InitialEditorState),

    onError: (error) => {
      console.error(error);
    },
  };
  const [mounted, setMounted] = useState(false);
  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LexicalComposer initialConfig={config}>
      <div className="mx-auto relative prose dark:prose-invert flex flex-col mt-10 border shadow rounded-lg">
        {/* Toolbar */}
        <ToolbarPlugins />
        <div className="relative">
          {/* THIS IS CUSTOM RICH TEXT */}
          <RichTextWrapper onChange={onChange} value={value} />
          {/* THIS IS CUSTOM RICH TEXT */}

          <HistoryPlugin />
        </div>
        <InlineImagePlugin />
        <ListPlugin />
        <LinkPlugin />
        <EmojisPlugin />
        <ClickableLinkPlugin />
        <LinkEditor /> {/* Custom component để chỉnh sửa link */}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        {/* ✅ Save button inside LexicalComposer */}
        {/* {initialEditorState && (
          <LoadEditorStatePlugin initialEditorState={initialEditorState} />
        )}
        <SaveButton /> */}
      </div>
    </LexicalComposer>
  );
};

export default EditorComponent;
