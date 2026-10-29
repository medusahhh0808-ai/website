import { useState, useEffect, useMemo } from 'react';

export function useMasonry(items) {
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    function updateColumns() {
      const width = window.innerWidth;
      if (width >= 1600) {
        setColumnCount(4); // 1700px 版心下 4 列宽幅卡片，极具设计呼吸感
      } else if (width >= 1200) {
        setColumnCount(4);
      } else if (width >= 860) {
        setColumnCount(3);
      } else if (width >= 560) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
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
