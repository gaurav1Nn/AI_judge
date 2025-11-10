import { motion } from 'framer-motion';
import { Scale, TrendingUp, TrendingDown, Home, ArrowRight } from 'lucide-react';
import { useVerdictStore } from '../stores/verdictStore';
import { useCaseStore } from '../stores/caseStore';
import { useArgumentsStore } from '../stores/argumentsStore';
import { useEffect, useState } from 'react';

export const FinalVerdict = () => {
  const { initialVerdict, finalVerdict, resetVerdicts } = useVerdictStore();
  const { currentCase, resetCase, setPhase } = useCaseStore();
  const resetArguments = useArgumentsStore((state) => state.resetArguments);
  const [animatedFinalConfidence, setAnimatedFinalConfidence] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!finalVerdict || !showContent) return;

    const interval = setInterval(() => {
      setAnimatedFinalConfidence((prev) => {
        if (prev >= finalVerdict.confidence) {
          clearInterval(interval);
          return finalVerdict.confidence;
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [finalVerdict, showContent]);

  if (!initialVerdict || !finalVerdict || !currentCase) return null;

  const verdictChanged = initialVerdict.favor !== finalVerdict.favor;
  const confidenceChanged = Math.abs(initialVerdict.confidence - finalVerdict.confidence);

  const handleStartNew = () => {
    resetCase();
    resetVerdicts();
    resetArguments();
    setPhase('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#242424] to-charcoal py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <Scale className="w-20 h-20 text-gold" strokeWidth={1.5} />
          </motion.div>
          <h1 className="font-serif text-6xl font-bold text-gold mb-4">Final Verdict</h1>
          <p className="text-cream/60 text-lg">After careful consideration of all arguments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-cream/5 backdrop-blur-sm border-2 border-cream/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-cream mb-2">Initial Verdict</h2>
              <div className="text-cream/40 text-sm">Before Arguments</div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block px-6 py-3 bg-cream/10 rounded-xl">
                <div className="text-sm text-cream/60 uppercase tracking-wider mb-1">In Favor Of</div>
                <div className="text-2xl font-bold text-cream">{initialVerdict.favor}</div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(245, 241, 232, 0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(245, 241, 232, 0.5)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(initialVerdict.confidence / 100) * 352} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cream">{initialVerdict.confidence}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {initialVerdict.reasoning.slice(0, 3).map((reason, index) => (
                <div key={index} className="text-cream/60 text-sm p-3 bg-cream/5 rounded-lg">
                  • {reason}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gold/10 to-gold/5 backdrop-blur-sm border-2 border-gold rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

            {verdictChanged && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="absolute top-4 right-4 bg-gold text-charcoal px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                VERDICT CHANGED
              </motion.div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gold mb-2">Final Verdict</h2>
              <div className="text-gold/60 text-sm">After Arguments Phase</div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <div
                className={`inline-block px-6 py-3 rounded-xl ${
                  finalVerdict.favor.includes('Side A')
                    ? 'bg-electric-blue/20 border-2 border-electric-blue'
                    : 'bg-crimson/20 border-2 border-crimson'
                } shadow-xl`}
              >
                <div className="text-sm text-cream/80 uppercase tracking-wider mb-1">In Favor Of</div>
                <div
                  className={`text-2xl font-bold ${
                    finalVerdict.favor.includes('Side A') ? 'text-electric-blue' : 'text-crimson'
                  }`}
                >
                  {finalVerdict.favor}
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(212, 175, 55, 1)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${(animatedFinalConfidence / 100) * 352} 352` }}
                    transition={{ duration: 0.05 }}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">{animatedFinalConfidence}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {finalVerdict.reasoning.slice(0, 3).map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-cream/90 text-sm p-3 bg-gold/10 rounded-lg border border-gold/20"
                >
                  • {reason}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-cream/5 backdrop-blur-sm border border-cream/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
            Verdict Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-charcoal/50 rounded-xl border border-cream/10">
              <div className="flex items-center justify-center gap-2 mb-3">
                {verdictChanged ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div className="text-3xl font-bold text-cream mb-2">
                {verdictChanged ? 'Changed' : 'Unchanged'}
              </div>
              <div className="text-cream/60 text-sm">Verdict Status</div>
            </div>

            <div className="text-center p-6 bg-charcoal/50 rounded-xl border border-cream/10">
              <div className="flex items-center justify-center gap-2 mb-3">
                {confidenceChanged > 10 ? (
                  <TrendingDown className="w-6 h-6 text-yellow-400" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                )}
              </div>
              <div className="text-3xl font-bold text-cream mb-2">
                {confidenceChanged > 0 ? '-' : '+'}{confidenceChanged}%
              </div>
              <div className="text-cream/60 text-sm">Confidence Change</div>
            </div>

            <div className="text-center p-6 bg-charcoal/50 rounded-xl border border-cream/10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Scale className="w-6 h-6 text-gold" />
              </div>
              <div className="text-3xl font-bold text-cream mb-2">{currentCase.case_number}</div>
              <div className="text-cream/60 text-sm">Case Number</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-gold/10 to-gold/5 backdrop-blur-sm border-2 border-gold rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-serif font-bold text-gold mb-6 text-center">
            Complete Reasoning
          </h2>
          <div className="space-y-4">
            {finalVerdict.reasoning.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="bg-charcoal/50 border border-gold/20 rounded-xl p-5 hover:border-gold/40 transition-all"
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
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartNew}
            className="group relative px-16 py-5 bg-gold text-charcoal font-bold text-lg rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Home className="w-6 h-6" />
              Start New Case
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
