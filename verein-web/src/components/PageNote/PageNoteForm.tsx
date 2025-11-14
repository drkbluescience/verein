import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PageNoteCategory,
  PageNotePriority,
  CategoryLabels,
  PriorityLabels,
  CategoryIcons
} from '../../types/pageNote.types';

interface PageNoteFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    category: PageNoteCategory;
    priority: PageNotePriority;
  }) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    title: string;
    content: string;
    category: PageNoteCategory;
    priority: PageNotePriority;
  };
  isEditing?: boolean;
}

/**
 * PageNote Form Component
 * Form for creating/editing page notes
 */
const PageNoteForm: React.FC<PageNoteFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['pageNotesAdmin', 'common']);
  const currentLang = i18n.language as 'de' | 'tr';

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category: initialData?.category || PageNoteCategory.General,
    priority: initialData?.priority || PageNotePriority.Medium
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category,
        priority: initialData.priority
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          title: '',
          content: '',
          category: PageNoteCategory.General,
          priority: PageNotePriority.Medium
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="page-note-form" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">{t('pageNotesAdmin:form.titleLabel')}</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={t('pageNotesAdmin:form.titlePlaceholder')}
          required
          maxLength={200}
        />
      </div>

      {/* Content */}
      <div className="form-group">
        <label htmlFor="content">{t('pageNotesAdmin:form.contentLabel')}</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={t('pageNotesAdmin:form.contentPlaceholder')}
          required
          rows={6}
        />
      </div>

      {/* Category and Priority */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">{t('pageNotesAdmin:form.categoryLabel')}</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as PageNoteCategory })}
          >
            {Object.values(PageNoteCategory).map((cat) => (
              <option key={cat} value={cat}>
                {CategoryIcons[cat]} {CategoryLabels[cat][currentLang]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">{t('pageNotesAdmin:form.priorityLabel')}</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as PageNotePriority })}
          >
            {Object.values(PageNotePriority).map((pri) => (
              <option key={pri} value={pri}>
                {PriorityLabels[pri][currentLang]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            {t('pageNotesAdmin:form.cancel')}
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || !formData.title.trim() || !formData.content.trim()}
        >
          {submitting ? t('pageNotesAdmin:form.saving') : isEditing ? t('pageNotesAdmin:form.update') : t('pageNotesAdmin:form.create')}
        </button>
      </div>
    </form>
  );
};

export default PageNoteForm;

