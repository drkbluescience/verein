import React, { useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { useTranslation } from 'react-i18next';
import { AvailablePlaceholders } from '../../types/brief.types';
import './TiptapEditor.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Mektup içeriğinizi buraya yazın...',
  editable = true,
  minHeight = '300px'
}) => {
  const { i18n } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link' },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle.configure({}),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const insertPlaceholder = useCallback((placeholderKey: string) => {
    if (editor) {
      editor.chain().focus().insertContent(placeholderKey).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor-container" style={{ '--min-height': minHeight } as React.CSSProperties}>
      <MenuBar 
        editor={editor} 
        onInsertPlaceholder={insertPlaceholder}
        onAddImage={addImage}
        onSetLink={setLink}
        language={i18n.language}
      />
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
};

interface MenuBarProps {
  editor: Editor;
  onInsertPlaceholder: (key: string) => void;
  onAddImage: () => void;
  onSetLink: () => void;
  language: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  editor, 
  onInsertPlaceholder, 
  onAddImage, 
  onSetLink,
  language 
}) => {
  const [showPlaceholders, setShowPlaceholders] = React.useState(false);

  return (
    <div className="tiptap-menu-bar">
      {/* Text Formatting */}
      <div className="menu-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''} title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''} title="Underline">
          <u>U</u>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''} title="Strikethrough">
          <s>S</s>
        </button>
      </div>

      {/* Headings */}
      <div className="menu-group">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} title="Heading 1">
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} title="Heading 3">
          H3
        </button>
      </div>

      {/* Lists */}
      <div className="menu-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''} title="Bullet List">
          •
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''} title="Ordered List">
          1.
        </button>
      </div>

      {/* Alignment */}
      <div className="menu-group">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} title="Align Left">
          ⬅
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} title="Align Center">
          ⬌
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''} title="Align Right">
          ➡
        </button>
      </div>

      {/* Links & Images */}
      <div className="menu-group">
        <button type="button" onClick={onSetLink}
          className={editor.isActive('link') ? 'is-active' : ''} title="Add Link">
          🔗
        </button>
        <button type="button" onClick={onAddImage} title="Add Image">
          🖼️
        </button>
      </div>

      {/* Placeholders */}
      <div className="menu-group placeholder-group">
        <button type="button" onClick={() => setShowPlaceholders(!showPlaceholders)}
          className={showPlaceholders ? 'is-active' : ''} title="Insert Placeholder">
          {'{{}}'}
        </button>
        {showPlaceholders && (
          <div className="placeholder-dropdown">
            {AvailablePlaceholders.map((p) => (
              <button key={p.key} type="button"
                onClick={() => { onInsertPlaceholder(p.key); setShowPlaceholders(false); }}>
                <span className="placeholder-key">{p.key}</span>
                <span className="placeholder-label">{p.label[language as 'de' | 'tr'] || p.label.de}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="menu-group">
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          title="Text Color" className="color-picker" />
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''} title="Highlight">
          🖍️
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="menu-group">
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()} title="Undo">
          ↩
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()} title="Redo">
          ↪
        </button>
      </div>
    </div>
  );
};

export default TiptapEditor;

