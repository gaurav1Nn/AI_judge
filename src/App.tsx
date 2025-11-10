import { useCaseStore } from './stores/caseStore';
import { LandingPage } from './components/LandingPage';
import { CaseSubmission } from './components/CaseSubmission';
import { ProcessingScreen } from './components/ProcessingScreen';
import { VerdictDisplay } from './components/VerdictDisplay';
import { ArgumentsPhase } from './components/ArgumentsPhase';
import { FinalVerdict } from './components/FinalVerdict';

function App() {
  const phase = useCaseStore((state) => state.phase);

  return (
    <>
      {phase === 'landing' && <LandingPage />}
      {phase === 'submission' && <CaseSubmission />}
      {phase === 'processing' && <ProcessingScreen />}
      {phase === 'verdict' && <VerdictDisplay />}
      {phase === 'arguments' && <ArgumentsPhase />}
      {phase === 'final' && <FinalVerdict />}
    </>
  );
}

export default App;
