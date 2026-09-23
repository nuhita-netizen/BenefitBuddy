import React, { useState, useEffect } from 'react';
import { getInsurancePlans } from '../api';
import { Shield, ShieldAlert, ArrowUpDown, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const Insurance = ({ user }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'claim_settlement_ratio', direction: 'desc' });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getInsurancePlans();
        
        // Personalize insurance recommendations
        const filtered = data.filter(plan => {
          if (!user) return true;
          
          // Kanyadan policy is strictly for parents of young girls
          if (plan.plan_name === 'Kanyadan Policy') {
            return user.gender === 'female' && user.age <= 18;
          }
          // Term life and accident insurance generally require adult age (18+)
          if (plan.plan_name === 'PMJJBY' || plan.plan_name === 'PMSBY' || plan.plan_name === 'eShield Next') {
            return user.age >= 18;
          }
          // Health insurance is universally applicable
          return true;
        });
        
        setPlans(filtered);
      } catch (err) {
        console.error("Failed to load insurance plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [user]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlans = [...plans].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <div className="text-center p-12 text-[var(--color-mello-charcoal)]">Loading Insurance Comparison...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border-4 border-white/40 backdrop-blur-sm relative overflow-hidden">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-[var(--color-mello-terracotta)]">Insurance Comparator</h2>
          <p className="text-gray-500 font-medium">Compare Govt vs Private schemes directly.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--color-mello-sand)]/50">
              <th className="py-4 font-semibold text-gray-500">Plan Details</th>
              <th className="py-4 font-semibold text-gray-500 cursor-pointer hover:text-[var(--color-mello-terracotta)]" onClick={() => handleSort('cover_amount')}>
                <div className="flex items-center gap-1">Cover <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-4 font-semibold text-gray-500 cursor-pointer hover:text-[var(--color-mello-terracotta)]" onClick={() => handleSort('premium_annual')}>
                <div className="flex items-center gap-1">Premium/Yr <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-4 font-semibold text-gray-500 cursor-pointer hover:text-[var(--color-mello-terracotta)]" onClick={() => handleSort('claim_settlement_ratio')}>
                <div className="flex items-center gap-1">Claim Ratio <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-4 font-semibold text-gray-500">Tenure</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlans.map((plan, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={plan.id} 
                className="border-b border-gray-100 hover:bg-[var(--color-mello-cream)]/50 transition-colors"
              >
                <td className="py-4">
                  <div className="font-semibold text-lg flex items-center gap-2">
                    {plan.is_government ? (
                      <Shield className="text-[var(--color-mello-terracotta)]" size={18} />
                    ) : (
                      <ShieldAlert className="text-blue-500" size={18} />
                    )}
                    {plan.plan_name}
                  </div>
                  <div className="text-sm text-gray-500">{plan.provider_name} ({plan.type})</div>
                </td>
                <td className="py-4 font-semibold text-[var(--color-mello-charcoal)]">
                  ₹{plan.cover_amount.toLocaleString('en-IN')}
                </td>
                <td className="py-4">
                  {plan.premium_annual === 0 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">FREE</span>
                  ) : (
                    <span className="font-medium flex items-center"><IndianRupee size={12}/>{plan.premium_annual.toLocaleString('en-IN')}</span>
                  )}
                </td>
                <td className="py-4">
                  <span className={`font-bold ${plan.claim_settlement_ratio > 95 ? 'text-green-600' : 'text-orange-500'}`}>
                    {plan.claim_settlement_ratio}%
                  </span>
                </td>
                <td className="py-4 text-gray-500">{plan.tenure_years} Yr</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Insurance;
