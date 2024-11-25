import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import type { Lesson, Exercise } from '../types';
import { useStore } from '../store/useStore';
import { generatePersonalizedExercise } from '../services/gemini';

export function LessonContent({ lesson }: { lesson: Lesson }) {
  const [currentStep, setCurrentStep] = useState<'learn' | 'practice' | 'completed'>('learn');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateLesson, userProfile } = useStore();

  useEffect(() => {
    const loadExercises = async () => {
      if (currentStep === 'practice' && exercises.length === 0 && userProfile) {
        setIsLoading(true);
        try {
          const exercise1 = await generatePersonalizedExercise(
            userProfile.targetLanguage,
            userProfile.level,
            lesson.type
          );
          const exercise2 = await generatePersonalizedExercise(
            userProfile.targetLanguage,
            userProfile.level,
            lesson.type
          );
          setExercises([
            { id: '1', ...exercise1 },
            { id: '2', ...exercise2 },
          ]);
        } catch (error) {
          console.error('Failed to generate exercises:', error);
          // Fallback to default exercises if generation fails
          setExercises([
            {
              id: '1',
              type: 'multiple-choice',
              question: 'What is the meaning of "नमस्ते"?',
              options: ['Good morning', 'Hello/Namaste', 'How are you?', 'Goodbye'],
              correctAnswer: 'Hello/Namaste',
            },
            {
              id: '2',
              type: 'multiple-choice',
              question: 'How do you say "Good morning" in Hindi?',
              options: ['आप कैसे हैं?', 'नमस्ते', 'शुभ प्रभात', 'मैं ठीक हूं'],
              correctAnswer: 'शुभ प्रभात',
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExercises();
  }, [currentStep, userProfile, lesson.type]);

  const handleAnswer = (exerciseId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    setShowError(false);
  };

  const handleComplete = () => {
    const allAnswered = exercises.every(ex => answers[ex.id]);
    if (!allAnswered) {
      setShowError(true);
      return;
    }

    const allCorrect = exercises.every(
      ex => answers[ex.id] === ex.correctAnswer
    );

    if (allCorrect) {
      updateLesson(lesson.id, { completed: true });
      setCurrentStep('completed');
    } else {
      setShowError(true);
    }
  };

  // ... rest of the component remains the same ...
}