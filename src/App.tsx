import React, { useState } from 'react';
import { Settings, Timer, Flame } from 'lucide-react';
import { useTimer } from './hooks/useTimer';
import { useTasks } from './hooks/useTasks';
import TimerDisplay from './components/TimerDisplay';
import ModeSelector from './components/ModeSelector';
import TaskList from './components/TaskList';
import SessionTracker from './components/SessionTracker';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  const {
    tasks,
    activeTask,
    activeTaskId,
    setActiveTaskId,
    addTask,
    toggleTask,
    deleteTask,
    incrementPomodoro,
    clearCompleted,
  } = useTasks();

  const {
    timeLeft,
    totalTime,
    isRunning,
    mode,
    pomodorosCompleted,
    settings,
    start,
    pause,
    reset,
    skip,
    setMode,
    updateSettings,
  } = useTimer(incrementPomodoro);

  return (
    <div className="grain min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center">
            <Timer size={18} className="text-cream" />
          </div>
          <span className="font-display font-bold text-xl text-charcoal tracking-tight">
            focusflow
          </span>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full bg-parchment hover:bg-sand flex items-center justify-center transition-colors"
          aria-label="Open settings"
        >
          <Settings size={18} className="text-warm-gray" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        {/* Mode Selector */}
        <div className="mt-4 mb-8">
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>

        {/* Active Task Label */}
        {activeTask && (
          <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-parchment rounded-full fade-in-up">
            <Flame size={14} className="text-terracotta" />
            <span className="text-sm font-display text-charcoal truncate max-w-[200px]">
              {activeTask.text}
            </span>
            <span className="text-xs font-mono text-soft-gray">
              {activeTask.pomodorosCompleted}/{activeTask.pomodorosEstimated}
            </span>
          </div>
        )}

        {/* Timer */}
        <TimerDisplay
          timeLeft={timeLeft}
          totalTime={totalTime}
          isRunning={isRunning}
          mode={mode}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSkip={skip}
        />

        {/* Session Tracker */}
        <div className="mt-8 mb-12">
          <SessionTracker
            pomodorosCompleted={pomodorosCompleted}
            longBreakInterval={settings.longBreakInterval}
            mode={mode}
          />
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mb-6">
          <div className="h-px bg-sand" />
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onSetActive={setActiveTaskId}
          onClearCompleted={clearCompleted}
        />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-soft-gray font-display">
          Stay focused. One pomodoro at a time.
        </p>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
