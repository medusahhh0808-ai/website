import React from 'react';
import { PinCard } from './PinCard';
import { useMasonry } from '../hooks/useMasonry';

export function MasonryGrid({ items, isFavorite, onToggleStar, onOpenDetail, onReset }) {
  const { columns } = useMasonry(items);

  if (items.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon">🏛️</div>
        <h3 className="empty-title">未找到相关素材</h3>
        <p className="empty-desc">
          当前筛选与搜索组合下未匹配到建筑图片，建议调整标签或重置筛选。
        </p>
        <button
          className="btn-hero-primary"
          style={{ padding: '8px 20px', fontSize: '13.5px' }}
          onClick={onReset}
        >
          重置全部筛选
        </button>
      </div>
    );
  }

  return (
    <div className="masonry-layout-grid">
      {columns.map((colItems, colIndex) => (
        <div key={colIndex} className="masonry-col-unit">
          {colItems.map((item) => (
            <PinCard
              key={item.id}
              item={item}
              isStarred={isFavorite(item.id)}
              onToggleStar={onToggleStar}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
