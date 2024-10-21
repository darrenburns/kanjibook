import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { HighlightedKanjiMark } from '../extensions/HighlightedKanjiMark';

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
  highlightedKanji,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      HighlightedKanjiMark,
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

  useEffect(() => {
    if (editor) {
      editor.commands.setHighlightedKanji(highlightedKanji);
    }
  }, [editor, highlightedKanji]);

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

export default React.memo(Editor);
