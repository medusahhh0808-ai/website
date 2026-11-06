import { useState, useEffect, useMemo } from 'react';

export function useMasonry(items) {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    // 列数按"版心实际可用宽度 / 目标卡片宽度"计算，避免大屏卡片被放大、小屏卡片被挤扁
    // 约：手机 1 列 | 平板 2 列 | 小笔记本 3-4 列 | 1920 大屏 5 列
    function updateColumns() {
      const width = window.innerWidth;
      const padding = width > 1200 ? 72 : width > 600 ? 40 : 32;
      const containerWidth = Math.min(width, 1700) - padding;
      const gap = width > 1200 ? 22 : 16;
      const minCardWidth = 270;
      const count = Math.floor((containerWidth + gap) / (minCardWidth + gap));
      setColumnCount(Math.max(1, Math.min(5, count)));
    }

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 动态平衡分配到各列
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    const heights = Array.from({ length: columnCount }, () => 0);

    items.forEach((item) => {
      // 找出当前最短的一列
      let minColIndex = 0;
      let minHeight = heights[0];
      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < minHeight) {
          minHeight = heights[i];
          minColIndex = i;
        }
      }

      cols[minColIndex].push(item);
      // 卡片估算高度 = 基础高度(如正文/信息 130px) + 图片高度比例(width=360, height=360 * ratio)
      const ratio = item.aspect_ratio || 1.33;
      heights[minColIndex] += 120 + Math.min(ratio * 360, 550);
    });

    return cols;
  }, [items, columnCount]);

  return { columns, columnCount };
}
