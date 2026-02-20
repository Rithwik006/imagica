import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Image, Globe, Grid, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { currentUser, logout } = useAuth();
    const links = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Generate', path: '/dashboard/generate?mode=classic', icon: Image },
        { name: 'Anime Magic', path: '/dashboard/generate?mode=ai', icon: Sparkles },
        { name: 'Your Posts', path: '/dashboard/posts', icon: Grid },
        { name: 'Public Feed', path: '/dashboard/public', icon: Globe },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="h-screen w-64 glass border-r border-glassBorder flex flex-col fixed left-0 top-0 pt-8 pb-8 z-40">
            {/* Branding */}
            <div className="px-8 pb-8 flex items-center gap-3">
                <div className="bg-gradient-to-tr from-neonBlue to-neonPurple p-2 rounded-lg">
                    {/* Reusing Sparkles icon or just text */}
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Imagica
                </span>
            </div>

            <div className="px-6 flex-grow">
                <div className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === '/dashboard'} // Exact match for root dashboard
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-gradient-to-r from-neonBlue/20 to-transparent text-neonBlue border-l-2 border-neonBlue'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            <div className="px-6 mt-auto space-y-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neonBlue to-neonPurple flex items-center justify-center font-bold text-white text-sm">
                        {currentUser?.name ? currentUser.name[0].toUpperCase() : (currentUser?.email ? currentUser.email[0].toUpperCase() : 'U')}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-medium truncate w-32">{currentUser?.name || currentUser?.username || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate w-32">{currentUser?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
