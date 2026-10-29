import React, { useState, useEffect } from 'react';
import { getAssetUrl } from './PinCard';
import TechText from './reactbits/TechText';
import ImageTrail from './reactbits/ImageTrail';
import './VertexHero.css';

export function VertexHero({ items = [], onExploreClick, onOpenDetail }) {
  const [bgUrl, setBgUrl] = useState('');
  const [trailImages, setTrailImages] = useState([]);

  useEffect(() => {
    if (items && items.length > 0) {
      // 选取一张高品质宽幅建筑大图作为背景
      const wideItems = items.filter((x) => x.width >= 1000 && x.width > x.height);
      const pool = wideItems.length > 0 ? wideItems : items;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      setBgUrl(getAssetUrl(chosen.local_path, chosen.image_url));

      // 随机选取 24 张建筑灵感大图用于右侧鼠标滑动拖尾动效 (ImageTrail)
      const shuffled = [...items].sort(() => 0.5 - Math.random()).slice(0, 24);
      const urls = shuffled.map((it) => getAssetUrl(it.local_path, it.image_url)).filter(Boolean);
      setTrailImages(urls);
    }
  }, [items]);

  const handleScrollToFilters = () => {
    const el = document.getElementById('filter-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onExploreClick();
  };

  return (
    <section className="vertex-hero-container">
      {/* 1. 背景层：高精度建筑实景 + 缓慢变焦呼吸动效 + 柔和暗角 */}
      <div className="vertex-bg-wrapper">
        <div
          className="vertex-bg-photo"
          style={bgUrl ? { backgroundImage: `url("${bgUrl}")` } : {}}
        />
        <div className="vertex-bg-gradient-overlay" />
      </div>

      {/* 2. 顶部导航 */}
      <header className="vertex-top-nav">
        <div className="vertex-brand-wrap" onClick={onExploreClick} title="建筑设计灵感库">
          <div className="vertex-brand-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <span className="vertex-brand-title">Architectural Vault</span>
        </div>

        <div className="vertex-nav-capsule">
          <button className="capsule-link" onClick={onExploreClick}>
            全部灵感
          </button>
          <button className="capsule-link" onClick={handleScrollToFilters}>
            空间类型
          </button>
          <button className="capsule-link" onClick={handleScrollToFilters}>
            设计风格
          </button>
          <button className="capsule-link" onClick={handleScrollToFilters}>
            材质元素
          </button>
          <button className="capsule-pill-btn" onClick={onExploreClick}>
            探索画廊
          </button>
        </div>
      </header>

      {/* 3. 视口主体左右分栏：左侧科技文字与按钮，右侧 BounceCards 灵感卡片 */}
      <div className="vertex-hero-split-layout">
        {/* 左侧：文字与探索按钮 (左对齐，统一科技字体，动效为 TechText) */}
        <div className="vertex-hero-left-col">
          <div className="vertex-techtext-box">
            <div style={{ height: '106px', width: '100%', minWidth: '440px' }}>
              <TechText
                text="让建筑灵感"
                fontSize={82}
                fontWeight={800}
                color="#ffffff"
                accentColor="#0071E3"
                align="left"
                reach={175}
                speed={1.0}
              />
            </div>
            <div style={{ height: '106px', width: '100%', minWidth: '440px' }}>
              <TechText
                text="时刻被看见"
                fontSize={82}
                fontWeight={800}
                color="#ffffff"
                accentColor="#0071E3"
                align="left"
                reach={175}
                speed={1.0}
              />
            </div>
          </div>

          {/* 靠左放置的“立即探索”按钮 */}
          <div className="vertex-cta-row-left">
            <button className="vertex-cta-pill" onClick={onExploreClick}>
              <span>立即探索灵感画廊</span>
            </button>
          </div>

          {/* 左下角理念文案 */}
          <p className="vertex-quote-text">
            基于大模型五维深度打标解构，助你在方案构思、概念深化与汇报表达中迅速捕捉空间意图。
            从材质肌理到立面韵律，让每一个构想在此被看见。
          </p>
        </div>

        {/* 右侧：ImageTrail 动效 (鼠标滑过拖出建筑灵感图片轨迹) */}
        <div className="vertex-hero-right-col">
          {trailImages.length > 0 && (
            <div className="vertex-trail-wrapper">
              <ImageTrail
                items={trailImages}
                size={200}
                aspectRatio={1.15}
                radius={14}
                threshold={65}
                appearScale={0}
                zoom={2.2}
                flash={0.35}
                lifetime={0.45}
                drift={0.2}
                rotation={12}
                sizeVariance={0.2}
              />
              <div className="vertex-trail-interactive-hint">
                <span className="hint-pulse-dot" />
                <span>滑动鼠标 探索空间肌理</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
