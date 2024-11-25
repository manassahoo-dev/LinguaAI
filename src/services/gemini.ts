import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(
  message: string,
  language: string,
  level: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a helpful language learning assistant teaching ${language}. 
    The student's level is ${level}. 
    Respond to the following message in a helpful, encouraging way. 
    If the student writes in ${language}, correct any mistakes.
    Keep responses concise and focused on language learning.
    Message: ${message}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generatePersonalizedExercise(
  language: string,
  level: string,
  lessonType: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a ${lessonType} exercise for a ${level} ${language} student.
    Include:
    - A clear question
    - 4 multiple choice options
    - The correct answer
    Format as JSON with properties: question, options (array), correctAnswer`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

// Initialize the Generative AI instance
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const structurePrompt = (type, params) => {
  const prompts = {
    vocabularyWord: `
    Generate a new Hindi vocabulary word with these parameters:
    - Level: ${params.level}
    - Category: ${params.category}
    
    Return a JSON object with exactly these fields:
    {
      "word": "Hindi word in Devanagari",
      "transliteration": "Roman script transliteration",
      "englishMeaning": "English translation",
      "hindiExample": "Example sentence in Hindi",
      "englishExample": "English translation of example",
      "level": "difficulty level",
      "category": "word category"
    }
    
    Ensure the response is valid JSON and contains all fields.`,

    quizQuestions: `
    Generate ${params.count} Hindi vocabulary quiz questions for:
    - Level: ${params.level}
    - Category: ${params.category}
    
    Return a JSON array where each question object has this structure:
    {
      "word": "Hindi word in Devanagari",
      "transliteration": "Roman script transliteration",
      "correctAnswer": "Correct English meaning",
      "incorrectOptions": ["Wrong option 1", "Wrong option 2", "Wrong option 3"]
    }
    
    Ensure answers are clearly distinct and the response is valid JSON.`,
  };

  return prompts[type];
};

const safeJsonParse = async (text) => {
  try {
    // Remove any potential markdown formatting or extra text
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error("Failed to parse Gemini response as JSON");
  }
};

export const generateVocabularyWord = async (level, category) => {
  try {
    // Generate the content
    const prompt = structurePrompt("vocabularyWord", { level, category });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate the response
    const vocabularyWord = await safeJsonParse(text);

    // Validate required fields
    const requiredFields = [
      "word",
      "transliteration",
      "englishMeaning",
      "hindiExample",
      "englishExample",
      "level",
      "category",
    ];

    const missingFields = requiredFields.filter(
      (field) => !vocabularyWord[field]
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    return vocabularyWord;
  } catch (error) {
    console.error("Error in generateVocabularyWord:", error);
    throw new Error(
      error.message === "Failed to parse Gemini response as JSON"
        ? "Invalid response format from AI model"
        : "Failed to generate vocabulary word"
    );
  }
};

export const generateQuizQuestions = async (level, category, count = 5) => {
  try {
    // Generate the content
    const prompt = structurePrompt("quizQuestions", { level, category, count });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate the response
    const questions = await safeJsonParse(text);

    // Validate the questions array
    if (!Array.isArray(questions)) {
      throw new Error("Invalid quiz questions format");
    }

    // Validate each question
    questions.forEach((question, index) => {
      const requiredFields = [
        "word",
        "transliteration",
        "correctAnswer",
        "incorrectOptions",
      ];
      const missingFields = requiredFields.filter((field) => !question[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Question ${
            index + 1
          } is missing required fields: ${missingFields.join(", ")}`
        );
      }

      if (
        !Array.isArray(question.incorrectOptions) ||
        question.incorrectOptions.length !== 3
      ) {
        throw new Error(`Question ${index + 1} has invalid incorrect options`);
      }
    });

    return questions;
  } catch (error) {
    console.error("Error in generateQuizQuestions:", error);
    throw new Error(
      error.message === "Failed to parse Gemini response as JSON"
        ? "Invalid response format from AI model"
        : "Failed to generate quiz questions"
    );
  }
};

// Helper function to get word suggestions based on user input
export const getWordSuggestions = async (input, level) => {
  try {
    const prompt = `
    Generate 5 Hindi vocabulary word suggestions that start with or relate to "${input}" for ${level} level learners.
    Return as a JSON array of objects with this structure:
    {
      "word": "Hindi word in Devanagari",
      "transliteration": "Roman script transliteration",
      "englishMeaning": "Brief English meaning"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = await safeJsonParse(response.text());

    if (!Array.isArray(suggestions)) {
      throw new Error("Invalid suggestions format");
    }

    return suggestions;
  } catch (error) {
    console.error("Error in getWordSuggestions:", error);
    throw new Error("Failed to generate word suggestions");
  }
};

// Function to get detailed explanation of a word
export const getWordExplanation = async (word) => {
  try {
    const prompt = `
    Provide a detailed explanation of the Hindi word "${word}" including:
    - Etymology
    - Common usage contexts
    - Cultural significance (if any)
    - Related words or phrases
    - Common mistakes to avoid
    
    Return as a JSON object with these sections clearly organized.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = await safeJsonParse(response.text());

    return explanation;
  } catch (error) {
    console.error("Error in getWordExplanation:", error);
    throw new Error("Failed to generate word explanation");
  }
};

// Rate limiting and caching utility
const rateLimiter = {
  requestsPerMinute: 50,
  requests: [],

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < 60000);
    return this.requests.length < this.requestsPerMinute;
  },

  addRequest() {
    this.requests.push(Date.now());
  },

  async waitForAvailability() {
    while (!this.canMakeRequest()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.addRequest();
  },
};

// Wrap API calls with rate limiting
export const withRateLimit = (apiFunction) => {
  return async (...args) => {
    await rateLimiter.waitForAvailability();
    return apiFunction(...args);
  };
};

// Export rate-limited versions of the functions
export const rateLimitedGenerateVocabularyWord = withRateLimit(
  generateVocabularyWord
);
export const rateLimitedGenerateQuizQuestions = withRateLimit(
  generateQuizQuestions
);
export const rateLimitedGetWordSuggestions = withRateLimit(getWordSuggestions);
export const rateLimitedGetWordExplanation = withRateLimit(getWordExplanation);
