import { Mark, mergeAttributes } from "@tiptap/core"

export const PlaceholderExtension = Mark.create({
  name: "placeholder",

  addAttributes() {
    return {
      key: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-placeholder-key]",
        getAttrs: (node) => {
          const key = node.getAttribute("data-placeholder-key")
          return key ? { key } : false
        },
      },
    ]
  },

  renderHTML({ attributes = {} }) {
    const key = attributes?.key || 'placeholder'
    return [
      "span",
      mergeAttributes(
        {
          "data-placeholder-key": key,
          class: "bg-primary/20 text-primary px-2 py-1 rounded font-medium",
        },
        this.options?.HTMLAttributes || {},
      ),
      `{{${key}}}`,
    ]
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-p": () => {
        const placeholder = window.prompt("Enter placeholder key (e.g., client.name):")
        if (placeholder) {
          return this.editor
            .chain()
            .focus()
            .insertContent(`<span data-placeholder-key="${placeholder}">{{${placeholder}}}</span> `)
            .run()
        }
        return false
      },
    }
  },
})
