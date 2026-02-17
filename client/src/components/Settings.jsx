import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Settings as SettingsIcon, BarChart3, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const Settings = () => {
    const { currentUser, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile state
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [profileName, setProfileName] = useState('');

    // Password state
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Stats state
    const [stats, setStats] = useState({
        storageUsed: '0 MB',
        totalProjects: 0,
        credits: 'Free Tier',
        accountCreated: ''
    });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/settings/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setProfileName(data.name || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/settings/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/settings/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: profileName })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfile({ ...profile, name: profileName });
                updateProfile({ name: profileName });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/settings/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswords({ current: '', new: '', confirm: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 max-w-4xl"
        >
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple mb-2">
                    Settings
                </h2>
                <p className="text-gray-400">Manage your account settings and preferences</p>
            </div>

            {/* Message Display */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${message.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                        : 'bg-red-500/20 border border-red-500/50 text-red-300'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Account Statistics */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Statistics</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Storage Used</p>
                        <p className="text-2xl font-bold text-white">{stats.storageUsed}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Projects</p>
                        <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Plan</p>
                        <p className="text-2xl font-bold text-white">{stats.credits}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Member Since</p>
                        <p className="text-lg font-bold text-white">
                            {stats.accountCreated ? new Date(stats.accountCreated).toLocaleDateString() : '-'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Settings */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-neonBlue focus:outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || profileName === profile.name}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Security Settings */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Security</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                placeholder="Enter current password"
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-neonBlue focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-neonBlue focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-neonBlue focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="glass p-6 rounded-2xl border border-red-500/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                </div>

                <p className="text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <button
                    disabled
                    className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold cursor-not-allowed opacity-50"
                >
                    Delete Account (Coming Soon)
                </button>
            </div>
        </motion.div>
    );
};

export default Settings;
