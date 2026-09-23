import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Activity, MapPin, Briefcase, Landmark, CreditCard, Component } from 'lucide-react';

const UserForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'female',
    annual_income: '',
    state: '',
    category: 'general',
    land_holding_acres: '',
    occupation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric fields
    const formattedData = {
      name: formData.name,
      age: parseInt(formData.age, 10) || 0,
      gender: formData.gender,
      income: parseFloat(formData.annual_income) || 0,
      state: formData.state,
      category: formData.category,
      occupation: formData.occupation,
      land_holding: parseFloat(formData.land_holding_acres) || 0
    };
    
    onSubmit(formattedData);
  };

  const inputClasses = "w-full mello-input";
  const labelClasses = "block text-sm font-semibold text-[var(--color-mello-charcoal)] mb-2 flex items-center gap-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="mello-card overflow-hidden relative">
        <div className="p-10">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-serif text-[var(--color-mello-charcoal)]">
              Welcome back
            </h2>
            <p className="text-[var(--color-mello-charcoal)] opacity-70 mt-3 font-medium">
              Tell us a bit about yourself to discover government benefits you may qualify for.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-1 md:col-span-2">
                <label className={labelClasses}>
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className={inputClasses}
                />
              </div>

              {/* Age */}
              <div>
                <label className={labelClasses}>
                  <Activity size={16} /> Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 65"
                  className={inputClasses}
                />
              </div>

              {/* Gender */}
              <div>
                <label className={labelClasses}>
                  <User size={16} /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Income */}
              <div>
                <label className={labelClasses}>
                  <CreditCard size={16} /> Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  name="annual_income"
                  value={formData.annual_income}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 250000"
                  className={inputClasses}
                />
              </div>

              {/* State */}
              <div>
                <label className={labelClasses}>
                  <MapPin size={16} /> State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Maharashtra"
                  className={inputClasses}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelClasses}>
                  <Component size={16} /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label className={labelClasses}>
                  <Briefcase size={16} /> Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Farmer, Student, None"
                  className={inputClasses}
                />
              </div>

              {/* Land Holding */}
              <div className="col-span-1 md:col-span-2">
                <label className={labelClasses}>
                  <Landmark size={16} /> Land Holding (Acres) - Optional
                </label>
                <input
                  type="number"
                  name="land_holding_acres"
                  value={formData.land_holding_acres}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 1.5 (Leave blank if none)"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 mello-button text-lg flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Eligibility...
                  </>
                ) : (
                  'Discover Benefits'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UserForm;
