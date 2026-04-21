export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  pomodorosCompleted: number;
  pomodorosEstimated: number;
  category?: string;
}

export interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  dailyGoal: number;
  darkMode: boolean | 'system';
}

export interface PomodoroSession {
  id: string;
  type: TimerMode;
  startedAt: number;
  completedAt: number;
  taskId?: string;
  taskText?: string;
  durationMinutes: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  dailyGoal: 8,
  darkMode: 'system',
};

export const FOCUS_QUOTES: { text: string; author: string }[] = [
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a good deal of it.", author: "Seneca" },
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Do every act of your life as though it were the very last act of your life.", author: "Marcus Aurelius" },
  { text: "You will never reach your destination if you stop and throw stones at every dog that barks.", author: "Winston Churchill" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin" },
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
];
