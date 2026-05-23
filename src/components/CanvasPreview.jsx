import React, { useEffect, useRef, useState } from 'react';
import { THEMES } from '../presets';

export default function CanvasPreview({ timeline, title, hashtags, themeId }) {
  const canvasRef = useRef(null);
  const [showAge, setShowAge] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    drawCanvas();
  }, [timeline, title, hashtags, themeId, showAge]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 1. Calculate dynamic height based on number of years
    const scale = 2; // Retina scaling
    const baseWidth = 500; // Display width
    const lineGap = 35; // Vertical spacing per year
    const topPadding = 60;
    const timelineHeight = timeline.length * lineGap;
    const bottomPadding = 180; // Space for title & hashtags
    const baseHeight = topPadding + timelineHeight + bottomPadding;

    // Set canvas dimensions with scale for high-DPI screens
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.scale(scale, scale);

    // 2. Render background
    if (theme.bgType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
      gradient.addColorStop(0, theme.gradientColors[0]);
      gradient.addColorStop(1, theme.gradientColors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = theme.background;
    }
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // 3. Draw timeline items
    ctx.textBaseline = 'middle';
    
    // Choose font family
    const fontStr = theme.font;
    
    timeline.forEach((row, index) => {
      const y = topPadding + (index * lineGap);

      // We align the columns neatly by using a base X offset and drawing segments
      // Let's center the block of text on the canvas
      // Approximate block width: Year(50px) + Emojis(80px) + Text(100px) ~ 230px
      // So start X at center minus ~ 110px
      const startX = baseWidth / 2 - 100;

      // Draw Year
      ctx.font = `600 18px ${fontStr}`;
      ctx.fillStyle = theme.text;
      ctx.textAlign = 'left';
      ctx.fillText(`${row.year}`, startX, y);

      // Measure year width to position next elements
      const yearWidth = ctx.measureText(`${row.year}`).width;
      let currentX = startX + yearWidth + 8;

      // Draw Age if enabled
      if (showAge) {
        ctx.font = `400 13px ${fontStr}`;
        ctx.fillStyle = theme.id === 'classic' || theme.id === 'journal' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.6)';
        const ageStr = `${row.age}岁`;
        ctx.fillText(ageStr, currentX, y);
        currentX += ctx.measureText(ageStr).width + 8;
      }

      // Draw Emojis (Base protagonist + Acquired items)
      ctx.font = `18px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      const emojis = [row.baseEmoji, ...row.acquiredEmojis].join('');
      ctx.fillText(emojis, currentX, y);

      const emojiWidth = ctx.measureText(emojis).width;
      currentX += emojiWidth + 6;

      // Draw custom text (if any) in brackets
      if (row.customText) {
        ctx.font = `italic 400 13px ${fontStr}`;
        ctx.fillStyle = theme.id === 'classic' || theme.id === 'journal' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.65)';
        ctx.fillText(`(${row.customText})`, currentX, y);
      }
    });

    // 4. Draw Divider (optional, subtle line above bottom text)
    const dividerY = topPadding + timelineHeight + 20;
    ctx.strokeStyle = theme.id === 'classic' || theme.id === 'journal' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, dividerY);
    ctx.lineTo(baseWidth - 35, dividerY);
    ctx.stroke();

    // 5. Draw Bottom Text (Title and Hashtags)
    const contentStartY = dividerY + 30;

    // Draw Title
    ctx.font = `bold 20px ${fontStr}`;
    ctx.fillStyle = theme.text;
    ctx.textAlign = 'left';
    
    // Handle title wrap if it's too long
    const maxTitleWidth = baseWidth - 70;
    const titleText = title || `怎么会有如此平平无奇的${timeline.length}年`;
    
    // Draw Title
    ctx.fillText(titleText, 35, contentStartY);

    // Draw Hashtags
    ctx.font = `500 13px ${fontStr}`;
    ctx.fillStyle = theme.id === 'classic' ? theme.accent : theme.text;
    if (theme.id !== 'classic') {
      ctx.fillStyle = theme.id === 'journal' ? 'rgba(74, 62, 61, 0.8)' : 'rgba(255,255,255,0.8)';
    }

    const tagsText = hashtags.join(' ');
    
    // Wrap hashtags if they exceed canvas width
    let currentTagY = contentStartY + 28;
    const words = tagsText.split(' ');
    let line = '';
    
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      
      if (testWidth > maxTitleWidth && n > 0) {
        ctx.fillText(line, 35, currentTagY);
        line = words[n] + ' ';
        currentTagY += 18;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 35, currentTagY);

    // 6. Draw small watermark/app link at the very bottom
    ctx.font = `10px ${fontStr}`;
    ctx.fillStyle = theme.id === 'classic' || theme.id === 'journal' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText('Generated by EmojiLife', baseWidth - 35, baseHeight - 15);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `emoji-life-timeline-${timeline[0].year}-${timeline[timeline.length - 1].year}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyText = () => {
    // Generate text output matching the visual structure
    const yearsText = timeline.map(row => {
      const emojis = [row.baseEmoji, ...row.acquiredEmojis].join('');
      const brackets = row.customText ? `(${row.customText})` : '';
      return `${row.year} ${emojis}${brackets}`;
    }).join('\n');

    const titleText = title || `怎么会有如此平平无奇的${timeline.length}年`;
    const hashtagsText = hashtags.join(' ');
    
    const fullText = `${yearsText}\n\n${titleText}\n${hashtagsText}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="panel" style={{ height: 'auto' }}>
      <div className="editor-header" style={{ marginBottom: '15px' }}>
        <h2 className="step-title">图片预览</h2>
        {/* Toggle show age */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <input 
            type="checkbox" 
            checked={showAge} 
            onChange={(e) => setShowAge(e.target.checked)}
            style={{ accentColor: 'var(--color-accent)' }}
          />
          显示年龄
        </label>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>
      
      <p className="preview-tip">长按上方图片可直接保存，或使用下方按钮下载</p>

      <div className="preview-actions">
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleDownload}
          style={{ width: '100%' }}
        >
          📥 下载高清图片 (PNG)
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleCopyText}
          style={{ width: '100%' }}
        >
          {copied ? '✅ 已复制到剪贴板！' : '📋 复制文本格式 (发帖用)'}
        </button>
      </div>
    </div>
  );
}
