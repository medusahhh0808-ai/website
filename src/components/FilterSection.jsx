import React from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';

export const DIMENSIONS_CONFIG = [
  { key: 'space_type', label: '空间类型', placeholder: '全部空间类型' },
  { key: 'design_style', label: '设计风格', placeholder: '全部设计风格' },
  { key: 'materials', label: '材质元素', placeholder: '全部材质元素' },
  { key: 'color_tone', label: '色调氛围', placeholder: '全部色调氛围' },
  { key: 'scene_usage', label: '场景用途', placeholder: '全部场景用途' }
];

export function FilterSection({
  dimensionTags,
  selectedFilters,
  onFilterChange,
  onResetFilters,
  onClose
}) {
  const hasActiveFilters = Object.values(selectedFilters).some(Boolean);

  return (
    <section className="filter-section-wrapper" id="filter-section">
      <div className="filter-glass-card">
        {/* 顶部标题与清除/收起按钮 */}
        <div className="filter-header-row">
          <div className="filter-header-left">
            <SlidersHorizontal size={17} color="#0071E3" />
            <h2 className="filter-title">五维 AI 智能筛选</h2>
            <span className="filter-tag-pill">AI Multimodal Tagging</span>
          </div>

          <div className="filter-header-actions">
            {hasActiveFilters && (
              <button
                className="filter-clear-btn"
                onClick={onResetFilters}
                title="重置全部五维筛选"
              >
                <RotateCcw size={13} />
                <span>清空筛选条件</span>
              </button>
            )}

            {onClose && (
              <button
                className="filter-collapse-btn"
                onClick={onClose}
                title="收起筛选面板"
              >
                <X size={14} />
                <span>收起</span>
              </button>
            )}
          </div>
        </div>

        {/* 五个下拉筛选框 */}
        <div className="dimensions-grid-row">
          {DIMENSIONS_CONFIG.map(({ key, label, placeholder }) => {
            const tagsWithCount = dimensionTags[key] || [];
            const currentValue = selectedFilters[key] || '';
            const isSelected = Boolean(currentValue);

            return (
              <div key={key} className="dim-control-unit">
                <div className="dim-unit-header">
                  <span>{label}</span>
                  <span className="dim-unit-count">({tagsWithCount.length})</span>
                </div>
                <select
                  className={`dim-select-custom ${isSelected ? 'is-active' : ''}`}
                  value={currentValue}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                >
                  <option value="">{placeholder}</option>
                  {tagsWithCount.map(({ tag, count }) => (
                    <option key={tag} value={tag}>
                      {tag} ({count})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* 已激活的筛选标签气泡 */}
        {hasActiveFilters && (
          <div className="active-filters-strip">
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>已选条件:</span>
            {DIMENSIONS_CONFIG.map(({ key, label }) => {
              const activeVal = selectedFilters[key];
              if (!activeVal) return null;
              return (
                <div key={key} className="active-chip-bubble">
                  <span className="chip-dim-prefix">{label}:</span>
                  <strong>{activeVal}</strong>
                  <button
                    className="chip-close-btn"
                    onClick={() => onFilterChange(key, '')}
                    title={`移除${label}筛选`}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
