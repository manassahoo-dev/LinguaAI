import React from "react";
import { BookOpen, MessageCircle, Globe, Trophy } from "lucide-react";
import { useStore } from "../store/useStore";
import { Chat } from "./Chat";
import { Lessons } from "./Lessons";

export function Dashboard() {
  const userProfile = useStore((state) => state.userProfile);
  const [activeTab, setActiveTab] = React.useState<"lessons" | "chat">(
    "lessons"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                LinguaGenius
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Learning {userProfile?.targetLanguage.charAt(0).toUpperCase()}
                {userProfile?.targetLanguage.slice(1)}
              </div>
              <div className="flex items-center bg-indigo-100 rounded-full px-4 py-1">
                <Trophy className="h-4 w-4 text-indigo-600 mr-2" />
                <span className="text-indigo-600 font-medium">
                  Level {userProfile?.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "lessons"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Lessons
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Practice Chat
          </button>
        </div>

        {activeTab === "lessons" ? <Lessons /> : <Chat />}
      </main>
    </div>
  );
}
