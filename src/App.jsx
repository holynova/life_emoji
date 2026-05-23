import React, { useState } from 'react';
import StepWizard from './components/StepWizard';
import TimelineEditor from './components/TimelineEditor';
import CanvasPreview from './components/CanvasPreview';
import ThemeSelector from './components/ThemeSelector';
import { THEMES } from './presets';

const DEFAULT_WIZARD_DATA = {
  birthYear: '1998',
  gender: 'female',
  gradYear: '2020',
  workYear: '2020',
  selectedMilestones: []
};

const DEFAULT_HASHTAGS = [
  '#这些年的变化', 
  '#来时路', 
  '#那些曾经的过往', 
  '#人生有几个十年', 
  '#母胎单身'
];

export default function App() {
  const [mode, setMode] = useState('wizard'); // 'wizard' | 'editor'
  const [wizardData, setWizardData] = useState(DEFAULT_WIZARD_DATA);
  const [timeline, setTimeline] = useState([]);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState(DEFAULT_HASHTAGS);
  const [themeId, setThemeId] = useState('classic');

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

  // Generate initial timeline based on wizard responses
  const handleWizardComplete = () => {
    const birth = parseInt(wizardData.birthYear, 10) || 1998;
    const currentYear = new Date().getFullYear();
    const grad = parseInt(wizardData.gradYear, 10);
    const work = parseInt(wizardData.workYear, 10);
    
    const newTimeline = [];
    
    for (let year = birth; year <= currentYear; year++) {
      const age = year - birth;
      let baseEmoji = '👧';
      
      // Determine base emoji by age and gender
      if (wizardData.gender === 'male') {
        if (age < 3) baseEmoji = '👶';
        else if (age < 18) baseEmoji = '👦';
        else if (work && year >= work) baseEmoji = '👨‍💻'; // Working man
        else baseEmoji = '👨';
      } else {
        if (age < 3) baseEmoji = '👶';
        else if (age < 18) baseEmoji = '👧';
        else if (work && year >= work) baseEmoji = '👩‍💻'; // Working woman
        else baseEmoji = '👩';
      }

      const acquiredEmojis = [];
      let customText = '';

      // Base events mapping
      if (year === birth) {
        customText = '出生';
      }

      if (grad && year < grad && age >= 6) {
        acquiredEmojis.push('📖');
      }

      if (grad && year === grad) {
        acquiredEmojis.push('🎓');
        customText = '毕业';
      }

      if (work && year === work) {
        acquiredEmojis.push('💼');
        customText = '第一份工作';
      } else if (work && year > work) {
        acquiredEmojis.push('💼');
      }

      newTimeline.push({
        year,
        age,
        baseEmoji,
        acquiredEmojis,
        customText
      });
    }

    // Heuristically distribute other selected milestones in the last few years
    const milestones = [...wizardData.selectedMilestones];
    const emojiMap = {
      house: '🏠',
      car: '🚗',
      scooter: '🛵',
      bike: '🚲',
      money: '💰',
      love: '❤️',
      marriage: '💍',
      baby: '👶',
      cat: '🐱',
      dog: '🐶',
      license: '🪪',
      travel: '✈️',
      fitness: '🏃',
      music: '🎸',
      game: '🎮'
    };

    const textMap = {
      house: '买房',
      car: '买车',
      scooter: '买电驴',
      love: '脱单',
      marriage: '结婚',
      baby: '生娃',
      cat: '养猫',
      dog: '养狗',
      money: '暴富'
    };

    // Assign milestones to the last years (e.g. currentYear, currentYear-1, etc.)
    milestones.forEach((key, idx) => {
      const emoji = emojiMap[key];
      const text = textMap[key] || '';
      if (emoji) {
        // Distribute backwards from current year
        const targetYearIndex = newTimeline.length - 1 - (idx % 3);
        if (targetYearIndex >= 0) {
          const row = newTimeline[targetYearIndex];
          if (!row.acquiredEmojis.includes(emoji) && row.acquiredEmojis.length < 3) {
            row.acquiredEmojis.push(emoji);
            if (!row.customText && text) {
              row.customText = text;
            }
          }
        }
      }
    });

    setTimeline(newTimeline);
    setTitle(`怎么会有如此平平无奇的${newTimeline.length}年`);
    setThemeId('classic');
    setMode('editor');
    setActiveTab('preview'); // Land on preview to see the generated timeline immediately!
  };

  const handleUpdateRow = (index, updatedRow) => {
    const updated = [...timeline];
    updated[index] = updatedRow;
    setTimeline(updated);
  };

  const handleReset = () => {
    handleWizardComplete();
  };

  const handleStartOver = () => {
    setWizardData(DEFAULT_WIZARD_DATA);
    setTimeline([]);
    setTitle('');
    setHashtags(DEFAULT_HASHTAGS);
    setThemeId('classic');
    setMode('wizard');
  };

  return (
    <>
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">✨</span>
          <h1 className="app-title">Emoji Life</h1>
        </div>
        <p className="app-subtitle">生成你专属的“平平无奇”人生时间线轨迹图</p>
      </header>

      {/* Main App Grid Layout */}
      {mode === 'wizard' ? (
        <div style={{ maxWidth: '600px', margin: '20px auto 0 auto', width: '100%' }}>
          <StepWizard 
            data={wizardData}
            onChange={setWizardData}
            onComplete={handleWizardComplete}
          />
        </div>
      ) : (
        <div className="editor-layout-wrapper" style={{ width: '100%' }}>
          {/* Mobile Tabs Switcher Header */}
          <div className="mobile-tabs-header">
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              ✍️ 编辑内容
            </button>
            <button 
              type="button" 
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              🎨 预览与下载
            </button>
          </div>

          <main className="app-container">
            {/* Left panel: Timeline Editor */}
            <div className={`panel-container editor-panel ${activeTab === 'edit' ? '' : 'mobile-hidden'}`}>
              <TimelineEditor 
                timeline={timeline}
                title={title}
                setTitle={setTitle}
                hashtags={hashtags}
                setHashtags={setHashtags}
                onUpdateRow={handleUpdateRow}
                onReset={handleReset}
                onStartOver={handleStartOver}
              />
            </div>

            {/* Right panel: Canvas Preview & Theme Selection */}
            <div className={`panel-container preview-panel ${activeTab === 'preview' ? '' : 'mobile-hidden'}`}>
              <CanvasPreview 
                timeline={timeline}
                title={title}
                hashtags={hashtags}
                themeId={themeId}
              />
              
              <div className="panel" style={{ marginTop: '20px' }}>
                <ThemeSelector 
                  activeThemeId={themeId}
                  onChangeTheme={setThemeId}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* App Footer */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Emoji Life Timeline Generator. Created with ❤️ for social sharing.</p>
      </footer>
    </>
  );
}
