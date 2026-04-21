import React, { useState } from 'react';
import { Plus, Trash2, Check, Circle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Task } from '../types/pomodoro';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (text: string, estimated: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetActive: (id: string | null) => void;
  onClearCompleted: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSetActive,
  onClearCompleted,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskPomodoros);
      setNewTaskText('');
      setNewTaskPomodoros(1);
      setIsFormOpen(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalPomodoros = tasks.reduce((sum, t) => sum + t.pomodorosCompleted, 0);

  return (
    <div className="w-full max-w-md fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 group"
        >
          <h2 className="font-display font-semibold text-lg text-charcoal">Tasks</h2>
          {isCollapsed ? (
            <ChevronDown size={16} className="text-soft-gray group-hover:text-charcoal transition-colors" />
          ) : (
            <ChevronUp size={16} className="text-soft-gray group-hover:text-charcoal transition-colors" />
          )}
          <span className="text-xs text-soft-gray font-mono ml-1">
            {completedCount}/{tasks.length}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs text-soft-gray hover:text-terracotta transition-colors font-display"
            >
              Clear done
            </button>
          )}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-parchment hover:bg-sand transition-colors"
            aria-label="Add task"
          >
            <Plus size={16} className="text-warm-gray" />
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-parchment rounded-2xl fade-in-up">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-transparent text-charcoal placeholder-soft-gray font-display text-sm outline-none mb-3"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-soft-gray font-display">Est. pomodoros:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNewTaskPomodoros(n)}
                    className={`w-7 h-7 rounded-full text-xs font-mono transition-all duration-150 ${
                      n <= newTaskPomodoros
                        ? 'bg-terracotta text-cream'
                        : 'bg-sand text-warm-gray hover:bg-terracotta-light hover:text-cream'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!newTaskText.trim()}
              className="px-4 py-1.5 bg-charcoal text-cream rounded-full text-xs font-display font-medium hover:bg-warm-gray transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      {!isCollapsed && (
        <div className="space-y-2 custom-scrollbar max-h-[320px] overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-soft-gray">
              <Sparkles size={24} className="mb-2 opacity-40" />
              <p className="text-sm font-display">No tasks yet</p>
              <p className="text-xs mt-1">Add a task to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isActive={task.id === activeTaskId}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onSetActive={() => onSetActive(task.id === activeTaskId ? null : task.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Stats bar */}
      {tasks.length > 0 && !isCollapsed && (
        <div className="mt-4 pt-3 border-t border-sand flex items-center justify-between text-xs text-soft-gray font-mono">
          <span>{totalPomodoros} pomodoro{totalPomodoros !== 1 ? 's' : ''} done</span>
          <span>~{totalPomodoros * 25}min focused</span>
        </div>
      )}
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSetActive: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isActive, onToggle, onDelete, onSetActive }) => {
  return (
    <div
      className={`
        group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer
        ${isActive ? 'bg-parchment ring-2 ring-terracotta/20' : 'hover:bg-parchment/60'}
        ${task.completed ? 'task-done opacity-60' : ''}
      `}
      onClick={onSetActive}
      role="button"
      aria-label={`${isActive ? 'Deselect' : 'Select'} task: ${task.text}`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="flex-shrink-0 transition-colors"
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed ? (
          <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center">
            <Check size={12} className="text-cream" />
          </div>
        ) : (
          <Circle size={20} className={`${isActive ? 'text-terracotta' : 'text-sand'} hover:text-terracotta transition-colors`} />
        )}
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-display truncate ${task.completed ? 'line-through text-soft-gray' : 'text-charcoal'}`}>
          {task.text}
        </p>
      </div>

      {/* Pomodoro count */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs font-mono text-soft-gray">
          {task.pomodorosCompleted}/{task.pomodorosEstimated}
        </span>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete task"
      >
        <Trash2 size={14} className="text-soft-gray hover:text-terracotta transition-colors" />
      </button>
    </div>
  );
};

export default TaskList;
