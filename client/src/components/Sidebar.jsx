import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Image, Star, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const links = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Generate', path: '/dashboard/generate', icon: Image },
        { name: 'Saved', path: '/dashboard/saved', icon: Star },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="h-screen w-64 glass border-r border-glassBorder flex flex-col fixed left-0 top-0 pt-24 pb-8 z-40">
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

            <div className="px-6 mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
