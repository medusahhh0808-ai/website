import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'medusa_arch_vault_comments';

export function useComments() {
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(commentsMap));
    } catch (e) {
      console.error('Failed to save comments to localStorage:', e);
    }
  }, [commentsMap]);

  const getComments = useCallback(
    (itemId) => commentsMap[itemId] || [],
    [commentsMap]
  );

  const addComment = useCallback((itemId, content, author = '访客建筑师') => {
    if (!itemId || !content.trim()) return null;

    const newComment = {
      id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      author: author.trim() || '灵感探索者',
      content: content.trim(),
      date: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      likes: 0
    };

    setCommentsMap((prev) => {
      const existing = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: [newComment, ...existing]
      };
    });

    return newComment;
  }, []);

  const deleteComment = useCallback((itemId, commentId) => {
    setCommentsMap((prev) => {
      const existing = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: existing.filter((c) => c.id !== commentId)
      };
    });
  }, []);

  return { getComments, addComment, deleteComment };
}
