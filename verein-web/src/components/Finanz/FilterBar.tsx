/**
 * Filter Bar Component
 * Provides filtering and search functionality for claims and payments
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './FilterBar.css';

export interface FilterOptions {
  searchTerm: string;
  statusFilter: 'all' | 'paid' | 'unpaid';
  sortBy: 'date' | 'amount' | 'description';
  sortOrder: 'asc' | 'desc';
  dateRange: 'all' | 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear';
}

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  showStatusFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, showStatusFilter = true }) => {
  const { t } = useTranslation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, statusFilter: e.target.value as FilterOptions['statusFilter'] });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] });
  };

  const handleSortOrderChange = () => {
    onFilterChange({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] });
  };

  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      statusFilter: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      dateRange: 'all',
    });
  };

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="filter-group search-group">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder={t('finanz:filters.searchPlaceholder')}
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
          {filters.searchTerm && (
            <button
              className="clear-search"
              onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      {showStatusFilter && (
        <div className="filter-group">
          <label htmlFor="status-filter">{t('finanz:filters.status')}</label>
          <select
            id="status-filter"
            className="filter-select"
            value={filters.statusFilter}
            onChange={handleStatusChange}
          >
            <option value="all">{t('finanz:filters.allStatus')}</option>
            <option value="unpaid">{t('finanz:filters.unpaid')}</option>
            <option value="paid">{t('finanz:filters.paid')}</option>
          </select>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="filter-group">
        <label htmlFor="date-range">{t('finanz:filters.dateRange')}</label>
        <select
          id="date-range"
          className="filter-select"
          value={filters.dateRange}
          onChange={handleDateRangeChange}
        >
          <option value="all">{t('finanz:filters.allTime')}</option>
          <option value="thisMonth">{t('finanz:filters.thisMonth')}</option>
          <option value="lastMonth">{t('finanz:filters.lastMonth')}</option>
          <option value="last3Months">{t('finanz:filters.last3Months')}</option>
          <option value="last6Months">{t('finanz:filters.last6Months')}</option>
          <option value="thisYear">{t('finanz:filters.thisYear')}</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="filter-group">
        <label htmlFor="sort-by">{t('finanz:filters.sortBy')}</label>
        <div className="sort-controls">
          <select
            id="sort-by"
            className="filter-select"
            value={filters.sortBy}
            onChange={handleSortByChange}
          >
            <option value="date">{t('finanz:filters.date')}</option>
            <option value="amount">{t('finanz:filters.amount')}</option>
            <option value="description">{t('finanz:filters.description')}</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={handleSortOrderChange}
            aria-label="Toggle sort order"
            title={filters.sortOrder === 'asc' ? t('finanz:filters.ascending') : t('finanz:filters.descending')}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button className="reset-filters-btn" onClick={handleReset}>
        {t('finanz:filters.reset')}
      </button>
    </div>
  );
};

// Search Icon Component
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export default FilterBar;

