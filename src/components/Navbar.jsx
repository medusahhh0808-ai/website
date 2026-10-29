import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Layers, SlidersHorizontal } from 'lucide-react';
import Dock from './reactbits/Dock';

export function Navbar({
  counts,
  activePlatform,
  onSelectPlatform,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onReset,
  isFilterOpen,
  onToggleFilter,
  activeFilterCount = 0
}) {
  // 状态 1：是否滚动进入画廊区 (进入画廊后固定常驻吸顶)
  const [isGalleryPinned, setIsGalleryPinned] = useState(false);
  // 状态 2：在 Hero 部分时，鼠标是否有活动 (鼠标移动时向下滑出)
  const [isMouseActiveInHero, setIsMouseActiveInHero] = useState(false);
  // 状态 3：鼠标是否正悬停在导航栏自身上 (悬停时不隐去)
  const [isNavHovered, setIsNavHovered] = useState(false);

  const hideTimerRef = useRef(null);

  useEffect(() => {
    // 监听页面滚动：判断是否离开 Hero 进入画廊
    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // 以视口高度的 65% 作为进入画廊的分水岭
      const heroThreshold = Math.max(480, (window.innerHeight || 800) * 0.65);
      const pinned = scrollY >= heroThreshold;
      setIsGalleryPinned(pinned);
    };

    // 监听鼠标移动：在 Hero 部分时，鼠标只要移动就滑出导航栏，停顿 2.8 秒后向上隐去
    const handleMouseMove = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroThreshold = Math.max(480, (window.innerHeight || 800) * 0.65);

      // 如果已经在画廊部分，吸顶常驻，无需触发隐去逻辑
      if (scrollY >= heroThreshold) return;

      // 在 Hero 区域内，鼠标移动，立即滑出导航栏
      setIsMouseActiveInHero(true);

      // 清除之前的定时器，重新计时 2.8 秒无操作再收回
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsMouseActiveInHero(false);
      }, 2800);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 初始化检查一次
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // 计算当前导航栏是否可见
  const isVisible = isGalleryPinned || isNavHovered || isMouseActiveInHero;

  const dockItems = [
    {
      icon: <Layers size={16} color={activePlatform === 'all' ? '#ffffff' : '#0071E3'} />,
      label: '全部灵感',
      onClick: () => onSelectPlatform('all'),
      active: activePlatform === 'all',
      badge: counts.all
    },
    {
      icon: (
        <Star
          size={16}
          fill={activePlatform === 'favorites' ? '#ffffff' : '#FF9F0A'}
          color={activePlatform === 'favorites' ? '#ffffff' : '#FF9F0A'}
        />
      ),
      label: '我的收藏',
      onClick: () => onSelectPlatform('favorites'),
      active: activePlatform === 'favorites',
      badge: counts.favorites
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={activePlatform === 'pinterest' ? '#ffffff' : '#E60023'}>
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
      label: 'Pinterest',
      onClick: () => onSelectPlatform('pinterest'),
      active: activePlatform === 'pinterest',
      badge: counts.pinterest
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={activePlatform === 'xiaohongshu' ? '#ffffff' : '#FF2442'}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.5c-.8.8-2 1-3 .8-.5.8-1.5 1.2-2.5 1-1.2-.2-2.1-1.1-2.4-2.3-.4-1.5.3-3.1 1.7-3.7-.1-.4-.1-.8 0-1.2.3-1.4 1.6-2.4 3-2.3 1.2.1 2.2 1 2.5 2.2.8.2 1.5.8 1.8 1.6.4 1.3-.1 2.8-1.1 3.9z" />
        </svg>
      ),
      label: '小红书',
      onClick: () => onSelectPlatform('xiaohongshu'),
      active: activePlatform === 'xiaohongshu',
      badge: counts.xiaohongshu
    },
    {
      icon: <SlidersHorizontal size={16} color={isFilterOpen ? '#ffffff' : '#0071E3'} />,
      label: '五维智能筛选',
      onClick: onToggleFilter,
      active: isFilterOpen,
      badge: activeFilterCount > 0 ? activeFilterCount : undefined
    }
  ];

  return (
    <header
      className={`site-header ${isGalleryPinned ? 'is-pinned' : ''} ${isVisible ? 'is-visible' : 'is-hidden'}`}
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
      role="banner"
    >
      <div className="content-container">
        <div className="header-inner" style={{ height: '72px' }}>
          {/* 左侧：品牌 Logo 与标题 */}
          <div className="brand-group" onClick={onReset} title="点击回顶部并重置视图">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v7M12 14v7M16 14v7" />
              </svg>
            </div>
            <div className="brand-title-wrap">
              <div className="brand-title">
                建筑设计灵感库
                <span className="brand-badge">VAULT</span>
              </div>
              <span className="brand-subtitle">MEDUSA ARCHITECTURAL INSPIRATION</span>
            </div>
          </div>

          {/* 中间：ReactBits Dock 动效导航栏 */}
          <div className="navbar-dock-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Dock
              inline={true}
              items={dockItems}
              theme="light"
              accentColor="#0071E3"
            />
          </div>

          {/* 右侧：全局搜索框 */}
          <div className="header-actions">
            <div className="search-input-wrap">
              <Search className="search-icon-svg" size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="搜索建筑、风格、材料..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchSubmit && onSearchSubmit();
                  }
                }}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => onSearchChange('')}
                  title="清除搜索"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
