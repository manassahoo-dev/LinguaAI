import React, { useState } from "react";
import { Languages, BookOpen, Target } from "lucide-react";
import type { Language, LearningLevel, UserProfile } from "../types";
import { useStore } from "../store/useStore";

const languages: Language[] = ["Hindi", "Telugu", "Tamil", "Punjabi"];
const levels: LearningLevel[] = ["beginner", "intermediate", "advanced"];

export function Onboarding() {
  const setUserProfile = useStore((state) => state.setUserProfile);
  const [formData, setFormData] = useState({
    name: "",
    targetLanguage: "hindi" as Language,
    nativeLanguage: "english" as Language,
    level: "beginner" as LearningLevel,
    interests: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData as UserProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Languages className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to LinguaGenius
          </h1>
          <p className="text-gray-600 mt-2">
            Let's personalize your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Language
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.targetLanguage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetLanguage: e.target.value as Language,
                })
              }
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proficiency Level
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as LearningLevel,
                })
              }
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Target className="w-5 h-5 mr-2" />
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
}
