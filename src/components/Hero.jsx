import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import { getAssetUrl } from './PinCard';

export function Hero({ items, totalCount, onExploreClick }) {
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    if (items && items.length > 0) {
      // 随机选取一张高分辨率大图作为背景，或者优先选择横构图/大幅建筑图
      const randomIndex = Math.floor(Math.random() * items.length);
      const chosen = items[randomIndex];
      const url = getAssetUrl(chosen.local_path, chosen.image_url);
      setBgUrl(url);
    }
  }, [items]);

  return (
    <section
      className="hero-section dark-hero"
      style={bgUrl ? { backgroundImage: `url("${bgUrl}")` } : {}}
    >
      {/* 黑色半透明蒙版层 */}
      <div className="hero-dark-overlay" />

      {/* 建筑网格辅助轻微叠加 */}
      <div className="hero-bg-grid-dark" />

      <div className="hero-content">
        <div className="hero-badge-capsule-dark">
          <Sparkles size={14} color="#60A5FA" />
          <span>AI 驱动的多模态建筑设计知识库</span>
        </div>

        <h1 className="hero-main-title-dark">
          让建筑灵感 时刻被看见
        </h1>

        <p className="hero-sub-title-dark">
          汇聚全球精选先锋建筑、景观空间与细部构造。基于大模型多维度深度打标解构，
          助你在方案构思、概念深化与汇报表达中迅速捕捉空间意图。
        </p>

        <div className="hero-cta-group">
          <button className="btn-hero-primary" onClick={onExploreClick}>
            <Compass size={17} />
            <span>立即探索灵感画廊</span>
          </button>
        </div>

        {/* 关键数据统计 */}
        <div className="hero-stats-row-dark">
          <div className="hero-stat-item">
            <span className="hero-stat-num-dark">{totalCount || 150}</span>
            <span className="hero-stat-label-dark">收录精选方案</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num-dark">5</span>
            <span className="hero-stat-label-dark">AI 解构维度</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num-dark">150+</span>
            <span className="hero-stat-label-dark">空间特征标签</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num-dark">100%</span>
            <span className="hero-stat-label-dark">高清大图与解析</span>
          </div>
        </div>
      </div>

      {/* 向下滚动指示 */}
      <div className="hero-scroll-indicator-dark" onClick={onExploreClick} title="向下滑动查看画廊">
        <span>向下探索</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
