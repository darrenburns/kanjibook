import React, { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { HighlightedKanjiMark } from '../extensions/HighlightedKanjiMark';
import { open } from '@tauri-apps/plugin-shell';

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
  const editorRef = useRef<HTMLDivElement>(null);

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
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;

    if (modifierKey && editor) {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );

      if (selectedText) {
        let url = '';
        const isKanji = selectedText.length === 1 && /[\u4e00-\u9faf]/.test(selectedText);

        switch (event.key.toLowerCase()) {
          case 'j':
            event.preventDefault();
            url = isKanji
              ? `https://jisho.org/search/${encodeURIComponent(selectedText)}%20%23kanji`
              : `https://jisho.org/search/${encodeURIComponent(selectedText)}`;
            open(url);
            break;
          case 'p':
            event.preventDefault();
            url = isKanji
              ? `https://jpdb.io/kanji/${encodeURIComponent(selectedText)}`
              : `https://jpdb.io/search?q=${encodeURIComponent(selectedText)}`;
            open(url);
            break;
          case 'w':
            event.preventDefault();
            url = isKanji
              ? `https://www.wanikani.com/kanji/${encodeURIComponent(selectedText)}`
              : `https://www.wanikani.com/search?query=${encodeURIComponent(selectedText)}`;
            open(url);
            break;
          case 'l':
            event.preventDefault();
            setExplanation('Loading explanation...');
            onAskAI(selectedText);
            break;
        }
      }
    }
  }, [editor, setExplanation, onAskAI]);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('keydown', handleKeyDown);
      return () => {
        editorElement.removeEventListener('keydown', handleKeyDown);
      };
    }
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
    <div ref={editorRef} className="editor-container w-full h-full overflow-auto">
      <EditorContent
        editor={editor}
        className="editor-content h-full"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default React.memo(Editor);
