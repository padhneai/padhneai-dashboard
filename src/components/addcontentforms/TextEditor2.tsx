"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { EditorState, LexicalEditor, Klass, LexicalNode } from "lexical";
import { FC } from "react";

// ------------------------------
// 🎨 Theme
// ------------------------------
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "my-paragraph text-gray-800 leading-7",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-200 px-1 py-0.5 rounded text-sm font-mono",
  },
  code: "bg-gray-100 border border-gray-300 p-4 my-2 rounded font-mono text-sm",
  heading: {
    h1: "text-3xl font-bold mt-6 mb-4 text-gray-900",
    h2: "text-2xl font-semibold mt-5 mb-3 text-gray-800",
    h3: "text-xl font-semibold mt-4 mb-2 text-gray-800",
  },
  link: "text-blue-600 underline cursor-pointer hover:text-blue-800",
  list: {
    ul: "list-disc list-inside my-4",
    ol: "list-decimal list-inside my-4",
    listitem: "my-1",
  },
  quote: "border-l-4 border-blue-400 pl-4 italic my-4 text-gray-700",
};

// ------------------------------
// 📝 Placeholder
// ------------------------------
const Placeholder: FC = () => {
  return (
    <div className="text-gray-500 absolute inset-0 pointer-events-none px-2 pt-2">
      Enter some rich text...
    </div>
  );
};

// ------------------------------
// 🛡️ Error Boundary (Required by RichTextPlugin)
// ------------------------------
function MyErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// ------------------------------
// ✅ Type-safe Node Definitions
// ------------------------------
const editorNodes: (Klass<LexicalNode> | { replace: Klass<LexicalNode>; with: () => LexicalNode })[] =
  [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
  ];

// ------------------------------
// ✅ Editor Config (Fully Typed)
// ------------------------------
const editorConfig = {
  namespace: "MyEditor",
  nodes: editorNodes,
  theme,
  onError: (error: Error, editor: LexicalEditor) => {
    console.error("Lexical error:", error, editor);
  },
  editable: true,
};

// ------------------------------
// 🖋️ Main Editor Component
// ------------------------------
const TextEditor2: FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="relative min-h-40 p-4">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-32 w-full px-2 pt-8" />}
            placeholder={<Placeholder />}
            ErrorBoundary={MyErrorBoundary} // ✅ Required
          />
          <AutoFocusPlugin />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default TextEditor2;