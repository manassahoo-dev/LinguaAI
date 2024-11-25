import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { LessonType } from '../types';
import { LessonContent } from './LessonContent';

const LESSON_TYPES: Record<LessonType, { icon: React.ElementType; color: string }> = {
  vocabulary: { icon: BookOpen, color: 'text-blue-600' },
  grammar: { icon: BookOpen, color: 'text-green-600' },
  conversation: { icon: BookOpen, color: 'text-purple-600' },
  culture: { icon: BookOpen, color: 'text-red-600' },
};

export function Lessons() {
  const { lessons, updateLesson } = useStore();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Demo lessons (replace with actual lessons from your store)
  const demoLessons = [
    {
      id: '1',
      type: 'vocabulary' as LessonType,
      title: 'Basic Greetings',
      content: 'Learn essential greetings and introductions',
      completed: false,
    },
    {
      id: '2',
      type: 'grammar' as LessonType,
      title: 'Present Tense',
      content: 'Master the present tense conjugations',
      completed: false,
    },
    {
      id: '3',
      type: 'conversation' as LessonType,
      title: 'At the Restaurant',
      content: 'Practice ordering food and drinks',
      completed: false,
    },
    {
      id: '4',
      type: 'culture' as LessonType,
      title: 'Festivals & Celebrations',
      content: 'Explore cultural celebrations and traditions',
      completed: false,
    },
  ];

  if (selectedLesson) {
    const lesson = demoLessons.find(l => l.id === selectedLesson);
    if (!lesson) return null;

    return (
      <div>
        <button
          onClick={() => setSelectedLesson(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Lessons
        </button>
        <LessonContent lesson={lesson} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {demoLessons.map((lesson, index) => {
        const LessonIcon = LESSON_TYPES[lesson.type].icon;
        const isLocked = index > 0 && !demoLessons[index - 1].completed;

        return (
          <div
            key={lesson.id}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              isLocked ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2 rounded-lg ${
                  LESSON_TYPES[lesson.type].color.replace('text-', 'bg-').replace('600', '100')
                }`}
              >
                <LessonIcon
                  className={`h-6 w-6 ${LESSON_TYPES[lesson.type].color}`}
                />
              </div>
              {isLocked ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : lesson.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : null}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {lesson.title}
            </h3>
            <p className="text-gray-600 mb-4">{lesson.content}</p>
            <button
              onClick={() => !isLocked && setSelectedLesson(lesson.id)}
              disabled={isLocked}
              className={`w-full py-2 px-4 rounded-lg ${
                isLocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLocked ? 'Locked' : lesson.completed ? 'Review' : 'Start'}
            </button>
          </div>
        );
      })}
    </div>
  );
}