import React, { useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { useTranslation } from 'react-i18next';
import './TiptapEditor.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export interface TiptapEditorRef {
  insertText: (text: string) => void;
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(({
  content,
  onChange,
  placeholder = 'Mektup içeriğinizi buraya yazın...',
  editable = true,
  minHeight = '300px'
}, ref) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['common', 'briefe']);
  const initialContentRef = useRef(content);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Link and Underline are already included in StarterKit v3
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
    content: initialContentRef.current,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes (e.g., when editing existing brief)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && content !== initialContentRef.current) {
      editor.commands.setContent(content);
      initialContentRef.current = content;
    }
  }, [content, editor]);

  // Expose insertText function to parent component
  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (editor) {
        editor.chain().focus().insertContent(text).run();
      }
    }
  }), [editor]);

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

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleLinkCancel = useCallback(() => {
    setShowLinkModal(false);
    setLinkUrl('');
  }, []);

  const handleRemoveLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkModal(false);
    setLinkUrl('');
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor-container" style={{ '--min-height': minHeight } as React.CSSProperties}>
      <MenuBar
        editor={editor}
        onAddImage={addImage}
        onSetLink={openLinkModal}
      />
      <EditorContent editor={editor} className="tiptap-editor-content" />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="link-modal-overlay" onClick={handleLinkCancel}>
          <div className="link-modal" onClick={e => e.stopPropagation()}>
            <div className="link-modal-header">
              <h3>{t('briefe:editor.insertLink')}</h3>
              <button className="link-modal-close" onClick={handleLinkCancel}>×</button>
            </div>
            <div className="link-modal-body">
              <label htmlFor="link-url">{t('briefe:editor.linkUrl')}</label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleLinkSubmit();
                  if (e.key === 'Escape') handleLinkCancel();
                }}
              />
            </div>
            <div className="link-modal-actions">
              {linkUrl && (
                <button type="button" className="btn-danger-outline" onClick={handleRemoveLink}>
                  {t('briefe:editor.removeLink')}
                </button>
              )}
              <div className="link-modal-actions-right">
                <button type="button" className="btn-secondary" onClick={handleLinkCancel}>
                  {t('common:actions.cancel')}
                </button>
                <button type="button" className="btn-primary" onClick={handleLinkSubmit}>
                  {t('common:actions.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

interface MenuBarProps {
  editor: Editor;
  onAddImage: () => void;
  onSetLink: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  onAddImage,
  onSetLink
}) => {
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

