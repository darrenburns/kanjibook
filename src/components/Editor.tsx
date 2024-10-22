import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { HighlightedKanjiMark } from '../extensions/HighlightedKanjiMark';
import { explainText } from '../utils/claudeApi';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  setSelectedText: (selectedText: string) => void;
  fontSize: number;
  highlightedKanji: Set<string>;
  setExplanation: (explanation: string) => void;
  onAskAI: (selectedText: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  content,
  setContent,
  setSelectedText,
  fontSize,
  highlightedKanji,
  setExplanation,
  onAskAI,
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.metaKey && event.key === 'l' && editor) {
      event.preventDefault();
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );
      if (selectedText) {
        setExplanation('Loading explanation...');
        onAskAI(selectedText);
      }
    }
  }, [editor, setExplanation, onAskAI]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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
