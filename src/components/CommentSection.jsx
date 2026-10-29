import React, { useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';

export function CommentSection({ itemId, comments, onAddComment, onDeleteComment, showToast }) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim()) return;

    onAddComment(itemId, content, authorName || '访客建筑师');
    setContent('');
    showToast?.('评论发表成功！');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="comments-section-container">
      {/* 头部标题与统计 */}
      <div className="comments-header">
        <div className="comments-header-left">
          <MessageSquare size={16} color="#0071E3" />
          <span className="comments-title">设计讨论与批注</span>
          <span className="comments-count-pill">{comments.length}</span>
        </div>
      </div>

      {/* 发表评论输入框 */}
      <form className="comment-form-box" onSubmit={handleSubmit}>
        <div className="comment-input-top">
          <input
            type="text"
            className="comment-author-input"
            placeholder="昵称（选填，默认: 访客建筑师）"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={20}
          />
        </div>
        <textarea
          className="comment-textarea"
          placeholder="写下你对该方案的空间见解、材质感受或落地思考... (Ctrl+Enter 快捷发送)"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="comment-form-footer">
          <span className="comment-shortcut-hint">支持 Ctrl+Enter 快捷发送</span>
          <button
            type="submit"
            className="btn-comment-submit"
            disabled={!content.trim()}
          >
            <Send size={13} />
            <span>发表批注</span>
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty-state">
            <span>暂无设计批注，快来留下你的专业见解吧～</span>
          </div>
        ) : (
          comments.map((cmt) => (
            <div key={cmt.id} className="comment-item-card">
              <div className="comment-item-header">
                <div className="comment-user-info">
                  <div className="comment-user-avatar">
                    {(cmt.author || '访').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="comment-user-meta">
                    <span className="comment-user-name">{cmt.author}</span>
                    <span className="comment-time-text">{cmt.date}</span>
                  </div>
                </div>

                <button
                  className="btn-comment-delete"
                  onClick={() => {
                    onDeleteComment(itemId, cmt.id);
                    showToast?.('评论已删除');
                  }}
                  title="删除此评论"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="comment-body-text">{cmt.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
