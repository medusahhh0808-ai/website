import React, { useState, useMemo, useCallback, useRef, Suspense } from 'react';
import rawData from './data/inspirationData.json';
import { Navbar } from './components/Navbar';
import { AtriumHero } from './components/AtriumHero';
import { FilterSection, DIMENSIONS_CONFIG } from './components/FilterSection';
import { GalleryControls } from './components/GalleryControls';
import { MasonryGrid } from './components/MasonryGrid';
import { Toast } from './components/Toast';
import { useFavorites } from './hooks/useFavorites';
import { useComments } from './hooks/useComments';

// 懒加载详情弹窗，提升首屏渲染响应
const DetailModal = React.lazy(() => import('./components/DetailModal').then((m) => ({ default: m.DetailModal })));

// React Bits 动效组件
import FadeContent from './components/reactbits/FadeContent';
import Crosshair from './components/reactbits/Crosshair';

export default function App() {
  const allItems = useMemo(() => rawData.items || [], []);
  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites();
  const { getComments, addComment, deleteComment } = useComments();

  // 状态
  const [activePlatform, setActivePlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedFilters, setSelectedFilters] = useState({
    space_type: '',
    design_style: '',
    materials: '',
    color_tone: '',
    scene_usage: ''
  });
  const [modalItem, setModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 2400);
  }, []);

  const handleToggleStar = useCallback((id) => {
    const isNowStarred = toggleFavorite(id);
    showToast(isNowStarred ? '已成功加入我的收藏' : '已从收藏夹移除');
  }, [toggleFavorite, showToast]);

  // 计算五个维度的全部标签与频次
  const dimensionTags = useMemo(() => {
    const map = {
      space_type: {},
      design_style: {},
      materials: {},
      color_tone: {},
      scene_usage: {}
    };

    allItems.forEach((item) => {
      const ai = item.ai_tags || {};
      DIMENSIONS_CONFIG.forEach(({ key }) => {
        const arr = ai[key] || [];
        arr.forEach((tag) => {
          if (!tag) return;
          map[key][tag] = (map[key][tag] || 0) + 1;
        });
      });
    });

    const result = {};
    DIMENSIONS_CONFIG.forEach(({ key }) => {
      result[key] = Object.entries(map[key])
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count }));
    });
    return result;
  }, [allItems]);

  // 各平台数量统计
  const counts = useMemo(() => {
    let pinterest = 0;
    let xiaohongshu = 0;
    allItems.forEach((item) => {
      const s = (item.source || '').toLowerCase();
      if (s.includes('pinterest')) pinterest++;
      if (s.includes('小红书') || s.includes('xhs')) xiaohongshu++;
    });
    return {
      all: allItems.length,
      favorites: favoritesCount,
      pinterest,
      xiaohongshu
    };
  }, [allItems, favoritesCount]);

  // 综合筛选逻辑
  const filteredItems = useMemo(() => {
    let result = allItems;

    // 1. 平台来源筛选
    if (activePlatform === 'favorites') {
      result = result.filter((item) => isFavorite(item.id));
    } else if (activePlatform === 'pinterest') {
      result = result.filter((item) => (item.source || '').toLowerCase().includes('pinterest'));
    } else if (activePlatform === 'xiaohongshu') {
      result = result.filter((item) => (item.source || '').includes('小红书'));
    }

    // 2. 搜索过滤
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((item) => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const authorMatch = (item.author || '').toLowerCase().includes(q);
        const contentMatch = (item.content || item.raw_content || '').toLowerCase().includes(q);
        const descMatch = (item.ai_description || '').toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || authorMatch || contentMatch || descMatch || tagMatch;
      });
    }

    // 3. 五维度下拉过滤
    DIMENSIONS_CONFIG.forEach(({ key }) => {
      const targetVal = selectedFilters[key];
      if (targetVal) {
        result = result.filter((item) => {
          const list = item.ai_tags?.[key] || [];
          return list.includes(targetVal);
        });
      }
    });

    // 4. 排序处理
    const sorted = [...result];
    if (sortBy === 'likes') {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'collects') {
      sorted.sort((a, b) => (b.collects || 0) - (a.collects || 0));
    } else if (sortBy === 'random') {
      sorted.sort(() => Math.random() - 0.5);
    }

    return sorted;
  }, [allItems, activePlatform, searchQuery, selectedFilters, sortBy, isFavorite]);

  // 更新维度筛选
  const handleDimensionChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // 计算生效的五维筛选条件数量
  const activeFilterCount = useMemo(() => {
    return Object.values(selectedFilters).filter(Boolean).length;
  }, [selectedFilters]);

  // 平滑跳转并精确定位到指定区域 (精准消除顶部 72px 吸顶导航遮挡)
  const scrollToTarget = useCallback((targetId = 'gallery-section') => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(targetId) || document.getElementById('gallery-section');
        if (el) {
          const navOffset = 82; // 导航栏 72px + 10px 间距
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = Math.max(0, elementPosition - navOffset);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    });
  }, []);

  // 平台切换处理：切换过滤条件并自动平滑跳转至画廊
  const handleSelectPlatform = useCallback((platform) => {
    setActivePlatform(platform);
    scrollToTarget('gallery-section');
  }, [scrollToTarget]);

  // 展开 / 收起五维筛选面板
  const handleToggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => {
      const next = !prev;
      // 无论展开还是收起，都平滑跳转至对应画廊/筛选位置
      if (next) {
        scrollToTarget('filter-section');
      } else {
        scrollToTarget('gallery-section');
      }
      return next;
    });
  }, [scrollToTarget]);

  // 重置五维筛选
  const handleResetFilters = () => {
    setSelectedFilters({
      space_type: '',
      design_style: '',
      materials: '',
      color_tone: '',
      scene_usage: ''
    });
  };

  // 完全重置全部视图
  const handleResetAll = () => {
    setActivePlatform('all');
    setSearchQuery('');
    setSortBy('default');
    setIsFilterOpen(false);
    handleResetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 点击探索平滑滚动到画廊
  const handleExploreClick = useCallback(() => {
    scrollToTarget('gallery-section');
  }, [scrollToTarget]);

  // 搜索框回车快速直达画廊
  const handleSearchSubmit = useCallback(() => {
    scrollToTarget('gallery-section');
  }, [scrollToTarget]);

  // 模态框导航翻页
  const handleNavigateModal = (direction) => {
    if (!modalItem || filteredItems.length === 0) return;
    const currentIndex = filteredItems.findIndex((it) => it.id === modalItem.id);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = filteredItems.length - 1;
    if (nextIndex >= filteredItems.length) nextIndex = 0;

    setModalItem(filteredItems[nextIndex]);
  };

  return (
    <div className="app-root">
      {/* React Bits 动效 3: 全局鼠标移动与元素锁定 Crosshair */}
      <Crosshair
        color="#0071E3"
        thickness={1.5}
        lineStyle="solid"
        opacity={0.65}
        gap={6}
        fade={0.35}
        showCoordinates={false}
        targetEffect="lock"
        targetSelector="button, a, .pin-card, select, input, .vertex-cta-pill, .inline-dock-item, .capsule-link"
        clickPulse={true}
        smoothing={0.2}
      />

      {/* 顶部智能导航：在 Hero 中自动上浮隐去，鼠标移动时向下滑出；进入画廊后常驻固定吸顶 */}
      <Navbar
        counts={counts}
        activePlatform={activePlatform}
        onSelectPlatform={handleSelectPlatform}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onReset={handleResetAll}
        isFilterOpen={isFilterOpen}
        onToggleFilter={handleToggleFilter}
        activeFilterCount={activeFilterCount}
      />

      {/* 1. Atrium MTL Brutalist Editorial Hero 页 */}
      <AtriumHero
        items={allItems}
        onExploreClick={handleExploreClick}
        onOpenDetail={(item) => setModalItem(item)}
      />

      {/* 3. 画廊主体区域 (1700px 版心控制) */}
      <main className="content-container" id="gallery-section" style={{ paddingTop: '20px', paddingBottom: '80px' }}>
        {/* 画廊控制条 (计数、排序与五维筛选开关) */}
        <FadeContent effect="fade" duration={0.8} ease="power2.out" threshold={0.1}>
          <GalleryControls
            filteredCount={filteredItems.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isFilterOpen={isFilterOpen}
            onToggleFilter={handleToggleFilter}
            activeFilterCount={activeFilterCount}
            selectedFilters={selectedFilters}
            onClearFilter={handleDimensionChange}
          />
        </FadeContent>

        {/* 五维智能下拉筛选区：按用户要求，仅在点击五维智能筛选时才展开显示 */}
        {isFilterOpen && (
          <FadeContent effect="focus" blur={true} duration={0.5} ease="power2.out" threshold={0.05}>
            <FilterSection
              dimensionTags={dimensionTags}
              selectedFilters={selectedFilters}
              onFilterChange={handleDimensionChange}
              onResetFilters={handleResetFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </FadeContent>
        )}

        {/* 瀑布流画廊网格 (流畅毛玻璃聚焦渐显，杜绝全屏 SVG filter 掉帧卡顿) */}
        <FadeContent effect="blur" blur={6} duration={0.8} ease="power2.out" threshold={0.05}>
          <MasonryGrid
            items={filteredItems}
            isFavorite={isFavorite}
            onToggleStar={handleToggleStar}
            onOpenDetail={(item) => setModalItem(item)}
            onReset={handleResetAll}
          />
        </FadeContent>
      </main>

      {/* 详情弹窗 (Suspense 懒加载包装) */}
      {modalItem && (
        <Suspense fallback={null}>
          <DetailModal
            item={modalItem}
            onClose={() => setModalItem(null)}
            onNavigate={handleNavigateModal}
            isStarred={modalItem ? isFavorite(modalItem.id) : false}
            onToggleStar={handleToggleStar}
            comments={modalItem ? getComments(modalItem.id) : []}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            showToast={showToast}
          />
        </Suspense>
      )}

      {/* 轻量 Toast 提示 */}
      <Toast message={toastMessage} />
    </div>
  );
}
