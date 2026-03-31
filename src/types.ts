import { Type } from "@google/genai";

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudyMaterial {
  topic: string;
  summary: string;
  explanation: string;
  eli5: string;
  notes: string;
  quiz: {
    mcqs: {
      question: string;
      options: string[];
      answer: number;
      explanation: string;
    }[];
    shortAnswer: {
      question: string;
      answer: string;
    }[];
    longAnswer: {
      question: string;
      answer: string;
    };
  };
  flashcards: {
    term: string;
    definition: string;
  }[];
  revisionPlan: {
    oneDay: string;
    oneWeek: string;
  };
}

export const STUDY_MATERIAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    summary: { type: Type.STRING },
    explanation: { type: Type.STRING },
    eli5: { type: Type.STRING },
    notes: { type: Type.STRING },
    quiz: {
      type: Type.OBJECT,
      properties: {
        mcqs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "answer", "explanation"]
          }
        },
        shortAnswer: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        },
        longAnswer: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ["question", "answer"]
        }
      },
      required: ["mcqs", "shortAnswer", "longAnswer"]
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING }
        },
        required: ["term", "definition"]
      }
    },
    revisionPlan: {
      type: Type.OBJECT,
      properties: {
        oneDay: { type: Type.STRING },
        oneWeek: { type: Type.STRING }
      },
      required: ["oneDay", "oneWeek"]
    }
  },
  required: ["topic", "summary", "explanation", "eli5", "notes", "quiz", "flashcards", "revisionPlan"]
};
