import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star, Heart, Bookmark, Copy, ExternalLink, Check } from 'lucide-react';
import { getAssetUrl } from './PinCard';
import { CommentSection } from './CommentSection';

export function DetailModal({
  item,
  onClose,
  onNavigate,
  isStarred,
  onToggleStar,
  comments = [],
  onAddComment,
  onDeleteComment,
  showToast
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (item) {
      setIsZoomed(false);
      setCopied(false);
      setImgError(false);
      setImgSrc(getAssetUrl(item.local_path, item.image_url));
    }
  }, [item]);

  // 键盘快捷键监听
  useEffect(() => {
    function handleKeyDown(e) {
      if (!item) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(-1);
      } else if (e.key === 'ArrowRight') {
        onNavigate(1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onNavigate]);

  if (!item) return null;

  const handleCopyPrompt = async () => {
    const textToCopy = item.raw_content || item.content || item.title || '';
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('设计笔记已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('复制失败，请手动选择复制');
    }
  };

  const author = item.author || '建筑创作者';
  const authorInitial = author.slice(0, 1).toUpperCase();
  const isPinterest = (item.source || '').toLowerCase().includes('pinterest');

  // AI 描述
  const critiqueText = item.ai_description || item.ai_tags?.image_description || '该方案展现出鲜明的空间形态与材质肌理，具备良好的建筑方案参考价值。';

  // 原始笔记内容
  const rawNotes = item.raw_content && item.raw_content !== '无正文' && item.raw_content !== item.title ? item.raw_content : (item.content || '');

  // 维度标签
  const aiTags = item.ai_tags || {};
  const spaceTypes = aiTags.space_type || [];
  const designStyles = aiTags.design_style || [];
  const materials = aiTags.materials || [];
  const sceneUsages = aiTags.scene_usage || [];
  const colorTones = aiTags.color_tone || [];

  return (
    <div className="modal-backdrop-layer" onClick={onClose}>
      <div className="modal-apple-card" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className="modal-close-round" onClick={onClose} title="关闭 (Esc)">
          <X size={18} />
        </button>

        {/* 左右翻页按钮 */}
        <button
          className="modal-nav-arrow prev"
          onClick={() => onNavigate(-1)}
          title="上一张 (←)"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="modal-nav-arrow next"
          onClick={() => onNavigate(1)}
          title="下一张 (→)"
        >
          <ChevronRight size={22} />
        </button>

        {/* 弹窗左侧：高分辨率原图视口 */}
        <div className="modal-preview-left">
          <div
            className={`modal-viewport-box ${isZoomed ? 'is-zoomed' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? '点击还原' : '点击放大查看细节'}
          >
            <img
              className="modal-main-image"
              src={imgSrc}
              alt={item.title || '建筑细节大图'}
              onError={() => {
                if (!imgError && item.image_url) {
                  setImgError(true);
                  setImgSrc(item.image_url);
                }
              }}
            />
          </div>

          <div className="modal-preview-footer">
            <span>
              {item.width && item.height ? `${item.width} × ${item.height} px` : '高精度原图'}
            </span>
            <span>{isZoomed ? '点击图片缩小' : '点击图片可放大查看'}</span>
            <span style={{ opacity: 0.7 }}>{item.filename || ''}</span>
          </div>
        </div>

        {/* 弹窗右侧：灵感资料档案 */}
        <div className="modal-dossier-right">
          <div className="dossier-scroll-area">
            {/* 顶部平台与收藏星标 */}
            <div className="dossier-header-bar">
              <div className="dossier-header-left">
                <span
                  className="modal-platform-badge"
                  style={{
                    backgroundColor: isPinterest ? '#E60023' : '#FF2442'
                  }}
                >
                  {item.source || 'Pinterest'}
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                  {item.date || '2026-10-28'}
                </span>
              </div>

              <button
                className={`modal-star-btn ${isStarred ? 'is-starred' : ''}`}
                onClick={() => onToggleStar(item.id)}
                title={isStarred ? '已收藏' : '加入收藏'}
              >
                <Star
                  size={18}
                  fill={isStarred ? '#FF9F0A' : 'none'}
                  color={isStarred ? '#FF9F0A' : 'currentColor'}
                />
              </button>
            </div>

            {/* 标题 */}
            <h2 className="dossier-title">{item.title || '建筑方案灵感'}</h2>

            {/* 创作者信息 */}
            <div className="author-clean-box">
              <div className="author-profile-left">
                <div className="author-circle-avatar">{authorInitial}</div>
                <div>
                  <div className="author-name-bold">{author}</div>
                  <div className="author-source-gray">{item.source || 'Pinterest'} 创作者</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                ID: {item.id}
              </span>
            </div>

            {/* 点赞与收藏指标 */}
            <div className="metrics-row-apple">
              <div className="metric-chip-card">
                <Heart size={16} color="#FF3B30" />
                <div className="metric-data-wrap">
                  <span className="val">{item.likes || 0}</span>
                  <span className="lbl">点赞</span>
                </div>
              </div>
              <div className="metric-chip-card">
                <Bookmark size={16} color="#FF9F0A" />
                <div className="metric-data-wrap">
                  <span className="val">{item.collects || 0}</span>
                  <span className="lbl">收藏</span>
                </div>
              </div>
            </div>

            {/* AI 空间形态与立面解析 */}
            <div className="architectural-critique-card">
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                AI 空间特征与设计解析
              </div>
              <p>{critiqueText}</p>
            </div>

            {/* 五维结构化建筑特征 */}
            <div className="attributes-list-block">
              {spaceTypes.length > 0 && (
                <div className="attr-row-item">
                  <span className="attr-row-label">空间类型:</span>
                  <div className="attr-chips-list">
                    {spaceTypes.map((t) => (
                      <span key={t} className="attr-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {designStyles.length > 0 && (
                <div className="attr-row-item">
                  <span className="attr-row-label">设计风格:</span>
                  <div className="attr-chips-list">
                    {designStyles.map((t) => (
                      <span key={t} className="attr-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {materials.length > 0 && (
                <div className="attr-row-item">
                  <span className="attr-row-label">材质元素:</span>
                  <div className="attr-chips-list">
                    {materials.map((t) => (
                      <span key={t} className="attr-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {sceneUsages.length > 0 && (
                <div className="attr-row-item">
                  <span className="attr-row-label">场景用途:</span>
                  <div className="attr-chips-list">
                    {sceneUsages.map((t) => (
                      <span key={t} className="attr-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {colorTones.length > 0 && (
                <div className="attr-row-item">
                  <span className="attr-row-label">色调氛围:</span>
                  <div className="attr-chips-list">
                    {colorTones.map((t) => (
                      <span key={t} className="attr-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 灵感笔记与提示词 */}
            {rawNotes && (
              <div className="notes-section-clean">
                <div className="notes-header-flex">
                  <span className="notes-title-text">设计笔记与原描述</span>
                  <button className="btn-copy-apple" onClick={handleCopyPrompt}>
                    {copied ? <Check size={12} color="#34C759" /> : <Copy size={12} />}
                    <span>{copied ? '已复制' : '复制内容'}</span>
                  </button>
                </div>
                <div className="notes-text-content">{rawNotes}</div>
              </div>
            )}

            {/* 用户评论与设计批注区 */}
            <CommentSection
              itemId={item.id}
              comments={comments}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              showToast={showToast}
            />
          </div>

          {/* 底部固定操作条 */}
          <div className="modal-sticky-bottom-bar">
            <button
              className={`btn-bottom-fav ${isStarred ? 'is-starred' : ''}`}
              onClick={() => onToggleStar(item.id)}
            >
              <Star
                size={16}
                fill={isStarred ? '#FF9F0A' : 'none'}
                color={isStarred ? '#FF9F0A' : 'currentColor'}
              />
              <span>{isStarred ? '已加入我的收藏' : '加入我的收藏'}</span>
            </button>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bottom-origin"
              >
                <span>跳转原网页直达</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
