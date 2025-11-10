import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import { useEffect, useState } from 'react';

const loadingMessages = [
  'Analyzing submitted evidence...',
  'Reviewing legal precedents...',
  'Evaluating argument strength...',
  'Cross-referencing case law...',
  'Weighing testimony credibility...',
  'Forming preliminary judgment...',
];

export const ProcessingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-charcoal via-[#0d0d0d] to-charcoal z-50 flex items-center justify-center">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 text-center">
        <motion.div
          className="relative mb-12"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Scale className="w-32 h-32 text-gold mx-auto" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-40 h-40 border-4 border-gold/30 rounded-full"></div>
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-48 border-2 border-gold/20 rounded-full"></div>
          </motion.div>
        </motion.div>

        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-serif font-bold text-cream mb-3">
            {loadingMessages[messageIndex]}
          </h2>
        </motion.div>

        <div className="w-80 mx-auto">
          <div className="relative">
            <svg className="w-32 h-32 mx-auto transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(212, 175, 55, 0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(212, 175, 55, 1)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 352' }}
                animate={{
                  strokeDasharray: `${(progress / 100) * 352} 352`,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold font-serif">{progress}%</div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-6 text-cream/60 text-sm"
          >
            Rendering judgment...
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-gold rounded-full"
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cream/10">
        <motion.div
          className="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
