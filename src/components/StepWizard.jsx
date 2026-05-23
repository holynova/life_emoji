import React, { useState } from 'react';
import { GENDER_OPTIONS, EMOJI_PRESETS } from '../presets';

export default function StepWizard({ data, onChange, onComplete }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const currentYear = new Date().getFullYear();

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleMilestoneToggle = (itemKey) => {
    const activeMilestones = data.selectedMilestones || [];
    if (activeMilestones.includes(itemKey)) {
      updateField('selectedMilestones', activeMilestones.filter(k => k !== itemKey));
    } else {
      updateField('selectedMilestones', [...activeMilestones, itemKey]);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      const birth = parseInt(data.birthYear, 10);
      return birth >= 1950 && birth <= currentYear && data.gender;
    }
    if (step === 2) {
      const grad = parseInt(data.gradYear, 10);
      const birth = parseInt(data.birthYear, 10);
      // Allow grad year to be empty or valid
      if (!data.gradYear) return true;
      return grad > birth && grad <= currentYear + 6;
    }
    if (step === 3) {
      const work = parseInt(data.workYear, 10);
      const birth = parseInt(data.birthYear, 10);
      if (!data.workYear) return true;
      return work > birth && work <= currentYear;
    }
    return true;
  };

  return (
    <div className="panel">
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div 
          className="wizard-progress-bar" 
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`progress-dot ${step === i ? 'active' : step > i ? 'completed' : ''}`}
          >
            {step > i ? '✓' : i}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="step-container">
          <div>
            <h2 className="step-title">基本信息</h2>
            <p className="app-subtitle">让我们先了解一下你的基本生命轨迹起点</p>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="birth-year">出生年份</label>
            <input 
              id="birth-year"
              type="number" 
              className="input-text"
              min="1950" 
              max={currentYear}
              value={data.birthYear || ''}
              onChange={(e) => updateField('birthYear', e.target.value)}
              placeholder="例如 1998"
            />
          </div>

          <div className="form-group">
            <label className="form-label">性别（用于决定人像Emoji）</label>
            <div className="gender-select-grid">
              {GENDER_OPTIONS.map((opt) => (
                <div 
                  key={opt.value}
                  className={`gender-card ${data.gender === opt.value ? 'selected' : ''}`}
                  onClick={() => updateField('gender', opt.value)}
                >
                  <span className="gender-card-emoji">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Education */}
      {step === 2 && (
        <div className="step-container">
          <div>
            <h2 className="step-title">教育经历</h2>
            <p className="app-subtitle">哪一年从大学毕业？（如果不适用，可留空）</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="grad-year">毕业年份 (大学/研究生)</label>
            <input 
              id="grad-year"
              type="number" 
              className="input-text"
              min={parseInt(data.birthYear, 10) + 15}
              max={currentYear + 6}
              value={data.gradYear || ''}
              onChange={(e) => updateField('gradYear', e.target.value)}
              placeholder="例如 2020"
            />
            <p className="app-subtitle" style={{ fontSize: '0.8rem' }}>系统将在此年份前自动填充 📖，毕业当年添加 🎓</p>
          </div>
        </div>
      )}

      {/* Step 3: Work */}
      {step === 3 && (
        <div className="step-container">
          <div>
            <h2 className="step-title">职业起点</h2>
            <p className="app-subtitle">哪一年开始你的第一份正式工作？（可留空）</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="work-year">参加工作年份</label>
            <input 
              id="work-year"
              type="number" 
              className="input-text"
              min={parseInt(data.birthYear, 10) + 16}
              max={currentYear}
              value={data.workYear || ''}
              onChange={(e) => updateField('workYear', e.target.value)}
              placeholder="例如 2020"
            />
            <p className="app-subtitle" style={{ fontSize: '0.8rem' }}>系统将在此年份之后自动填充工作 💼 标志</p>
          </div>
        </div>
      )}

      {/* Step 4: Quick Milestones */}
      {step === 4 && (
        <div className="step-container">
          <div>
            <h2 className="step-title">拥有了哪些东西？</h2>
            <p className="app-subtitle">勾选你获得的重要“资产”或“身份”（下一步可以自由分配具体年份）</p>
          </div>

          <div className="preset-grid">
            {EMOJI_PRESETS.flatMap(category => category.items)
              .filter(item => !['study', 'graduate', 'job'].includes(item.key)) // Filter out base wizard events
              .map((item) => {
                const isSelected = (data.selectedMilestones || []).includes(item.key);
                return (
                  <div 
                    key={item.key}
                    className={`preset-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMilestoneToggle(item.key)}
                  >
                    <span className="preset-emoji">{item.emoji}</span>
                    <span className="preset-label">{item.label}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Wizard Actions */}
      <div className="wizard-actions">
        {step > 1 && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBack}
          >
            上一步
          </button>
        )}
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {step === totalSteps ? '生成时间线' : '下一步'}
        </button>
      </div>
    </div>
  );
}
