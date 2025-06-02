/** @format */

import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { EmojiNode } from "../nodes/EmojiNode";
import { InlineImageNode } from "../nodes/InlineImageNode";

export const editorConfig: InitialConfigType = {
  namespace: "lexical-editor",
  theme: {
    text: {
      underline: "underline",
      italic: "italic",
      bold: "font-bold",
    },
    heading: {
      h1: "text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100",
      h2: "text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100",
      h3: "text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100",
      h4: "text-lg font-medium mb-2 text-gray-900 dark:text-gray-100",
      h5: "text-base font-medium mb-1 text-gray-900 dark:text-gray-100",
      h6: "text-sm font-medium mb-1 text-gray-900 dark:text-gray-100",
    },
    paragraph:
      "text-base mb-2 text-gray-700 dark:text-gray-300 leading-relaxed",
    quote:
      "pl-4 border-l-4 border-blue-500 italic text-gray-600 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-950/20 py-2 my-4 rounded-r-lg",
    list: {
      ul: "list-disc pl-6 mb-4 space-y-1",
      ol: "list-decimal pl-6 mb-4 space-y-1",
      listitem: "text-gray-700 dark:text-gray-300",
      nested: {
        listitem: "list-none",
      },
    },
    link: "text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors",
    code: "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono",
    codeHighlight: {
      atrule: "text-purple-600",
      attr: "text-blue-600",
      boolean: "text-orange-600",
      builtin: "text-purple-600",
      cdata: "text-gray-600",
      char: "text-green-600",
      class: "text-blue-600",
      "class-name": "text-blue-600",
      comment: "text-gray-500 italic",
      constant: "text-orange-600",
      deleted: "text-red-600",
      doctype: "text-gray-600",
      entity: "text-orange-600",
      function: "text-blue-600",
      important: "text-red-600",
      inserted: "text-green-600",
      keyword: "text-purple-600",
      namespace: "text-blue-600",
      number: "text-orange-600",
      operator: "text-gray-700",
      prolog: "text-gray-600",
      property: "text-blue-600",
      punctuation: "text-gray-700",
      regex: "text-green-600",
      selector: "text-purple-600",
      string: "text-green-600",
      symbol: "text-orange-600",
      tag: "text-red-600",
      url: "text-blue-600",
      variable: "text-orange-600",
    },
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
    EmojiNode,
    InlineImageNode,
  ],
  onError: (error: Error) => {
    console.error("Lexical Editor Error:", error);
  },
};
