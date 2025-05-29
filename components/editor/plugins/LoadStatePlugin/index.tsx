import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type Props = {
  initialEditorState: string;
};

export default function LoadEditorStatePlugin({ initialEditorState }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialEditorState) {
      const parsed = JSON.parse(initialEditorState);
      const newEditorState = editor.parseEditorState(parsed);
      editor.setEditorState(newEditorState);
    }
  }, [editor, initialEditorState]);

  return null;
}