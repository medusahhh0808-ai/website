import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAssetUrl } from './PinCard';
import TechText from './reactbits/TechText';
import './AtriumHero.css';

const SLOT_COUNT = 7;          // 右侧马赛克中的照片槽位数
const ROTATE_INTERVAL = 2000; // 每 2 秒替换一张照片

// 预加载一张图片：本地图优先，失败再试远程图；都失败返回 null
function preloadImage(item) {
  const candidates = [getAssetUrl(item.local_path, item.image_url), item.image_url].filter(
    (u, i, arr) => u && arr.indexOf(u) === i
  );
  return new Promise((resolve) => {
    const tryNext = (idx) => {
      if (idx >= candidates.length) return resolve(null);
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(candidates[idx]);
      img.onerror = () => tryNext(idx + 1);
      img.src = candidates[idx];
    };
    tryNext(0);
  });
}

// 照片卡片：新图加载完成后叠在旧图上方淡入，切换时不闪白
function AtriumPhotoCard({ slot, onClick }) {
  const src = slot?.url || '';
  const [layers, setLayers] = useState(() => ({ prev: '', cur: src }));

  useEffect(() => {
    setLayers((l) => (l.cur === src ? l : { prev: l.cur, cur: src }));
  }, [src]);

  return (
    <div
      className="atrium-cell ph atrium-dynamic-ph"
      onClick={onClick}
      title="点击查看建筑灵感详情"
    >
      {layers.prev ? (
        <img src={layers.prev} alt="" aria-hidden="true" className="atrium-cell-img atrium-cell-img-prev" />
      ) : null}
      {layers.cur ? (
        <img
          key={layers.cur}
          src={layers.cur}
          alt={slot?.item?.title || '建筑灵感素材'}
          className={`atrium-cell-img ${layers.prev ? 'atrium-cell-img-in' : ''}`}
          loading="eager"
          decoding="async"
        />
      ) : null}
    </div>
  );
}

export function AtriumHero({ items = [], onExploreClick, onOpenDetail }) {
  const gridRef = useRef(null);

  // 1. 随机打乱素材池（只在首次加载时打乱一次）
  const pool = useMemo(() => {
    const withImage = (items || []).filter((it) => it.local_path || it.image_url);
    return [...withImage].sort(() => 0.5 - Math.random());
  }, [items]);

  // 2. 每个槽位当前展示的 { url, item }；先用前几张已加载成功的图填满
  const [slots, setSlots] = useState([]);
  const slotsRef = useRef([]);
  slotsRef.current = slots;
  const nextIndexRef = useRef(0);
  const isHoveringRef = useRef(false);
  const lastSlotRef = useRef(-1);

  // 从素材池中取下一张能成功加载、且当前没在展示的图
  const takeNext = async (exclude) => {
    for (let tries = 0; tries < Math.min(pool.length, 12); tries++) {
      const item = pool[nextIndexRef.current % pool.length];
      nextIndexRef.current += 1;
      if (exclude.has(item.id)) continue;
      const url = await preloadImage(item);
      if (url) return { url, item };
    }
    return null;
  };

  useEffect(() => {
    if (pool.length === 0) return undefined;
    let cancelled = false;
    nextIndexRef.current = 0;

    (async () => {
      const initial = [];
      const used = new Set();
      for (let i = 0; i < SLOT_COUNT; i++) {
        const s = await takeNext(used);
        if (!s) break;
        used.add(s.item.id);
        initial.push(s);
        if (!cancelled) setSlots([...initial]);
      }
    })();

    // 3. 自动轮换：每 2 秒随机替换一个槽位；页面不可见、鼠标停在图墙上或系统要求减少动效时暂停
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busy = false;
    const timer = reduceMotion
      ? null
      : setInterval(async () => {
          if (busy || document.hidden || isHoveringRef.current) return;
          busy = true;
          try {
            let slotIdx = Math.floor(Math.random() * SLOT_COUNT);
            if (slotIdx === lastSlotRef.current) slotIdx = (slotIdx + 1) % SLOT_COUNT;
            lastSlotRef.current = slotIdx;
            const shown = new Set(slotsRef.current.map((s) => s?.item?.id));
            const next = await takeNext(shown);
            if (next && !cancelled) {
              setSlots((prev) => {
                if (slotIdx >= prev.length) return prev;
                const copy = [...prev];
                copy[slotIdx] = next;
                return copy;
              });
            }
          } finally {
            busy = false;
          }
        }, ROTATE_INTERVAL);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  // 导航跳转辅助函数
  const scrollToSection = (id = 'gallery-section') => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 82;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: 'smooth'
      });
    }
  };

  // 获取特定槽位的图片与 item
  const getSlot = (index) => {
    if (slots.length === 0) return { url: '', item: null };
    return slots[index % slots.length] || slots[0];
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
      <div
        className="atrium-grid"
        ref={gridRef}
        aria-hidden="false"
        onMouseEnter={() => { isHoveringRef.current = true; }}
        onMouseLeave={() => { isHoveringRef.current = false; }}
      >
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
