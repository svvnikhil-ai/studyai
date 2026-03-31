import ReactMarkdown from 'react-markdown';
import { StudyMaterial } from '../types';
import { 
  BookOpen, 
  Lightbulb, 
  Baby, 
  FileText, 
  HelpCircle, 
  Layers, 
  Calendar,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import QuizView from './QuizView';
import FlashcardView from './FlashcardView';
import { useState } from 'react';

interface StudyMaterialViewProps {
  material: StudyMaterial;
  onBack: () => void;
}

type Tab = 'summary' | 'notes' | 'quiz' | 'flashcards' | 'plan';

export default function StudyMaterialView({ material, onBack }: StudyMaterialViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'plan', label: 'Revision Plan', icon: Calendar },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Search
        </button>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={20} />
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
          {material.topic}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
            Study Guide
          </span>
          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
            AI Generated
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-8 gap-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Lightbulb size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Smart Summary</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                {material.summary}
              </p>
              <div className="markdown-body">
                <ReactMarkdown>{material.explanation}</ReactMarkdown>
              </div>
            </section>

            <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Baby size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-amber-900">Explain Like I'm 5</h2>
              </div>
              <p className="text-amber-800 leading-relaxed text-lg italic">
                "{material.eli5}"
              </p>
            </section>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="markdown-body">
              <ReactMarkdown>{material.notes}</ReactMarkdown>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <QuizView quiz={material.quiz} />
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FlashcardView flashcards={material.flashcards} />
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">1-Day Revision</h2>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{material.revisionPlan.oneDay}</ReactMarkdown>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Calendar size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">1-Week Revision</h2>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{material.revisionPlan.oneWeek}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
