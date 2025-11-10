import { motion } from 'framer-motion';
import { FileText, Upload, X, Gavel } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCaseStore } from '../stores/caseStore';
import { useVerdictStore } from '../stores/verdictStore';
import { supabase, DocumentMetadata } from '../lib/supabase';
import { generateCaseNumber, generateInitialVerdict } from '../utils/mockAI';

export const CaseSubmission = () => {
  const { currentCase, updateCase, addDocument, removeDocument, setPhase } = useCaseStore();
  const setInitialVerdict = useVerdictStore((state) => state.setInitialVerdict);

  const [caseType, setCaseType] = useState('Criminal');
  const [title, setTitle] = useState('');
  const [sideAName, setSideAName] = useState('Plaintiff');
  const [sideADetails, setSideADetails] = useState('');
  const [sideBName, setSideBName] = useState('Defendant');
  const [sideBDetails, setSideBDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sideADocs = (currentCase?.side_a_documents as DocumentMetadata[]) || [];
  const sideBDocs = (currentCase?.side_b_documents as DocumentMetadata[]) || [];

  const createDropzone = (side: 'A' | 'B') => {
    return useDropzone({
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/plain': ['.txt'],
      },
      maxSize: 5 * 1024 * 1024,
      onDrop: (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          const doc: DocumentMetadata = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          };
          addDocument(side, doc);
        });
      },
    });
  };

  const dropzoneA = createDropzone('A');
  const dropzoneB = createDropzone('B');

  const handleSubmit = async () => {
    if (!title || !sideADetails || !sideBDetails) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const caseNumber = generateCaseNumber();

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          case_number: caseNumber,
          case_type: caseType,
          title,
          side_a_name: sideAName,
          side_a_details: sideADetails,
          side_a_documents: sideADocs,
          side_b_name: sideBName,
          side_b_details: sideBDetails,
          side_b_documents: sideBDocs,
          status: 'processing',
        })
        .select()
        .single();

      if (caseError) throw caseError;

      updateCase(caseData);
      setPhase('processing');

      const verdict = await generateInitialVerdict(caseType, sideADetails, sideBDetails);

      const { data: verdictData, error: verdictError } = await supabase
        .from('verdicts')
        .insert({
          case_id: caseData.id,
          verdict_type: 'initial',
          favor: verdict.favor,
          reasoning: verdict.reasoning,
          confidence: verdict.confidence,
          legal_sections: verdict.legal_sections,
          similar_cases: verdict.similar_cases,
        })
        .select()
        .single();

      if (verdictError) throw verdictError;

      setInitialVerdict(verdictData);

      await supabase
        .from('cases')
        .update({ status: 'verdict' })
        .eq('id', caseData.id);

      setPhase('verdict');
    } catch (error) {
      console.error('Error submitting case:', error);
      alert('Error submitting case. Please try again.');
      setIsSubmitting(false);
    }
  };

  const loadSampleCase = (type: 'Criminal' | 'Civil') => {
    if (type === 'Criminal') {
      setTitle('State vs. Kumar - Theft Case');
      setSideAName('Prosecution');
      setSideADetails(
        'Kumar allegedly stole gold jewelry worth ₹2 lakhs from Mehta Jewelers on March 15th. CCTV footage shows defendant near the scene at 10:47 PM. Fingerprints matching defendant found on the safe. Store manager testified seeing defendant earlier that day. Digital timestamp records confirm presence. Three witnesses place defendant in vicinity during theft timeframe.'
      );
      setSideBName('Defense');
      setSideBDetails(
        'Alibi confirmed by three independent witnesses placing Kumar at family gathering 5km away. CCTV timestamp disputed by forensic expert - metadata shows potential tampering. Fingerprints explainable as Kumar visited shop two days prior as legitimate customer, receipt available. Store manager admits poor lighting conditions. No stolen items recovered from defendant\'s possession.'
      );
    } else {
      setTitle('Shah vs. Property Developers Ltd - Contract Breach');
      setSideAName('Plaintiff');
      setSideADetails(
        'Contract explicitly promised 1200 sq ft apartment, delivered only 980 sq ft. Three-month delay beyond agreed possession date. Quality defects in flooring and plumbing discovered during inspection. Builder refused rectification despite multiple complaints. RERA-registered agreement shows clear specifications. Independent surveyor report confirms measurement discrepancies.'
      );
      setSideBName('Defendant');
      setSideBDetails(
        'RERA-approved plans clearly show 1000 sq ft (+/- 5% variation allowed under regulation). Delay caused by unprecedented monsoon season, force majeure clause applicable. Defects are minor and covered under two-year warranty, repair team offered within 48 hours. Plaintiff refused access for repairs. Industry standard measurements followed. Good faith effort demonstrated throughout.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-[#242424] to-charcoal">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-5xl font-bold text-cream mb-4">Submit Your Case</h1>
          <p className="text-cream/60 text-lg">Present evidence from both sides for impartial AI analysis</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <div className="bg-cream/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cream text-sm font-semibold mb-3">Case Type</label>
                <div className="flex gap-3">
                  {['Criminal', 'Civil', 'Contract'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCaseType(type)}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        caseType === type
                          ? 'bg-gold text-charcoal shadow-lg'
                          : 'bg-cream/5 text-cream/70 hover:bg-cream/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-cream text-sm font-semibold mb-3">Quick Load Sample</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => loadSampleCase('Criminal')}
                    className="flex-1 py-3 px-4 rounded-lg font-medium bg-cream/5 text-cream/70 hover:bg-cream/10 transition-all text-sm"
                  >
                    Criminal Sample
                  </button>
                  <button
                    onClick={() => loadSampleCase('Civil')}
                    className="flex-1 py-3 px-4 rounded-lg font-medium bg-cream/5 text-cream/70 hover:bg-cream/10 transition-all text-sm"
                  >
                    Civil Sample
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-cream text-sm font-semibold mb-3">Case Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., State vs. Kumar - Theft Case"
                className="w-full px-4 py-3 bg-charcoal/50 border border-cream/20 rounded-lg text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-electric-blue/10 to-electric-blue/5 backdrop-blur-sm border-l-4 border-electric-blue rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <input
                    type="text"
                    value={sideAName}
                    onChange={(e) => setSideAName(e.target.value)}
                    className="text-2xl font-bold text-cream bg-transparent border-none outline-none w-full"
                  />
                  <div className="text-electric-blue/70 text-sm">Side A</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-cream text-sm font-semibold mb-3">Case Details</label>
                <textarea
                  value={sideADetails}
                  onChange={(e) => setSideADetails(e.target.value)}
                  placeholder="Present your case, evidence, and arguments..."
                  rows={8}
                  className="w-full px-4 py-3 bg-charcoal/50 border border-cream/20 rounded-lg text-cream placeholder-cream/40 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all resize-none"
                />
                <div className="text-right mt-2 text-cream/40 text-sm">{sideADetails.length} characters</div>
              </div>

              <div>
                <label className="block text-cream text-sm font-semibold mb-3">Documents</label>
                <div
                  {...dropzoneA.getRootProps()}
                  className="border-2 border-dashed border-electric-blue/30 rounded-lg p-6 text-center cursor-pointer hover:border-electric-blue/60 hover:bg-electric-blue/5 transition-all"
                >
                  <input {...dropzoneA.getInputProps()} />
                  <Upload className="w-8 h-8 text-electric-blue/60 mx-auto mb-2" />
                  <p className="text-cream/60 text-sm">Drag files or click to upload</p>
                  <p className="text-cream/40 text-xs mt-1">PDF, DOC, DOCX, TXT (max 5MB)</p>
                </div>

                {sideADocs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sideADocs.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between bg-charcoal/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-electric-blue" />
                          <div>
                            <div className="text-cream text-sm">{doc.name}</div>
                            <div className="text-cream/40 text-xs">
                              {(doc.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument('A', doc.name)}
                          className="text-cream/60 hover:text-crimson transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-crimson/10 to-crimson/5 backdrop-blur-sm border-l-4 border-crimson rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-crimson/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-crimson" />
                </div>
                <div>
                  <input
                    type="text"
                    value={sideBName}
                    onChange={(e) => setSideBName(e.target.value)}
                    className="text-2xl font-bold text-cream bg-transparent border-none outline-none w-full"
                  />
                  <div className="text-crimson/70 text-sm">Side B</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-cream text-sm font-semibold mb-3">Case Details</label>
                <textarea
                  value={sideBDetails}
                  onChange={(e) => setSideBDetails(e.target.value)}
                  placeholder="Present your case, evidence, and arguments..."
                  rows={8}
                  className="w-full px-4 py-3 bg-charcoal/50 border border-cream/20 rounded-lg text-cream placeholder-cream/40 focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/20 transition-all resize-none"
                />
                <div className="text-right mt-2 text-cream/40 text-sm">{sideBDetails.length} characters</div>
              </div>

              <div>
                <label className="block text-cream text-sm font-semibold mb-3">Documents</label>
                <div
                  {...dropzoneB.getRootProps()}
                  className="border-2 border-dashed border-crimson/30 rounded-lg p-6 text-center cursor-pointer hover:border-crimson/60 hover:bg-crimson/5 transition-all"
                >
                  <input {...dropzoneB.getInputProps()} />
                  <Upload className="w-8 h-8 text-crimson/60 mx-auto mb-2" />
                  <p className="text-cream/60 text-sm">Drag files or click to upload</p>
                  <p className="text-cream/40 text-xs mt-1">PDF, DOC, DOCX, TXT (max 5MB)</p>
                </div>

                {sideBDocs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sideBDocs.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between bg-charcoal/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-crimson" />
                          <div>
                            <div className="text-cream text-sm">{doc.name}</div>
                            <div className="text-cream/40 text-xs">
                              {(doc.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument('B', doc.name)}
                          className="text-cream/60 hover:text-crimson transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="relative px-16 py-5 bg-gold text-charcoal font-bold text-lg rounded-full shadow-2xl hover:shadow-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Gavel className="w-6 h-6" />
                {isSubmitting ? 'Submitting...' : 'Submit to AI Judge'}
              </span>
              {!isSubmitting && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
