import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SchemeCard from './SchemeCard';
import Insurance from './Insurance';
import { LayoutDashboard, LogOut, FileText, Shield } from 'lucide-react';

const Dashboard = ({ user, results, onReset }) => {
  const [activeTab, setActiveTab] = useState('schemes');
  const eligibleCount = results.filter(r => r.is_eligible).length;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--color-mello-charcoal)] flex items-center gap-3">
            <LayoutDashboard className="text-[var(--color-mello-terracotta)]" />
            Your Dashboard
          </h1>
          <p className="text-[var(--color-mello-charcoal)] opacity-70 font-medium mt-2">
            Welcome back, {user.name}. Here are the benefits you may qualify for.
          </p>
        </div>
        <button 
          onClick={onReset}
          className="px-5 py-2.5 bg-white text-[var(--color-mello-charcoal)] font-semibold rounded-full flex items-center gap-2 shadow-sm border border-[var(--color-mello-sand)] hover:shadow-md transition-all"
        >
          <LogOut size={16} /> Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="mello-card p-6">
          <div className="text-[var(--color-mello-charcoal)] opacity-70 font-semibold mb-2">Schemes Analyzed</div>
          <div className="text-4xl font-serif text-[var(--color-mello-charcoal)]">{results.length}</div>
        </div>
        <div className="mello-card-terracotta p-6">
          <div className="text-white opacity-90 font-semibold mb-2">Eligible For</div>
          <div className="text-4xl font-serif text-white">{eligibleCount}</div>
        </div>
        <div className="mello-card-sand p-6">
          <div className="text-[var(--color-mello-charcoal)] opacity-80 font-semibold mb-2">Status</div>
          <div className="text-xl font-bold text-[var(--color-mello-charcoal)] flex items-center h-full pt-1">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-mello-terracotta)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-mello-terracotta)]"></span>
            </span>
            Analysis Complete
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'schemes' 
            ? 'bg-[var(--color-mello-terracotta)] text-white shadow-md' 
            : 'bg-white text-[var(--color-mello-charcoal)] hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <FileText size={18} /> Government Schemes
        </button>
        <button
          onClick={() => setActiveTab('insurance')}
          className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'insurance' 
            ? 'bg-[var(--color-mello-terracotta)] text-white shadow-md' 
            : 'bg-white text-[var(--color-mello-charcoal)] hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Shield size={18} /> Insurance Plans
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'schemes' && (
          <motion.div
            key="schemes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {results.length === 0 ? (
              <div className="text-[var(--color-mello-charcoal)] opacity-60 text-center py-12 mello-card border border-[var(--color-mello-sand)] border-dashed">
                No schemes found in the database.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...results].sort((a, b) => b.is_eligible - a.is_eligible).map((scheme, idx) => (
                  <SchemeCard key={idx} scheme={scheme} index={idx} user={user} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'insurance' && (
          <motion.div
            key="insurance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Insurance user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
