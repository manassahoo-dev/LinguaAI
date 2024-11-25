import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Globe } from "lucide-react";

const OnboardingWizard = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nativeLanguage: "",
    targetLanguage: "",
    proficiencyLevel: "",
    learningGoal: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: "welcome",
      type: "welcome",
      title: "Let's get you started with your language learning journey",
      subtitle: "We'll ask you a few questions to personalize your experience",
    },
    {
      id: "name",
      type: "text",
      question: "First, what's your name?",
      field: "name",
      placeholder: "Enter your name",
    },
    {
      id: "email",
      type: "email",
      question: "Great! What's your email address?",
      field: "email",
      placeholder: "Enter your email",
    },
    {
      id: "nativeLanguage",
      type: "select",
      question: "What's your native language?",
      field: "nativeLanguage",
      options: [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
        "Other",
      ],
    },
    {
      id: "targetLanguage",
      type: "select",
      question: "Which language would you like to learn?",
      field: "targetLanguage",
      options: [
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
        "English",
        "Other",
      ],
    },
    {
      id: "proficiencyLevel",
      type: "select",
      question: "What's your current level in this language?",
      field: "proficiencyLevel",
      options: ["Complete Beginner", "Beginner", "Intermediate", "Advanced"],
    },
    {
      id: "learningGoal",
      type: "select",
      question: "What's your primary learning goal?",
      field: "learningGoal",
      options: [
        "Travel & Basic Communication",
        "Business & Professional",
        "Academic Studies",
        "Cultural Interest",
        "Living Abroad",
      ],
    },
    {
      id: "completion",
      type: "completion",
      title: "Perfect! We're creating your personalized learning path",
      subtitle: "This will only take a moment...",
    },
  ];

  const handleNext = () => {
    if (step === questions.length - 2) {
      setIsLoading(false);
      // Simulate API call
      setTimeout(() => {
        setStep(step + 1);
        onClose(true);
      }, 2000);
    } else if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const Question = ({ question }) => {
    switch (question.type) {
      case "welcome":
        return (
          <div className="text-center">
            <Globe className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">{question.title}</h2>
            <p className="text-gray-600 mb-8">{question.subtitle}</p>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-blue-700 transition-colors"
            >
              Let's Begin
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        );

      case "text":
      case "email":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            <input
              type={question.type}
              id={question.id}
              name={question.id}
              placeholder={question.placeholder}
              value={formData[question.field]}
              onChange={(e) =>
                handleInputChange(question.field, e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all mb-6"
            />
          </div>
        );

      case "select":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            <div className="grid gap-3">
              {question.options.map((option) => (
                <button
                  key={option}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData[question.field] === option
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-600"
                  }`}
                  onClick={() => handleInputChange(question.field, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "completion":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
            <p className="text-gray-600">{question.subtitle}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto mx-4"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(step / (questions.length - 1)) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Question question={questions[step]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {step > 0 && step < questions.length - 1 && (
          <div className="p-6 border-t flex justify-between">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition-colors"
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData[questions[step].field]}
              className={`px-6 py-2 rounded-lg flex items-center ${
                formData[questions[step].field]
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Continue
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Landing Page component with Tailwind CSS
const Onboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Learn Any Language
                <span className="text-blue-600 block mt-2">
                  With AI Assistance
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Master new languages naturally with personalized lessons and
                real-time feedback powered by artificial intelligence.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium inline-flex items-center hover:bg-blue-700 transition-colors"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/api/placeholder/600/400"
                alt="Language Learning Platform Preview"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onClose={() => setShowOnboarding(false)} />
      )}
    </>
  );
};

export default Onboarding;
