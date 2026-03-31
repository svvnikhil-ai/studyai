import { useState } from 'react';
import { StudyMaterial } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Send, Sparkles } from 'lucide-react';
import { evaluateAnswer } from '../services/geminiService';

interface QuizViewProps {
  quiz: StudyMaterial['quiz'];
}

export default function QuizView({ quiz }: QuizViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const mcqCount = quiz.mcqs.length;
  const saCount = quiz.shortAnswer.length;
  const totalQuestions = mcqCount + saCount;

  const isMCQ = currentStep < mcqCount;
  const currentMCQ = isMCQ ? quiz.mcqs[currentStep] : null;
  const currentSA = !isMCQ ? quiz.shortAnswer[currentStep - mcqCount] : null;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = async () => {
    if (isMCQ) {
      if (selectedOption === null) return;
      setIsAnswered(true);
      if (selectedOption === currentMCQ?.answer) {
        setScore(s => s + 1);
      }
    } else {
      if (!shortAnswer.trim()) return;
      setIsEvaluating(true);
      try {
        const result = await evaluateAnswer(currentSA!.question, shortAnswer, currentSA!.answer);
        setFeedback(result);
        setScore(s => s + (result.score / 10));
        setIsAnswered(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setShortAnswer('');
      setIsAnswered(false);
      setFeedback(null);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setShortAnswer('');
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setFeedback(null);
  };

  if (showResults) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Quiz Completed!</h3>
        <p className="text-slate-500 mb-8">Your overall performance: {score.toFixed(1)} / {totalQuestions}</p>
        
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={resetQuiz}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
            {isMCQ ? 'Multiple Choice' : 'Short Answer'}
          </span>
          <span className="text-sm font-bold text-slate-400">
            Question {currentStep + 1} / {totalQuestions}
          </span>
        </div>
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-8">
          {isMCQ ? currentMCQ?.question : currentSA?.question}
        </h3>

        {isMCQ ? (
          <div className="space-y-3">
            {currentMCQ?.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentMCQ.answer;
              const isWrong = isSelected && !isCorrect;

              let buttonClass = "w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ";
              if (isAnswered) {
                if (isCorrect) buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
                else if (isWrong) buttonClass += "border-rose-500 bg-rose-50 text-rose-900";
                else buttonClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
              } else {
                buttonClass += isSelected 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900" 
                  : "border-slate-100 hover:border-slate-200 text-slate-700";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-600" />}
                  {isAnswered && isWrong && <XCircle size={20} className="text-rose-600" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer here..."
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] disabled:opacity-50"
            />
          </div>
        )}

        {isAnswered && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isMCQ ? 'Explanation' : 'AI Feedback'}
              </h4>
            </div>
            {isMCQ ? (
              <p className="text-slate-600 leading-relaxed">{currentMCQ?.explanation}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    feedback!.score >= 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    Score: {feedback?.score}/10
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{feedback?.feedback}</p>
                <div className="pt-3 border-t border-slate-200">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-1">Ideal Answer</h5>
                  <p className="text-slate-500 text-sm italic">{currentSA?.answer}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleCheckAnswer}
            disabled={isEvaluating || (isMCQ ? selectedOption === null : !shortAnswer.trim())}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isEvaluating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                {isMCQ ? 'Check Answer' : 'Submit Answer'}
                <Send size={18} />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
          >
            {currentStep === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
