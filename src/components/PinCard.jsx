import React, { useState } from 'react';
import { Star, Heart, Bookmark, ExternalLink } from 'lucide-react';

export function getAssetUrl(localPath, remoteUrl) {
  if (localPath) {
    const cleanPath = localPath.replace(/\\/g, '/');
    return encodeURI('./' + cleanPath);
  }
  return remoteUrl || '';
}

export function PinCard({ item, isStarred, onToggleStar, onOpenDetail }) {
  const [imgSrc, setImgSrc] = useState(() => getAssetUrl(item.local_path, item.image_url));
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError && item.image_url && imgSrc !== item.image_url) {
      setHasError(true);
      setImgSrc(item.image_url);
    }
  };

  // 计算宽高比
  const ratio = item.aspect_ratio ? (1 / item.aspect_ratio) : (item.width && item.height ? item.width / item.height : 0.75);

  const authorInitial = (item.author || 'A').slice(0, 1).toUpperCase();
  const isPinterest = (item.source || '').toLowerCase().includes('pinterest');

  // 取 2~3 个核心 AI 标签
  const previewTags = [];
  if (item.ai_tags?.space_type?.[0]) previewTags.push(item.ai_tags.space_type[0]);
  if (item.ai_tags?.design_style?.[0]) previewTags.push(item.ai_tags.design_style[0]);
  if (item.ai_tags?.materials?.[0]) previewTags.push(item.ai_tags.materials[0]);

  return (
    <div className="pin-card" onClick={() => onOpenDetail(item)}>
      {/* 媒体展示容器 */}
      <div
        className="pin-media-box"
        style={{ aspectRatio: `${ratio}` }}
      >
        <img
          src={imgSrc}
          alt={item.title || '建筑灵感素材'}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <div className="pin-gradient-overlay" />

        {/* 来源平台徽标：默认隐藏，hover 或选到时才显示 */}
        <span className={`card-source-badge ${isPinterest ? 'badge-pinterest' : 'badge-xiaohongshu'}`}>
          {item.source || 'Pinterest'}
        </span>

        {/* 右上角操作区：收藏星标 + 原网页直达图标 */}
        <div className="card-top-actions">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-quick-action-btn"
              onClick={(e) => e.stopPropagation()}
              title="跳转原网页直达"
            >
              <ExternalLink size={15} />
            </a>
          )}

          <button
            className={`card-quick-action-btn ${isStarred ? 'is-starred' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(item.id);
            }}
            title={isStarred ? '取消收藏' : '收藏此灵感'}
          >
            <Star
              size={15}
              fill={isStarred ? '#FF9F0A' : 'none'}
              color={isStarred ? '#FF9F0A' : 'currentColor'}
            />
          </button>
        </div>
      </div>

      {/* 卡片信息区 */}
      <div className="pin-body">
        {/* 标题 */}
        <h3 className="pin-title" title={item.title}>
          {item.title || '建筑空间意图解析'}
        </h3>

        {/* AI 标签预览 */}
        {previewTags.length > 0 && (
          <div className="pin-tags-preview">
            {previewTags.map((tag) => (
              <span key={tag} className="pin-tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 卡片底栏：左下角创作者，右侧点赞与收藏数量 */}
        <div className="pin-bottom-bar">
          <div className="pin-author-row" title={`创作者: ${item.author || '建筑创作者'}`}>
            <div className="pin-author-avatar">{authorInitial}</div>
            <span className="pin-author-name">{item.author || '建筑创作者'}</span>
          </div>

          <div className="pin-metrics-group">
            <div className="pin-metric-item" title="点赞数">
              <Heart size={12.5} color="#FF3B30" />
              <span>{item.likes || 0}</span>
            </div>
            <div className="pin-metric-item" title="收藏数">
              <Bookmark size={12.5} color="#FF9F0A" />
              <span>{item.collects || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
