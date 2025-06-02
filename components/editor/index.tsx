/** @format */

"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { TRANSFORMERS } from "@lexical/markdown";
import { useEffect, useState } from "react";

// Config
import { editorConfig } from "./config/editor-config";

// Components
import RichTextWrapper from "./editor-wrapper";

// Plugins
import {
  HistoryPlugin,
  ListPlugin,
  MarkdownShortcutPlugin,
  ClickableLinkPlugin,
  ToolbarPlugins,
  EmojisPlugin,
  InlineImagePlugin,
  LinkPlugin,
  LinkEditor,
  PreventLinkOpenPlugin,
} from "./plugins";

interface EditorInterface {
  value?: string; // serialized JSON string
  onChange?: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

const EditorComponent: React.FC<EditorInterface> = ({
  value,
  onChange,
  placeholder = "Bắt đầu viết...",
  minHeight = "200px",
  maxHeight = "400px",
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`animate-pulse border border-gray-200 dark:border-gray-700 rounded-xl h-64 bg-gray-50 dark:bg-gray-800 ${className}`}>
        <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={`mx-auto relative flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl overflow-hidden bg-white dark:bg-gray-900 ${className}`}>
        {/* Toolbar */}
        <ToolbarPlugins />

        {/* Editor Content */}
        <div className="relative flex-1">
          <RichTextWrapper
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            minHeight={minHeight}
            maxHeight={maxHeight}
          />

          {/* Core Plugins */}
          <HistoryPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

          {/* Custom Plugins */}
          <InlineImagePlugin />
          <LinkPlugin />
          <EmojisPlugin />
          <ClickableLinkPlugin />
          <LinkEditor />
          <PreventLinkOpenPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default EditorComponent;
