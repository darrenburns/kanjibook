import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  setSelectedText: (selectedText: string) => void;
  fontSize: number;
  highlightedKanji: Set<string>;
}

const Editor: React.FC<EditorProps> = ({
  content,
  setContent,
  setSelectedText,
  fontSize,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'preserve-whitespace',
          },
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(selectedText);
    },
  });

  useEffect(() => {
    if (editor && editor.getText() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-container w-full h-full overflow-auto">
      <EditorContent
        editor={editor}
        className="editor-content h-full"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default Editor;
