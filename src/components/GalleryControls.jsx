import React from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { DIMENSIONS_CONFIG } from './FilterSection';

export function GalleryControls({
  filteredCount,
  sortBy,
  onSortChange,
  isFilterOpen,
  onToggleFilter,
  activeFilterCount = 0,
  selectedFilters = {},
  onClearFilter
}) {
  return (
    <div className="gallery-control-strip" id="gallery-controls">
      <div className="gallery-control-left">
        <div className="gallery-count-text">
          <span>呈现 </span>
          <strong>{filteredCount}</strong>
          <span> 件精选灵感</span>
        </div>

        {/* 五维筛选快捷切换胶囊按钮 */}
        <button
          className={`gallery-filter-toggle-btn ${isFilterOpen ? 'is-active' : ''}`}
          onClick={onToggleFilter}
          title={isFilterOpen ? '收起五维智能筛选' : '展开五维智能筛选'}
        >
          <SlidersHorizontal size={14} />
          <span>五维智能筛选</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
          {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* 当面板收起但有生效筛选时，在控制条直接展示迷你胶囊 */}
        {!isFilterOpen && activeFilterCount > 0 && (
          <div className="compact-active-filters">
            {DIMENSIONS_CONFIG.map(({ key, label }) => {
              const val = selectedFilters[key];
              if (!val) return null;
              return (
                <span key={key} className="compact-filter-chip">
                  <span className="compact-chip-label">{label}:</span>
                  <strong>{val}</strong>
                  {onClearFilter && (
                    <button
                      className="compact-chip-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearFilter(key, '');
                      }}
                      title={`清除${label}条件`}
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="gallery-sort-wrap">
        <label htmlFor="sortSelect" style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
          排序方式:
        </label>
        <select
          id="sortSelect"
          className="sort-select-clean"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">最新入库</option>
          <option value="likes">点赞最高</option>
          <option value="collects">收藏最多</option>
          <option value="random">随机漫游</option>
        </select>
      </div>
    </div>
  );
}
