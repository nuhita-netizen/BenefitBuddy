import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import Dashboard from './components/Dashboard';
import { submitUserForm, checkEligibility, getUser } from './api';
import { ShieldCheck } from 'lucide-react';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [eligibilityResults, setEligibilityResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('benefitBuddyUserId');
    if (savedUserId) {
      loadSavedSession(savedUserId);
    }
  }, []);

  const loadSavedSession = async (userId) => {
    setIsLoading(true);
    try {
      const userResponse = await getUser(userId);
      const eligibilityResponse = await checkEligibility(userId);
      setCurrentUser(userResponse);
      setEligibilityResults(eligibilityResponse.results);
    } catch (err) {
      console.error("Failed to load saved session", err);
      localStorage.removeItem('benefitBuddyUserId');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSubmit = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create user
      const userResponse = await submitUserForm(userData);
      
      // 2. Check eligibility using the created user's ID
      const eligibilityResponse = await checkEligibility(userResponse.id);
      
      setCurrentUser(userResponse);
      setEligibilityResults(eligibilityResponse.results);
      localStorage.setItem('benefitBuddyUserId', userResponse.id);
    } catch (err) {
      console.error(err);
      setError("An error occurred while connecting to the server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentUser(null);
    setEligibilityResults([]);
    localStorage.removeItem('benefitBuddyUserId');
  };

  return (
    <div className="min-h-screen bg-[var(--color-mello-cream)] text-[var(--color-mello-charcoal)] font-sans selection:bg-[var(--color-mello-sand)]">
      {/* Background Organic Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-mello-sand)] opacity-40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[var(--color-mello-terracotta)] opacity-20 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 py-4 bg-[var(--color-mello-cream)]/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-serif text-[var(--color-mello-charcoal)] tracking-widest uppercase font-bold">
              BenefitBuddy
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-12">
        {error && (
          <div className="w-full absolute top-0 max-w-2xl bg-red-950/50 border border-red-900 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">×</button>
          </div>
        )}

        {!currentUser ? (
          <>
            <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1">
              <img 
                src="/mello_illustration.png" 
                alt="Government Schemes and Insurance Illustration" 
                className="w-full max-w-sm drop-shadow-xl mix-blend-multiply rounded-[3rem]"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <UserForm onSubmit={handleUserSubmit} isLoading={isLoading} />
            </div>
          </>
        ) : (
          <div className="w-full">
            <Dashboard 
              user={currentUser} 
              results={eligibilityResults} 
              onReset={handleReset} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
