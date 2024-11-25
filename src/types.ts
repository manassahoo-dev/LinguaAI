export type Language = "Hindi" | "Telugu" | "Tamil" | "Punjabi";

export type LearningLevel = "beginner" | "intermediate" | "advanced";

export type UserProfile = {
  name: string;
  targetLanguage: Language;
  nativeLanguage: Language;
  level: LearningLevel;
  interests: string[];
};

export type LessonType = "vocabulary" | "grammar" | "conversation" | "culture";

export type LessonContent = {
  phrase: string;
  translation: string;
  pronunciation?: string;
  audioUrl?: string;
};

export type Exercise = {
  id: string;
  type: "multiple-choice" | "translation";
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
};

export type Lesson = {
  id: string;
  type: LessonType;
  title: string;
  content: string;
  completed: boolean;
  lessonContent?: LessonContent[];
  exercises?: Exercise[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};
