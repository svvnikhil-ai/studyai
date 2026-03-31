import { useState } from 'react';
import { StudyMaterial } from '../types';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlashcardViewProps {
  flashcards: StudyMaterial['flashcards'];
}

export default function FlashcardView({ flashcards }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <div className="flex gap-2">
          <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        className="relative h-80 perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Term</span>
            <h3 className="text-2xl font-display font-bold text-slate-900">
              {flashcards[currentIndex].term}
            </h3>
            <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-sm font-medium">
              <RotateCw size={14} />
              Click to flip
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center text-center text-white"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Definition</span>
            <p className="text-xl leading-relaxed">
              {flashcards[currentIndex].definition}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4">
        <button
          onClick={handlePrev}
          className="py-4 px-6 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          Next Card
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
