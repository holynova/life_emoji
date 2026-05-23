import React, { useState } from 'react';
import { EMOJI_PRESETS } from '../presets';

export default function TimelineEditor({ 
  timeline, 
  title, 
  setTitle, 
  hashtags, 
  setHashtags, 
  onUpdateRow, 
  onReset, 
  onStartOver 
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newHashtag, setNewHashtag] = useState('');
  
  // Custom annotation text for editing modal
  const [tempCustomText, setTempCustomText] = useState('');
  const [tempAcquiredEmojis, setTempAcquiredEmojis] = useState([]);
  const [tempBaseEmoji, setTempBaseEmoji] = useState('');

  const startEdit = (index) => {
    setEditingIndex(index);
    const row = timeline[index];
    setTempCustomText(row.customText || '');
    setTempAcquiredEmojis(row.acquiredEmojis || []);
    setTempBaseEmoji(row.baseEmoji || '👧');
  };

  const saveEdit = () => {
    onUpdateRow(editingIndex, {
      ...timeline[editingIndex],
      customText: tempCustomText,
      acquiredEmojis: tempAcquiredEmojis,
      baseEmoji: tempBaseEmoji
    });
    setEditingIndex(null);
  };

  const toggleEmojiInTemp = (emoji) => {
    if (tempAcquiredEmojis.includes(emoji)) {
      setTempAcquiredEmojis(tempAcquiredEmojis.filter(e => e !== emoji));
    } else {
      // Limit to 3 acquired emojis to prevent overflow
      if (tempAcquiredEmojis.length < 3) {
        setTempAcquiredEmojis([...tempAcquiredEmojis, emoji]);
      }
    }
  };

  const handleAddHashtag = (e) => {
    e.preventDefault();
    if (newHashtag.trim()) {
      const tag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="panel">
      <div className="editor-header">
        <h2 className="step-title">编辑经历</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} onClick={onReset}>重置</button>
          <button type="button" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} onClick={onStartOver}>重做问卷</button>
        </div>
      </div>

      {/* Title & Caption Settings */}
      <div className="step-container" style={{ gap: '15px', marginBottom: '20px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="timeline-title">底部文案（主标题）</label>
          <input 
            id="timeline-title"
            type="text" 
            className="input-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：怎么会有如此平平无奇的28年"
          />
        </div>

        {/* Hashtags section */}
        <div className="form-group">
          <label className="form-label" htmlFor="timeline-hashtag">社交标签 (Hashtags)</label>
          <form onSubmit={handleAddHashtag} className="custom-input-row">
            <input 
              id="timeline-hashtag"
              type="text" 
              className="input-text" 
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              placeholder="添加标签，如：#这些年的变化"
              style={{ flexGrow: 1, padding: '10px 14px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>添加</button>
          </form>
          <div className="hashtag-list" style={{ marginTop: '8px' }}>
            {hashtags.map((tag) => (
              <span key={tag} className="hashtag-badge">
                {tag}
                <button type="button" onClick={() => handleRemoveHashtag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Rows List */}
      <div className="timeline-list">
        {timeline.map((row, index) => (
          <div key={row.year} className="timeline-row">
            <span className="row-year">{row.year}年</span>
            <span className="row-age">{row.age}岁</span>
            <div className="row-content" onClick={() => startEdit(index)}>
              <div className="row-emoji-display">
                <span>{row.baseEmoji}</span>
                {row.acquiredEmojis.map((e, idx) => <span key={idx}>{e}</span>)}
              </div>
              {row.customText && (
                <span className="row-text-display">({row.customText})</span>
              )}
            </div>
            <button 
              type="button" 
              className="row-edit-btn" 
              onClick={() => startEdit(index)}
              title="编辑此年"
            >
              ✏️
            </button>
          </div>
        ))}
      </div>

      {/* Edit Year Modal Overlay */}
      {editingIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">
              <span>编辑 {timeline[editingIndex].year} 年 ({timeline[editingIndex].age} 岁)</span>
              <button type="button" className="close-btn" onClick={() => setEditingIndex(null)}>×</button>
            </div>

            {/* Base Protagonist Icon Tweak */}
            <div className="form-group">
              <label className="form-label">基础形象 (主角)</label>
              <div className="emoji-selector-row">
                {['👶', '👧', '👦', '👩', '👨', '👩‍💻', '👨‍💻', '👵', '👴'].map(e => (
                  <div 
                    key={e} 
                    className={`emoji-option ${tempBaseEmoji === e ? 'selected' : ''}`}
                    onClick={() => setTempBaseEmoji(e)}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Acquired Items Selection */}
            <div className="form-group">
              <label className="form-label">这一年获得了什么？(最多可选3个)</label>
              <div className="preset-categories-accordion">
                {EMOJI_PRESETS.map((category) => (
                  <div key={category.category}>
                    <div className="preset-category-title">{category.category}</div>
                    <div className="preset-category-row">
                      {category.items.map((item) => {
                        const isSelected = tempAcquiredEmojis.includes(item.emoji);
                        return (
                          <button
                            key={item.key}
                            type="button"
                            className={`btn-preset-mini ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleEmojiInTemp(item.emoji)}
                          >
                            <span>{item.emoji}</span>
                            <span>{item.label.split('/')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom bracket commentary */}
            <div className="form-group">
              <label className="form-label" htmlFor="bracket-text">括号备注文案 (选填，如“牛马”或“买房成为房奴”)</label>
              <input 
                id="bracket-text"
                type="text" 
                className="input-text" 
                value={tempCustomText}
                onChange={(e) => setTempCustomText(e.target.value)}
                placeholder="例如：牛马"
              />
            </div>

            <div className="wizard-actions" style={{ marginTop: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flexGrow: 1 }} 
                onClick={() => setEditingIndex(null)}
              >
                取消
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ flexGrow: 2 }} 
                onClick={saveEdit}
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
