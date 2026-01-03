import React from 'react';
import './FilterChipBar.css';

export interface FilterChipOption {
  id: string;
  label: React.ReactNode;
  count?: number | string;
  icon?: React.ReactNode;
}

type FilterChipBarProps = {
  options: FilterChipOption[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

const FilterChipBar: React.FC<FilterChipBarProps> = ({ options, activeId, onSelect, className }) => {
  const rootClassName = ['filter-chip-bar', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`filter-chip${activeId === option.id ? ' active' : ''}`}
          onClick={() => onSelect(option.id)}
          aria-pressed={activeId === option.id}
        >
          {option.icon && <span className="filter-chip-icon">{option.icon}</span>}
          <span className="filter-chip-label">{option.label}</span>
          {typeof option.count !== 'undefined' && (
            <span className="filter-chip-count">{option.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterChipBar;
