import { Mark, mergeAttributes } from '@tiptap/core'

export interface HighlightedKanjiOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlightedKanji: {
      setHighlightedKanji: (highlightedKanji: Set<string>) => ReturnType,
    }
  }
}

export const HighlightedKanjiMark = Mark.create<HighlightedKanjiOptions>({
  name: 'highlightedKanji',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.highlighted-kanji',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'highlighted-kanji' }), 0]
  },

  addCommands() {
    return {
      setHighlightedKanji: (highlightedKanji: Set<string>) => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.doc.descendants((node, pos) => {
            if (node.isText) {
              const text = node.text || ''
              let index = 0
              while (index < text.length) {
                const char = text[index]
                if (highlightedKanji.has(char)) {
                  const from = pos + index
                  const to = from + 1
                  tr.addMark(from, to, this.type.create())
                } else {
                  tr.removeMark(pos + index, pos + index + 1, this.type)
                }
                index++
              }
            }
          })
        }
        return true
      },
    }
  },
})
