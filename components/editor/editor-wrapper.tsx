

import { startTransition, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";



const RichTextWrapper = ({
    onChange,
    value,
  }: {
    onChange?: (val: string) => void;
    value?: string;
  }) => {
    const [editor] = useLexicalComposerContext();
    const initialized = useRef(false);

    useEffect(() => {
      if (value && !initialized.current) {
        if (value && !initialized.current) {
          try {
            const parsed = JSON.parse(value);
            const newState = editor.parseEditorState(parsed);
      
            // Dùng React startTransition để tránh lỗi flushSync
            if (value && !initialized.current) {
              const parsed = JSON.parse(value);
              const newState = editor.parseEditorState(parsed);
              editor.update(() => {
                editor.setEditorState(newState);
                initialized.current = true;
              });
              // Dùng animation frame để đảm bảo editor đã render xong
           
            }
          } catch (err) {
            console.error("Failed to load editor state", err);
          }
        }
      }
      }, [value, editor]);

      useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
          const json = JSON.stringify(editorState.toJSON());
          onChange?.(json);
        });
              /// BẤT KỲ GIÁ TRỊ NÀO THAY ĐỔI CONVERT JSON TO STRING VÀ LƯU

      }, [editor, onChange]);
  
 
    return (
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[150px] border rounded-md p-2" />
        }
        placeholder={<div className="p-2 text-muted-foreground">Mô tả...</div>}
            ErrorBoundary={LexicalErrorBoundary as any}
      />
    );
  };


  export default RichTextWrapper;