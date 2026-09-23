import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, Send, FileText, IndianRupee } from 'lucide-react';
import { askGemini } from '../api';

const SchemeCard = ({ scheme, index, user }) => {
  const isEligible = scheme.is_eligible;
  const dbScheme = scheme.scheme;
  
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setIsChatting(true);
    try {
      const res = await askGemini(chatInput, user, dbScheme);
      setChatResponse(res.answer);
    } catch (err) {
      setChatResponse("Sorry, I couldn't connect right now. Try again later.");
    } finally {
      setIsChatting(false);
      setChatInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative overflow-hidden mello-card border-2 ${
        isEligible 
          ? 'border-[var(--color-mello-sand)] shadow-lg' 
          : 'border-transparent opacity-80'
      } transition-all duration-300 group`}
    >
      {/* Top Badges */}
      <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 items-end">
        {isEligible ? (
          <div className="bg-[var(--color-mello-terracotta)] text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 size={14} /> Match Found
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <XCircle size={14} /> Not Eligible
          </div>
        )}
      </div>

      <div className="p-8">
        <h3 className={`text-2xl font-serif mb-2 pr-32 ${isEligible ? 'text-[var(--color-mello-terracotta)]' : 'text-gray-500'}`}>
          {scheme.scheme_name}
        </h3>
        
        {/* Benefit Amount (Phase 3) */}
        {dbScheme.benefit_amount_max && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-mello-sand)]/20 text-[var(--color-mello-terracotta)] rounded-full text-sm font-semibold mb-5">
            <IndianRupee size={14} />
            <span>{dbScheme.benefit_amount_max.toLocaleString('en-IN')} {dbScheme.frequency ? `/ ${dbScheme.frequency}` : ''}</span>
            <span className="opacity-70 font-normal ml-1 border-l border-current pl-2">{dbScheme.benefit_type}</span>
          </div>
        )}
        
        {/* AI Explanation & Criteria Breakdown (Phase 1) */}
        <div className="mt-2 p-5 rounded-2xl bg-[var(--color-mello-cream)] relative">
          <div className="absolute -top-3 -left-3 bg-[var(--color-mello-sand)] rounded-full p-2 shadow-sm">
            <Sparkles size={16} className="text-[var(--color-mello-terracotta)]" />
          </div>
          
          <p className="text-[15px] font-medium leading-relaxed text-[var(--color-mello-charcoal)] opacity-90 ml-3 mb-3">
            {scheme.ai_explanation}
          </p>
          
          {scheme.criteria_checked && scheme.criteria_checked.length > 0 && (
            <ul className="ml-3 mt-2 space-y-1 border-t border-[var(--color-mello-sand)]/30 pt-3">
              {scheme.criteria_checked.map((c, i) => (
                <li key={i} className={`text-sm flex items-center gap-2 ${c.passed ? 'text-green-700' : 'text-red-500'}`}>
                  {c.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{c.field}: {c.user_value} {c.passed ? 'meets' : 'fails'} rule ({c.operator} {c.threshold})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Document Checklist (Phase 4) */}
        {isEligible && dbScheme.required_documents && (
          <div className="mt-5">
            <button 
              onClick={() => setShowDocs(!showDocs)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-mello-charcoal)] hover:text-[var(--color-mello-terracotta)] transition-colors"
            >
              <FileText size={16} /> Documents you'll need {showDocs ? '↑' : '↓'}
            </button>
            <AnimatePresence>
              {showDocs && (
                <motion.ul 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pl-6 list-disc text-sm text-[var(--color-mello-charcoal)]/80"
                >
                  {dbScheme.required_documents.map((doc, idx) => (
                    <li key={idx} className="mb-1">{doc}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Gemini Chat Layer (Phase 5) */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Ask AI about this scheme</p>
          {chatResponse && (
            <div className="mb-3 p-3 bg-white border border-[var(--color-mello-sand)] rounded-xl text-sm text-[var(--color-mello-charcoal)]">
              {chatResponse}
            </div>
          )}
          <form onSubmit={handleChat} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="E.g., How do I apply?" 
              className="flex-1 mello-input text-sm py-2 px-4"
              disabled={isChatting}
            />
            <button 
              type="submit" 
              disabled={isChatting || !chatInput.trim()}
              className="mello-button bg-[var(--color-mello-terracotta)] text-white px-4 py-2 hover:bg-orange-800 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
      
      {isEligible && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[var(--color-mello-sand)]" />
      )}
    </motion.div>
  );
};

export default SchemeCard;
