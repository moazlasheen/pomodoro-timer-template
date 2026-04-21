import { useState, useCallback } from 'react';
import { Task } from '../types/pomodoro';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('pomodoro-tasks', JSON.stringify(newTasks));
  };

  const addTask = useCallback((text: string, estimated: number = 1) => {
    const newTask: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      completed: false,
      pomodorosCompleted: 0,
      pomodorosEstimated: estimated,
    };
    saveTasks([...tasks, newTask]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  }, [tasks, activeTaskId]);

  const toggleTask = useCallback((id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  }, [tasks, activeTaskId]);

  const incrementPomodoro = useCallback(() => {
    if (!activeTaskId) return;
    saveTasks(tasks.map(t =>
      t.id === activeTaskId
        ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 }
        : t
    ));
  }, [tasks, activeTaskId]);

  const clearCompleted = useCallback(() => {
    saveTasks(tasks.filter(t => !t.completed));
  }, [tasks]);

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  return {
    tasks,
    activeTask,
    activeTaskId,
    setActiveTaskId,
    addTask,
    toggleTask,
    deleteTask,
    incrementPomodoro,
    clearCompleted,
  };
}
