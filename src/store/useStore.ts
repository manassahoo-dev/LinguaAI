import { create } from 'zustand';
import type { UserProfile, ChatMessage, Lesson } from '../types';

interface AppState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  lessons: Lesson[];
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
}

export const useStore = create<AppState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  lessons: [],
  addLesson: (lesson) =>
    set((state) => ({ lessons: [...state.lessons, lesson] })),
  updateLesson: (lessonId, updates) =>
    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      ),
    })),
}));