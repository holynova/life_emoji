import React from 'react';
import { THEMES } from '../presets';

export default function ThemeSelector({ activeThemeId, onChangeTheme }) {
  return (
    <div className="form-group" style={{ width: '100%' }}>
      <label className="form-label">图片风格 / 视觉主题</label>
      <div className="themes-grid">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeThemeId;
          const bgStyle = theme.bgType === 'gradient' 
            ? { background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})` }
            : { backgroundColor: theme.background };
          
          return (
            <div
              key={theme.id}
              className={`theme-card ${isActive ? 'active' : ''}`}
              style={{
                ...bgStyle,
                color: theme.text,
                border: isActive ? '2px solid var(--color-accent)' : '2px solid rgba(255,255,255,0.05)',
                textShadow: theme.textShadow || 'none'
              }}
              onClick={() => onChangeTheme(theme.id)}
            >
              <div style={{ fontWeight: 600 }}>{theme.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
