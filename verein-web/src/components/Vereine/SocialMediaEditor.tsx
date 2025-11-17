import React, { useState, useEffect } from 'react';
import { SocialMediaData } from './SocialMediaLinks';
import './SocialMediaEditor.css';

interface SocialMediaEditorProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
}

const SocialMediaEditor: React.FC<SocialMediaEditorProps> = ({ 
  value, 
  onChange,
  label = 'Sosyal Medya Hesapları'
}) => {
  const [socialMedia, setSocialMedia] = useState<SocialMediaData>({});

  // Parse initial value
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        setSocialMedia(parsed);
      } catch (error) {
        console.error('Error parsing social media links:', error);
        setSocialMedia({});
      }
    }
  }, [value]);

  const handleChange = (platform: keyof SocialMediaData, url: string) => {
    const updated = {
      ...socialMedia,
      [platform]: url || undefined, // Remove empty strings
    };

    // Remove undefined values
    Object.keys(updated).forEach(key => {
      if (!updated[key as keyof SocialMediaData]) {
        delete updated[key as keyof SocialMediaData];
      }
    });

    setSocialMedia(updated);
    onChange(JSON.stringify(updated));
  };

  const platforms = [
    { 
      key: 'facebook' as const, 
      label: 'Facebook', 
      placeholder: 'https://facebook.com/dernek-adi',
      icon: '📘'
    },
    { 
      key: 'instagram' as const, 
      label: 'Instagram', 
      placeholder: 'https://instagram.com/dernek_adi',
      icon: '📷'
    },
    { 
      key: 'twitter' as const, 
      label: 'X (Twitter)', 
      placeholder: 'https://twitter.com/dernek_adi',
      icon: '🐦'
    },
    { 
      key: 'linkedin' as const, 
      label: 'LinkedIn', 
      placeholder: 'https://linkedin.com/company/dernek-adi',
      icon: '💼'
    },
    { 
      key: 'youtube' as const, 
      label: 'YouTube', 
      placeholder: 'https://youtube.com/@dernek-adi',
      icon: '📺'
    },
  ];

  return (
    <div className="social-media-editor">
      {label && <label className="editor-label">{label}</label>}
      <div className="social-inputs">
        {platforms.map(({ key, label, placeholder, icon }) => (
          <div key={key} className="social-input-group">
            <label className="input-label">
              <span className="platform-icon">{icon}</span>
              {label}
            </label>
            <input
              type="url"
              className="social-input"
              placeholder={placeholder}
              value={socialMedia[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <p className="editor-hint">
        💡 Sosyal medya hesaplarınızın tam URL'lerini girin (örn: https://facebook.com/dernek-adi)
      </p>
    </div>
  );
};

export default SocialMediaEditor;

