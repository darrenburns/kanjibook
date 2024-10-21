import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

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
  const [editorContent, setEditorContent] = useState(content);

  const handleSelectionUpdate = useCallback(({ editor }) => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    setSelectedText(selectedText);
  }, [setSelectedText]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getText();
      setContent(newContent);
      setEditorContent(newContent);
    },
    onSelectionUpdate: handleSelectionUpdate,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
      
      // Remove all existing highlights
      editor.commands.unsetHighlight();

      // Apply new highlights
      const kanjiRegex = /[\u4e00-\u9faf]/g;
      let match;
      while ((match = kanjiRegex.exec(content)) !== null) {
        const kanji = match[0];
        if (highlightedKanji.has(kanji)) {
          const start = match.index + 1;
          const end = start + 1;
          editor.chain().focus().setTextSelection({ from: start, to: end })
            .setHighlight({ color: '#fce7f3' })
            .run();
        }
      }
      
      // Reset selection and focus
      editor.commands.setTextSelection(0);
      editor.commands.blur();
    }
  }, [content, highlightedKanji, editor]);

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
