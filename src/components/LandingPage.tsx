import { motion } from 'framer-motion';
import { Scale, FileText, MessageSquare, Gavel } from 'lucide-react';
import { useCaseStore } from '../stores/caseStore';
import { useEffect, useState } from 'react';

export const LandingPage = () => {
  const setPhase = useCaseStore((state) => state.setPhase);
  const [casesAnalyzed] = useState(1247);
  const [accuracy] = useState(89);
  const [animatedCases, setAnimatedCases] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);

  useEffect(() => {
    const casesInterval = setInterval(() => {
      setAnimatedCases((prev) => {
        if (prev >= casesAnalyzed) {
          clearInterval(casesInterval);
          return casesAnalyzed;
        }
        return prev + 23;
      });
    }, 20);

    const accuracyInterval = setInterval(() => {
      setAnimatedAccuracy((prev) => {
        if (prev >= accuracy) {
          clearInterval(accuracyInterval);
          return accuracy;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(casesInterval);
      clearInterval(accuracyInterval);
    };
  }, [casesAnalyzed, accuracy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#242424] to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}></div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-blue opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-20 pb-16"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-8"
          >
            <Scale className="w-24 h-24 text-gold mx-auto" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-7xl md:text-8xl font-bold text-cream mb-6 leading-tight"
          >
            Justice, Simulated.
            <br />
            <span className="text-gold">Truth, Revealed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-cream/70 text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          >
            Experience the future of legal analysis with AI-powered verdict simulation.
            Present your case, argue your position, witness impartial judgment.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.6 }}
            onClick={() => setPhase('submission')}
            className="group relative px-12 py-5 bg-gold text-charcoal font-bold text-lg rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Gavel className="w-6 h-6" />
              Start New Trial
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold via-yellow-400 to-gold"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ opacity: 0.3 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-20"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-cream/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 text-center"
          >
            <motion.div
              key={animatedCases}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-gold mb-2 font-serif"
            >
              {animatedCases.toLocaleString()}+
            </motion.div>
            <div className="text-cream/70 text-sm uppercase tracking-wider">Cases Analyzed</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-cream/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 text-center"
          >
            <motion.div
              key={animatedAccuracy}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-gold mb-2 font-serif"
            >
              {animatedAccuracy}%
            </motion.div>
            <div className="text-cream/70 text-sm uppercase tracking-wider">Accuracy Rate</div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              icon: FileText,
              title: 'Case Submission',
              description: 'Both parties present evidence and arguments in a structured format',
            },
            {
              icon: Scale,
              title: 'AI Analysis',
              description: 'Advanced algorithms evaluate evidence and apply legal principles',
            },
            {
              icon: MessageSquare,
              title: 'Rebuttal Phase',
              description: 'Up to 5 counter-arguments per side for comprehensive deliberation',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 text-center hover:border-gold/30 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-gold mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-cream font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-20 text-cream/40 text-sm"
        >
          For educational purposes only. Not real legal advice.
        </motion.div>
      </div>
    </div>
  );
};
