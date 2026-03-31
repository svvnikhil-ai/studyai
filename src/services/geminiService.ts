import { GoogleGenAI } from "@google/genai";
import { Difficulty, StudyMaterial, STUDY_MATERIAL_SCHEMA } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateStudyMaterial(
  subject: string,
  topic: string,
  difficulty: Difficulty
): Promise<StudyMaterial> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are an advanced AI Study Assistant. Generate a comprehensive study guide for the following:
    Subject: ${subject}
    Topic: ${topic}
    Difficulty Level: ${difficulty}

    Follow these requirements:
    1. SMART SUMMARY: 3-5 lines summary, detailed explanation, and key points.
    2. SIMPLIFIED EXPLANATION: ELI5 and a real-life analogy.
    3. STUDY NOTES: Well-structured with headings and subheadings. Include formulas if applicable. Use Markdown for formatting.
    4. QUIZ: 5 MCQs (4 options each), 3 short answer questions, and 1 long answer question. Include correct answers and explanations.
    5. FLASHCARDS: At least 5 cards in Term -> Definition format.
    6. REVISION PLAN: Suggestions for 1-day and 1-week revision.

    Adapt the depth and complexity based on the ${difficulty} level.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: STUDY_MATERIAL_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate study material");
  }

  return JSON.parse(response.text) as StudyMaterial;
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<{ score: number; feedback: string }> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Evaluate the student's answer to the following question.
    Question: ${question}
    Correct Answer: ${correctAnswer}
    Student's Answer: ${userAnswer}

    Provide a score from 0 to 10 and constructive feedback.
    Return as JSON: { "score": number, "feedback": string }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Failed to evaluate answer");
  }

  return JSON.parse(response.text);
}
