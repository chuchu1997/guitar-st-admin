/** @format */

"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { Type } from "lucide-react";
import { $getRoot } from "lexical";

interface RichTextWrapperProps {
  onChange?: (val: string) => void;
  value?: string;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
}

const RichTextWrapper: React.FC<RichTextWrapperProps> = ({
  onChange,
  value,
  placeholder = "Bắt đầu viết...",
  minHeight = "200px",
  maxHeight = "400px",
}) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useLayoutEffect(() => {
    if (value && !initialized.current) {
      try {
        const parsed = JSON.parse(value);
        const newState = editor.parseEditorState(parsed);

        editor.update(() => {
          editor.setEditorState(newState);
          initialized.current = true;
        });
      } catch (err) {
        console.error("Failed to load editor state", err);
        initialized.current = true;
      }
    } else if (!value && !initialized.current) {
      initialized.current = true;
    }
  }, [value, editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const json = JSON.stringify(editorState.toJSON());
      onChange?.(json);

      // Count words and characters
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();

        // Word count
        const words = textContent
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        setWordCount(textContent.trim() === "" ? 0 : words.length);

        // Character count
        setCharCount(textContent.length);
      });
    });
  }, [editor, onChange]);

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={`
              relative p-4 outline-none resize-none
              text-gray-900 dark:text-gray-100
              prose prose-gray dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-gray-100
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20
              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
              leading-relaxed
              focus:outline-none
            `}
            style={{
              minHeight,
              maxHeight,
              overflowY: "auto",
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        }
        placeholder={
          <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none select-none">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span>{placeholder}</span>
            </div>
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />

      {/* Stats */}
      {(wordCount > 0 || charCount > 0) && (
        <div className="absolute bottom-2 right-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <span>{wordCount} từ</span>
          <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
          <span>{charCount} ký tự</span>
        </div>
      )}

      {/* Focus indicator */}
      <div
        className={`
        absolute inset-0 pointer-events-none rounded-b-xl transition-all duration-200
        ${isFocused ? "ring-2 ring-blue-400/50 ring-inset" : ""}
      `}
      />
    </div>
  );
};

export default RichTextWrapper;
