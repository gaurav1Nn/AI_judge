import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Send, Shield, Sword, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useArgumentsStore } from '../stores/argumentsStore';
import { useCaseStore } from '../stores/caseStore';
import { useVerdictStore } from '../stores/verdictStore';
import { supabase } from '../lib/supabase';
import { generateArgumentResponse, generateFinalVerdict } from '../utils/mockAI';

export const ArgumentsPhase = () => {
  const { arguments: allArguments, sideACount, sideBCount, addArgument, incrementCount } =
    useArgumentsStore();
  const currentCase = useCaseStore((state) => state.currentCase);
  const setPhase = useCaseStore((state) => state.setPhase);
  const { initialVerdict, setFinalVerdict } = useVerdictStore();

  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [argumentText, setArgumentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  const canSubmitA = sideACount < 5;
  const canSubmitB = sideBCount < 5;

  const handleSubmitArgument = async (side: 'A' | 'B') => {
    if (!argumentText.trim() || !currentCase?.id) return;

    const count = side === 'A' ? sideACount : sideBCount;
    if (count >= 5) return;

    setIsSubmitting(true);
    setAiThinking(true);

    try {
      const response = await generateArgumentResponse(argumentText, count + 1, side);

      const { data, error } = await supabase
        .from('arguments')
        .insert({
          case_id: currentCase.id,
          side,
          argument_number: count + 1,
          argument_text: argumentText,
          ai_response: response.response,
          strength_rating: response.strengthRating,
        })
        .select()
        .single();

      if (error) throw error;

      addArgument(data);
      incrementCount(side);
      setArgumentText('');
    } catch (error) {
      console.error('Error submitting argument:', error);
      alert('Error submitting argument. Please try again.');
    } finally {
      setIsSubmitting(false);
      setAiThinking(false);
    }
  };

  const handleProceedToFinal = async () => {
    if (!currentCase?.id || !initialVerdict) return;

    setIsSubmitting(true);
    setPhase('processing');

    try {
      const finalVerdictData = await generateFinalVerdict(initialVerdict, allArguments);

      const { data, error } = await supabase
        .from('verdicts')
        .insert({
          case_id: currentCase.id,
          verdict_type: 'final',
          favor: finalVerdictData.favor,
          reasoning: finalVerdictData.reasoning,
          confidence: finalVerdictData.confidence,
          legal_sections: finalVerdictData.legal_sections,
          similar_cases: finalVerdictData.similar_cases,
        })
        .select()
        .single();

      if (error) throw error;

      setFinalVerdict(data);

      await supabase.from('cases').update({ status: 'final' }).eq('id', currentCase.id);

      setTimeout(() => {
        setPhase('final');
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating final verdict:', error);
      alert('Error generating final verdict. Please try again.');
      setIsSubmitting(false);
      setPhase('arguments');
    }
  };

  const sideAArguments = allArguments.filter((arg) => arg.side === 'A');
  const sideBArguments = allArguments.filter((arg) => arg.side === 'B');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#242424] to-charcoal py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-5xl font-bold text-cream mb-4">Arguments Phase</h1>
          <p className="text-cream/60 text-lg">
            Present rebuttals to challenge the verdict • Up to 5 arguments per side
          </p>
        </motion.div>

        <div className="hidden lg:grid lg:grid-cols-12 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-4 bg-gradient-to-br from-electric-blue/10 to-electric-blue/5 border-l-4 border-electric-blue rounded-2xl p-6 transform hover:scale-[1.02] transition-all"
            style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px) rotateY(-2deg)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cream">{currentCase?.side_a_name}</h2>
                <div className="text-electric-blue/70 text-sm">Side A</div>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < sideACount ? 'bg-electric-blue shadow-lg shadow-electric-blue/50' : 'bg-cream/10'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {sideAArguments.map((arg, index) => (
                <motion.div
                  key={arg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-charcoal/50 rounded-lg p-4 border border-electric-blue/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-electric-blue font-bold text-sm">Argument {arg.argument_number}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        arg.strength_rating === 'Strong'
                          ? 'bg-green-500/20 text-green-400'
                          : arg.strength_rating === 'Moderate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {arg.strength_rating}
                    </span>
                  </div>
                  <p className="text-cream/80 text-sm mb-3">{arg.argument_text}</p>
                  <div className="bg-charcoal/70 rounded p-3 border-l-2 border-gold/30">
                    <div className="text-gold text-xs font-semibold mb-1">AI Response</div>
                    <p className="text-cream/60 text-xs">{arg.ai_response}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <textarea
              value={activeTab === 'A' ? argumentText : ''}
              onChange={(e) => {
                setActiveTab('A');
                setArgumentText(e.target.value);
              }}
              onFocus={() => setActiveTab('A')}
              placeholder="Enter your rebuttal argument..."
              disabled={!canSubmitA || isSubmitting}
              className="w-full px-4 py-3 bg-charcoal/50 border border-cream/20 rounded-lg text-cream placeholder-cream/40 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              rows={4}
            />

            <button
              onClick={() => handleSubmitArgument('A')}
              disabled={!canSubmitA || isSubmitting || !argumentText.trim() || activeTab !== 'A'}
              className="w-full py-3 bg-electric-blue text-white font-bold rounded-lg hover:bg-electric-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Argument ({sideACount}/5)
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-4 bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold rounded-2xl p-8 relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

            <div className="text-center">
              <motion.div
                animate={aiThinking ? { rotate: [0, 360] } : {}}
                transition={aiThinking ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                className="inline-block mb-6"
              >
                <Gavel className="w-16 h-16 text-gold" strokeWidth={1.5} />
              </motion.div>

              <h3 className="font-serif text-3xl font-bold text-gold mb-4">AI Judge</h3>

              {aiThinking ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        className="w-3 h-3 bg-gold rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-cream/60 text-sm">Considering argument...</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-cream/70 mb-6 leading-relaxed">
                    The court is attentively reviewing all submitted arguments and counter-arguments.
                    Each rebuttal is being weighed against the established evidence and legal precedents.
                  </p>

                  <div className="bg-charcoal/50 rounded-xl p-6 border border-gold/20">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-electric-blue mb-1">{sideACount}</div>
                        <div className="text-cream/60 text-xs">Arguments</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-crimson mb-1">{sideBCount}</div>
                        <div className="text-cream/60 text-xs">Arguments</div>
                      </div>
                    </div>
                  </div>

                  {(sideACount > 0 || sideBCount > 0) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleProceedToFinal}
                      disabled={isSubmitting}
                      className="mt-6 w-full py-4 bg-gold text-charcoal font-bold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Generate Final Verdict
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-4 bg-gradient-to-br from-crimson/10 to-crimson/5 border-l-4 border-crimson rounded-2xl p-6 transform hover:scale-[1.02] transition-all"
            style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px) rotateY(2deg)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crimson/20 rounded-full flex items-center justify-center">
                <Sword className="w-6 h-6 text-crimson" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cream">{currentCase?.side_b_name}</h2>
                <div className="text-crimson/70 text-sm">Side B</div>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < sideBCount ? 'bg-crimson shadow-lg shadow-crimson/50' : 'bg-cream/10'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {sideBArguments.map((arg) => (
                <motion.div
                  key={arg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-charcoal/50 rounded-lg p-4 border border-crimson/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-crimson font-bold text-sm">Argument {arg.argument_number}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        arg.strength_rating === 'Strong'
                          ? 'bg-green-500/20 text-green-400'
                          : arg.strength_rating === 'Moderate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {arg.strength_rating}
                    </span>
                  </div>
                  <p className="text-cream/80 text-sm mb-3">{arg.argument_text}</p>
                  <div className="bg-charcoal/70 rounded p-3 border-l-2 border-gold/30">
                    <div className="text-gold text-xs font-semibold mb-1">AI Response</div>
                    <p className="text-cream/60 text-xs">{arg.ai_response}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <textarea
              value={activeTab === 'B' ? argumentText : ''}
              onChange={(e) => {
                setActiveTab('B');
                setArgumentText(e.target.value);
              }}
              onFocus={() => setActiveTab('B')}
              placeholder="Enter your rebuttal argument..."
              disabled={!canSubmitB || isSubmitting}
              className="w-full px-4 py-3 bg-charcoal/50 border border-cream/20 rounded-lg text-cream placeholder-cream/40 focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              rows={4}
            />

            <button
              onClick={() => handleSubmitArgument('B')}
              disabled={!canSubmitB || isSubmitting || !argumentText.trim() || activeTab !== 'B'}
              className="w-full py-3 bg-crimson text-white font-bold rounded-lg hover:bg-crimson/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Argument ({sideBCount}/5)
            </button>
          </motion.div>
        </div>

        <div className="lg:hidden">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('A')}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                activeTab === 'A'
                  ? 'bg-electric-blue text-white'
                  : 'bg-cream/5 text-cream/60'
              }`}
            >
              {currentCase?.side_a_name} ({sideACount}/5)
            </button>
            <button
              onClick={() => setActiveTab('B')}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                activeTab === 'B'
                  ? 'bg-crimson text-white'
                  : 'bg-cream/5 text-cream/60'
              }`}
            >
              {currentCase?.side_b_name} ({sideBCount}/5)
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'A' ? (
              <motion.div
                key="sideA"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Mobile content for Side A */}
              </motion.div>
            ) : (
              <motion.div
                key="sideB"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Mobile content for Side B */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
