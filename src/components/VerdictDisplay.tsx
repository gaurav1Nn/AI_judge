import { motion } from 'framer-motion';
import { Scale, FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { useVerdictStore } from '../stores/verdictStore';
import { useCaseStore } from '../stores/caseStore';
import { useEffect, useState } from 'react';

export const VerdictDisplay = () => {
  const initialVerdict = useVerdictStore((state) => state.initialVerdict);
  const currentCase = useCaseStore((state) => state.currentCase);
  const setPhase = useCaseStore((state) => state.setPhase);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialVerdict || !showContent) return;

    const interval = setInterval(() => {
      setAnimatedConfidence((prev) => {
        if (prev >= initialVerdict.confidence) {
          clearInterval(interval);
          return initialVerdict.confidence;
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [initialVerdict, showContent]);

  if (!initialVerdict || !currentCase) return null;

  const isPlaintiffWin = initialVerdict.favor.includes('Side A');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#242424] to-charcoal py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.95 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <Scale className="w-16 h-16 text-gold" strokeWidth={1.5} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gold/5 to-gold/10 backdrop-blur-sm border-2 border-gold rounded-3xl p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: 0.8 }}
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="font-serif text-6xl font-bold text-gold mb-4 tracking-wide">
                VERDICT
              </h1>
              <p className="text-cream/60 text-sm uppercase tracking-widest">
                Case: {currentCase.case_number}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="text-center mb-8"
            >
              <div
                className={`inline-block px-8 py-4 rounded-2xl ${
                  isPlaintiffWin
                    ? 'bg-electric-blue/20 border-2 border-electric-blue'
                    : 'bg-crimson/20 border-2 border-crimson'
                } shadow-xl`}
              >
                <div className="text-sm text-cream/60 uppercase tracking-wider mb-2">
                  In Favor Of
                </div>
                <div className={`text-4xl font-bold ${isPlaintiffWin ? 'text-electric-blue' : 'text-crimson'}`}>
                  {initialVerdict.favor}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center mb-12"
            >
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(212, 175, 55, 0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(212, 175, 55, 1)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 440' }}
                    animate={{
                      strokeDasharray: `${(animatedConfidence / 100) * 440} 440`,
                    }}
                    transition={{ duration: 0.05 }}
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gold font-serif">{animatedConfidence}%</div>
                    <div className="text-cream/60 text-sm mt-1">Confidence</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
                Reasoning
              </h2>
              <div className="space-y-4">
                {initialVerdict.reasoning.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-xl p-5 hover:border-gold/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-gold font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-cream/90 leading-relaxed flex-1">{reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div>
                <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" />
                  Legal Sections
                </h3>
                <div className="space-y-2">
                  {initialVerdict.legal_sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + index * 0.1 }}
                      className="bg-charcoal/50 border border-gold/20 rounded-lg p-3 hover:border-gold/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-cream/90 text-sm font-serif">{section}</span>
                        <ChevronRight className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-gold" />
                  Similar Cases
                </h3>
                <div className="space-y-2">
                  {initialVerdict.similar_cases.map((caseRef, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + index * 0.1 }}
                      className="bg-charcoal/50 border border-gold/20 rounded-lg p-3 hover:border-gold/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-cream/90 text-sm">{caseRef}</span>
                        <ChevronRight className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="text-center pt-8 border-t border-gold/20"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('arguments')}
                className="group relative px-12 py-5 bg-gold text-charcoal font-bold text-lg rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Proceed to Arguments Phase
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.button>
              <p className="text-cream/40 text-sm mt-4">
                Both sides have up to 5 rebuttals to challenge the verdict
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
