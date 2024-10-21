import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  setSelectedText: (selectedText: string) => void;
  fontSize: number;
  highlightedKanji: Set<string>;
}

const HighlightKanji = Extension.create({
  name: 'highlightKanji',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          highlightedKanji: {
            default: null,
            parseHTML: element => element.getAttribute('data-highlighted-kanji'),
            renderHTML: attributes => {
              if (!attributes.highlightedKanji) {
                return {};
              }
              return {
                'data-highlighted-kanji': attributes.highlightedKanji,
                class: 'highlighted-kanji',
              };
            },
          },
        },
      },
    ];
  },
});

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
    extensions: [StarterKit, HighlightKanji],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getText();
      setContent(newContent);
      setEditorContent(newContent);
    },
    onSelectionUpdate: handleSelectionUpdate,
  });

  useEffect(() => {
    if (editor && editorContent !== content) {
      const kanjiRegex = /[\u4e00-\u9faf]/g;
      const highlightedContent = content.replace(kanjiRegex, (kanji) => {
        if (highlightedKanji.has(kanji)) {
          return `<span data-highlighted-kanji="true">${kanji}</span>`;
        }
        return kanji;
      });
      editor.commands.setContent(highlightedContent);
    }
  }, [content, highlightedKanji, editor, editorContent]);

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
