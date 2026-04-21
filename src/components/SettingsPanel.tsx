import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { TimerSettings } from '../types/pomodoro';

interface SettingsPanelProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave, onClose }) => {
  const [draft, setDraft] = useState<TimerSettings>({ ...settings });

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const NumberInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (v: number) => void;
  }> = ({ label, value, min, max, step = 1, unit = 'min', onChange }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-display text-charcoal">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-full bg-parchment hover:bg-sand flex items-center justify-center transition-colors"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} className="text-warm-gray" />
        </button>
        <span className="w-12 text-center font-mono text-sm text-charcoal">
          {value}{unit && <span className="text-soft-gray text-xs ml-0.5">{unit}</span>}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-full bg-parchment hover:bg-sand flex items-center justify-center transition-colors"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} className="text-warm-gray" />
        </button>
      </div>
    </div>
  );

  const Toggle: React.FC<{
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-display text-charcoal">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-terracotta' : 'bg-sand'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-cream shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-cream rounded-3xl shadow-2xl p-6 fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-charcoal">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-parchment hover:bg-sand flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <X size={16} className="text-warm-gray" />
          </button>
        </div>

        {/* Timer durations */}
        <div className="mb-4">
          <p className="text-xs font-display font-medium text-soft-gray uppercase tracking-[0.15em] mb-1">Duration</p>
          <div className="divide-y divide-parchment">
            <NumberInput
              label="Focus"
              value={draft.focus}
              min={1}
              max={90}
              step={5}
              onChange={(v) => setDraft({ ...draft, focus: v })}
            />
            <NumberInput
              label="Short Break"
              value={draft.shortBreak}
              min={1}
              max={30}
              onChange={(v) => setDraft({ ...draft, shortBreak: v })}
            />
            <NumberInput
              label="Long Break"
              value={draft.longBreak}
              min={1}
              max={60}
              step={5}
              onChange={(v) => setDraft({ ...draft, longBreak: v })}
            />
            <NumberInput
              label="Long Break After"
              value={draft.longBreakInterval}
              min={2}
              max={8}
              unit=""
              onChange={(v) => setDraft({ ...draft, longBreakInterval: v })}
            />
          </div>
        </div>

        {/* Auto-start */}
        <div className="mb-6">
          <p className="text-xs font-display font-medium text-soft-gray uppercase tracking-[0.15em] mb-1">Automation</p>
          <div className="divide-y divide-parchment">
            <Toggle
              label="Auto-start Breaks"
              checked={draft.autoStartBreaks}
              onChange={(v) => setDraft({ ...draft, autoStartBreaks: v })}
            />
            <Toggle
              label="Auto-start Pomodoros"
              checked={draft.autoStartPomodoros}
              onChange={(v) => setDraft({ ...draft, autoStartPomodoros: v })}
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-charcoal text-cream rounded-2xl font-display font-medium text-sm hover:bg-warm-gray transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
