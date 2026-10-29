import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAssetUrl } from './PinCard';
import TechText from './reactbits/TechText';
import './AtriumHero.css';

function AtriumPhotoCard({ slot, onClick }) {
  const localUrl = slot?.url || '';
  const remoteUrl = slot?.item?.image_url || '';
  const [imgSrc, setImgSrc] = useState(localUrl || remoteUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(slot?.url || slot?.item?.image_url || '');
    setHasError(false);
  }, [slot?.url, slot?.item?.image_url]);

  const handleImageError = () => {
    if (!hasError && remoteUrl && imgSrc !== remoteUrl) {
      setHasError(true);
      setImgSrc(remoteUrl);
    }
  };

  return (
    <div
      className="atrium-cell ph atrium-dynamic-ph"
      onClick={onClick}
      title="点击查看建筑灵感详情"
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={slot?.item?.title || '建筑灵感素材'}
          className="atrium-cell-img"
          loading="eager"
          decoding="async"
          onError={handleImageError}
        />
      ) : null}
    </div>
  );
}

export function AtriumHero({ items = [], onExploreClick, onOpenDetail }) {
  const gridRef = useRef(null);

  // 1. 从灵感库中随机挑选优质真实建筑图片填入右侧马赛克
  const chosenItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    // 随机乱序取前 12 张图片
    const pool = [...items].sort(() => 0.5 - Math.random());
    return pool.slice(0, 12);
  }, [items]);

  // 解析出 URL 列表
  const photoUrls = useMemo(() => {
    return chosenItems.map((it) => ({
      url: getAssetUrl(it.local_path, it.image_url),
      item: it
    }));
  }, [chosenItems]);

  // 导航跳转辅助函数
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onExploreClick) {
      onExploreClick();
    }
  };

  // 获取特定槽位的图片与 item
  const getSlot = (index) => {
    if (photoUrls.length === 0) return { url: '', item: null };
    return photoUrls[index % photoUrls.length];
  };

  const handleCardClick = (slotIdx) => {
    const slot = getSlot(slotIdx);
    if (slot && slot.item && onOpenDetail) {
      onOpenDetail(slot.item);
    } else {
      scrollToSection('gallery-section');
    }
  };

  return (
    <section className="atrium-hero-section">
      {/* 左侧巨型文字排版：大标题采用 React Bits TechText 科技矢量动效 */}
      <main className="atrium-hero-left">
        <div className="atrium-title-badge">
          <span>AI-POWERED ARCHITECTURAL ARCHIVE</span>
        </div>

        <div className="atrium-techtext-title-wrap">
          <div className="atrium-techtext-line">
            <TechText
              text="让建筑灵感"
              fontFamily='"Archivo", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, sans-serif'
              fontWeight={900}
              fontSize={100}
              letterSpacing={0.02}
              align="left"
              color="#0f0f0e"
              accentColor="#0071E3"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              clickKick={true}
              draggable={true}
              guides={false}
              sweep={true}
              speed={1}
            />
          </div>
          <div className="atrium-techtext-line">
            <TechText
              text="时刻被看见"
              fontFamily='"Archivo", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, sans-serif'
              fontWeight={900}
              fontSize={100}
              letterSpacing={0.02}
              align="left"
              color="#0f0f0e"
              accentColor="#0071E3"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              clickKick={true}
              draggable={true}
              guides={false}
              sweep={true}
              speed={1}
            />
          </div>
        </div>

        <p className="atrium-desc">
          基于大模型五维深度打标解构，涵盖<strong>空间类型、设计风格、材质元素、色调氛围与场景用途</strong>，助你在方案构思、概念深化与汇报表达中迅速捕捉空间意图。从材质肌理到立面韵律，让每一个构想在此被看见。
        </p>

        {/* 仅保留立即探索按钮 */}
        <div className="atrium-acts">
          <button className="atrium-tickets-pill atrium-hero-cta-btn" onClick={() => scrollToSection('gallery-section')}>
            立即探索
          </button>
        </div>
      </main>

      {/* 3. 右侧连续无缝滚动马赛克：保留色卡 + 真实建筑图片 */}
      <div className="atrium-grid" ref={gridRef} aria-hidden="false">
        {/* Column 1 (colDown 向下滚动) */}
        <div className="atrium-col c1">
          {[0, 1].map((iteration) => (
            <React.Fragment key={iteration}>
              <div className="atrium-cell red" />
              <AtriumPhotoCard slot={getSlot(0)} onClick={() => handleCardClick(0)} />
              <AtriumPhotoCard slot={getSlot(1)} onClick={() => handleCardClick(1)} />
              <div className="atrium-cell blue" />
              <AtriumPhotoCard slot={getSlot(2)} onClick={() => handleCardClick(2)} />
            </React.Fragment>
          ))}
        </div>

        {/* Column 2 (colUp 向上滚动) */}
        <div className="atrium-col c2">
          {[0, 1].map((iteration) => (
            <React.Fragment key={iteration}>
              <div className="atrium-cell yellow" />
              <AtriumPhotoCard slot={getSlot(3)} onClick={() => handleCardClick(3)} />
              <div className="atrium-cell dark" />
              <AtriumPhotoCard slot={getSlot(4)} onClick={() => handleCardClick(4)} />
              <div className="atrium-cell red" />
            </React.Fragment>
          ))}
        </div>

        {/* Column 3 (colDown 向下滚动) */}
        <div className="atrium-col c3">
          {[0, 1].map((iteration) => (
            <React.Fragment key={iteration}>
              <div className="atrium-cell blue" />
              <div className="atrium-cell cream" />
              <AtriumPhotoCard slot={getSlot(5)} onClick={() => handleCardClick(5)} />
              <div className="atrium-cell yellow" />
              <AtriumPhotoCard slot={getSlot(6)} onClick={() => handleCardClick(6)} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AtriumHero;
