import { useState } from 'react';
import { GraduationCap, Sparkles, Brain, BookOpen, Clock } from 'lucide-react';
import InputForm from './components/InputForm';
import StudyMaterialView from './components/StudyMaterialView';
import { generateStudyMaterial } from './services/geminiService';
import { Difficulty, StudyMaterial } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (subject: string, topic: string, difficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateStudyMaterial(subject, topic, difficulty);
      setMaterial(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate study material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setMaterial(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-slate-900">
                Study<span className="text-indigo-600">AI</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!material ? (
          <div className="space-y-20">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles size={16} />
                Powered by Gemini 3.1 Pro
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Master Any Subject with <span className="text-indigo-600">AI Precision</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                The ultimate study companion. Generate notes, quizzes, and flashcards in seconds.
                Tailored to your learning level.
              </p>
            </div>

            {/* Form Section */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 pt-12">
              {[
                {
                  icon: Brain,
                  title: "Smart Summaries",
                  desc: "Complex topics broken down into digestible, clear explanations.",
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  icon: BookOpen,
                  title: "Structured Notes",
                  desc: "Comprehensive study material with key points and formulas.",
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  icon: Clock,
                  title: "Revision Plans",
                  desc: "Strategic 1-day and 1-week plans to ensure long-term retention.",
                  color: "bg-emerald-50 text-emerald-600"
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <StudyMaterialView material={material} onBack={handleBack} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <GraduationCap size={18} />
            </div>
            <span className="text-lg font-display font-bold text-slate-900">StudyAI</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 StudyAI Assistant. Empowering students worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
