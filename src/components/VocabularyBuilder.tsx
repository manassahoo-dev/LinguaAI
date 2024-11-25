import { Book, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  generateQuizQuestions,
  generateVocabularyWord,
} from "../services/gemini";

const VocabularyBuilder = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedCategory, setSelectedCategory] = useState("Greetings");
  const [activeTab, setActiveTab] = useState("flashcards"); // Add state for active tab

  // Memoize the fetch functions to prevent recreating them on every render
  const fetchNewWord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const word = await generateVocabularyWord(
        selectedLevel,
        selectedCategory
      );
      setCurrentWord(word);
    } catch (err) {
      setError("Failed to generate vocabulary word. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, selectedCategory]);

  const fetchQuizQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const questions = await generateQuizQuestions(
        selectedLevel,
        selectedCategory
      );
      setQuizQuestions(questions);
    } catch (err) {
      setError("Failed to generate quiz questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, selectedCategory]);

  // Fetch word only when level or category changes
  useEffect(() => {
    if (activeTab === "flashcards") {
      fetchNewWord();
    }
  }, [selectedLevel, selectedCategory, activeTab, fetchNewWord]);

  const Flashcard = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (!currentWord) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No vocabulary word available. Please try changing the filters or
            refreshing.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto">
        <div
          className="bg-white rounded-xl shadow-md h-80 cursor-pointer transition-all duration-300 hover:shadow-xl"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              {!isFlipped ? (
                <div className="space-y-4">
                  <Book className="w-8 h-8 mx-auto text-blue-500" />
                  <h2 className="text-3xl font-bold mb-2">
                    {currentWord.word}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {currentWord.transliteration}
                  </p>
                  <p className="text-sm text-gray-500">
                    Click to reveal meaning
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl font-medium">
                    {currentWord.englishMeaning}
                  </p>
                  <div className="space-y-2">
                    <p className="text-md">{currentWord.hindiExample}</p>
                    <p className="text-sm text-gray-600 italic">
                      {currentWord.englishExample}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchNewWord();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Next Word
                <RotateCcw className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    // Only fetch quiz questions when the quiz tab is active and quiz hasn't started
    useEffect(() => {
      if (activeTab === "quiz" && !quizStarted) {
        fetchQuizQuestions();
        setQuizStarted(true);
      }
    }, [activeTab, quizStarted, fetchQuizQuestions]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (!quizQuestions.length) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No quiz questions available. Please try refreshing.
          </p>
        </div>
      );
    }

    if (showResult) {
      return (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Quiz Complete!</h3>
          <p>
            Your score: {score}/{quizQuestions.length}
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
              setQuizStarted(false);
              fetchQuizQuestions();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    const currentQ = quizQuestions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">
            Question {currentQuestion + 1}/{quizQuestions.length}
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{currentQ.word}</p>
            <p className="text-lg text-gray-600">{currentQ.transliteration}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[currentQ.correctAnswer, ...currentQ.incorrectOptions]
            .sort(() => Math.random() - 0.5)
            .map((option, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (option === currentQ.correctAnswer) {
                    setScore(score + 1);
                  }
                  if (currentQuestion < quizQuestions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  } else {
                    setShowResult(true);
                  }
                }}
              >
                {option}
              </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">हिंदी Vocabulary Builder</h1>
        <p className="text-gray-600 mt-2">Powered by Google Gemini AI</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Greetings", "Common Phrases", "Daily Life", "Business"].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="w-full">
        <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`py-2 px-4 rounded-md transition-all ${
              activeTab === "flashcards"
                ? "bg-white shadow-sm"
                : "hover:bg-white hover:shadow-sm"
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`py-2 px-4 rounded-md transition-all ${
              activeTab === "quiz"
                ? "bg-white shadow-sm"
                : "hover:bg-white hover:shadow-sm"
            }`}
          >
            Quiz
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "flashcards" ? <Flashcard /> : <Quiz />}
        </div>
      </div>
    </div>
  );
};

export default VocabularyBuilder;
