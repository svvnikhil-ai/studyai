import React, { useState } from 'react';
import { Difficulty } from '../types';
import { BookOpen, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';

interface InputFormProps {
  onGenerate: (subject: string, topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

export default function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && topic) {
      onGenerate(subject, topic, difficulty);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
          <GraduationCap size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Start Your Study Session</h2>
          <p className="text-slate-500">Enter your topic and let AI handle the rest.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Subject</label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics, History, Computer Science"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Topic</label>
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Mechanics, French Revolution"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-3 rounded-2xl font-medium transition-all ${
                  difficulty === level
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Material...
            </div>
          ) : (
            <>
              Generate Study Guide
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
