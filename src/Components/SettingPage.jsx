import React, { useState } from 'react';
import { User, ShieldCheck, Bell, BarChart2, Save } from 'lucide-react';

// A reusable card component for consistent styling
const SettingsCard = ({ title, icon, children }) => (
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

// A reusable input field component
const InputField = ({ label, name, type, value, onChange, placeholder = '' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// A reusable toggle switch component
const ToggleSwitch = ({ label, name, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
      />
      <label htmlFor={name} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
    </div>
  </div>
);


export default function SettingsPage() {
  // Use a single state object to manage all settings
  const [settings, setSettings] = useState({
    // Account
    fullName: 'John Trader',
    email: 'john.trader@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // Security
    twoFactorEnabled: true,
    // Notifications
    emailOnTrade: true,
    emailOnAlert: true,
    emailSystemUpdates: false,
    // Trading
    tradingPreference: 'Moderate',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, you'd send this data to your backend API
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
    // Clear password fields after saving for security
    setSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-sm"
        >
          <Save size={16} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <SettingsCard title="Account Information" icon={<User className="text-blue-500" />}>
            <InputField label="Full Name" name="fullName" type="text" value={settings.fullName} onChange={handleInputChange} />
            <InputField label="Email Address" name="email" type="email" value={settings.email} onChange={handleInputChange} />
          </SettingsCard>

          <SettingsCard title="Change Password" icon={<ShieldCheck className="text-purple-500" />}>
            <InputField label="Current Password" name="currentPassword" type="password" value={settings.currentPassword} onChange={handleInputChange} placeholder="••••••••" />
            <InputField label="New Password" name="newPassword" type="password" value={settings.newPassword} onChange={handleInputChange} placeholder="••••••••" />
            <InputField label="Confirm New Password" name="confirmPassword" type="password" value={settings.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
          </SettingsCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SettingsCard title="Security" icon={<ShieldCheck className="text-green-500" />}>
            <ToggleSwitch label="Enable Two-Factor Authentication (2FA)" name="twoFactorEnabled" checked={settings.twoFactorEnabled} onChange={handleInputChange} />
          </SettingsCard>

          <SettingsCard title="Notification Preferences" icon={<Bell className="text-yellow-500" />}>
            <ToggleSwitch label="Email me on trade execution" name="emailOnTrade" checked={settings.emailOnTrade} onChange={handleInputChange} />
            <ToggleSwitch label="Email me when a price alert is triggered" name="emailOnAlert" checked={settings.emailOnAlert} onChange={handleInputChange} />
            <ToggleSwitch label="Email me about system updates and news" name="emailSystemUpdates" checked={settings.emailSystemUpdates} onChange={handleInputChange} />
          </SettingsCard>

          <SettingsCard title="Trading Preferences" icon={<BarChart2 className="text-red-500" />}>
            <div>
              <label htmlFor="tradingPreference" className="block text-sm font-medium text-gray-700 mb-1">Default Risk Profile</label>
              <select
                id="tradingPreference"
                name="tradingPreference"
                value={settings.tradingPreference}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </select>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}