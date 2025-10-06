import React, { useState } from 'react';
import { User, Mail, Edit3, Save, Briefcase, Calendar, ShieldCheck, KeyRound, Bell, Zap, Star, BarChart2, DollarSign, Target } from 'lucide-react';

// A reusable card component for consistent styling
const ProfileCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-md">
    <div className="p-4 border-b flex items-center gap-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

// A component for displaying a piece of information, which can turn into an input
const InfoField = ({ label, value, isEditing, name, onChange, type = 'text', options = [] }) => {
  const renderEditingField = () => {
    if (type === 'select') {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {isEditing ? renderEditingField() : <p className="text-gray-900">{value}</p>}
    </div>
  );
};

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'John Trader',
    title: 'Quantitative Analyst',
    email: 'john.trader@example.com',
    memberSince: 'January 2024',
    riskTolerance: 'Medium',
    experienceLevel: 'Advanced',
    assetClasses: 'Equities, Crypto',
    apiKey: '**********-abcd',
    twoFactorEnabled: true,
    plan: 'Pro Tier',
  });

  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    setUser(formData);
    console.log('User data saved:', formData);
    setIsEditing(false);
  };

  const getBadgeColor = (value) => {
    switch (value.toLowerCase()) {
      case 'high': case 'aggressive': case 'advanced': return 'bg-red-100 text-red-800';
      case 'medium': case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'low': case 'beginner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Account Overview</h2>
        {isEditing ? (
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-sm">
            <Save size={16} /> Save All Changes
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 border">
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard title="Personal Information" icon={<User className="text-blue-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
              <InfoField label="Email Address" name="email" type="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} />
              <InfoField label="Role / Title" name="title" value={formData.title} isEditing={isEditing} onChange={handleInputChange} />
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                <p className="text-gray-900">{user.memberSince}</p>
              </div>
            </div>
          </ProfileCard>
          
          <ProfileCard title="Trading Preferences" icon={<BarChart2 className="text-green-500" />}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="Risk Tolerance" 
                  name="riskTolerance" 
                  value={formData.riskTolerance} 
                  isEditing={isEditing} 
                  onChange={handleInputChange}
                  type="select"
                  options={['Low', 'Medium', 'High', 'Aggressive']}
                />
                 <InfoField 
                  label="Experience Level" 
                  name="experienceLevel" 
                  value={formData.experienceLevel} 
                  isEditing={isEditing} 
                  onChange={handleInputChange}
                  type="select"
                  options={['Beginner', 'Intermediate', 'Advanced', 'Professional']}
                />
                <InfoField 
                  label="Preferred Asset Classes" 
                  name="assetClasses" 
                  value={formData.assetClasses} 
                  isEditing={isEditing} 
                  onChange={handleInputChange}
                  placeholder="e.g., Equities, Crypto, Forex"
                />
             </div>
          </ProfileCard>

           <ProfileCard title="Security Settings" icon={<ShieldCheck className="text-purple-500" />}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">API Key</label>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-900 font-mono text-sm">{isEditing ? formData.apiKey : '••••••••••••' + user.apiKey.slice(-4)}</p>
                        {isEditing && <button className="text-xs text-blue-600 hover:underline">Generate New</button>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Two-Factor Authentication (2FA)</label>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        {isEditing && <button className="text-xs text-blue-600 hover:underline">Manage</button>}
                    </div>
                </div>
             </div>
          </ProfileCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <ProfileCard title="Subscription Plan" icon={<Star className="text-yellow-500" />}>
              <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Plan</label>
                  <p className="font-semibold text-lg text-gray-900">{user.plan}</p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              </div>
              <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Manage Subscription
              </button>
           </ProfileCard>
        </div>
      </div>
    </div>
  );
}

