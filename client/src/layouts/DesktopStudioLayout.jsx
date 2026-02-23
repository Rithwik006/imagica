import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Image as ImageIcon, Users, Settings as SettingsIcon, Bell, Star } from 'lucide-react';
import ParticleEffect from '../components/ParticleEffect';

const DesktopStudioLayout = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="h-screen w-screen bg-studioBg flex flex-col overflow-hidden text-white font-inter relative">
            {/* Particle Overlay */}
            <ParticleEffect />

            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-50 bg-studioBg/80 backdrop-blur-md">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 15px rgba(0, 243, 255, 0.3)",
                                    "0 0 25px rgba(0, 243, 255, 0.5)",
                                    "0 0 15px rgba(0, 243, 255, 0.3)"
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center"
                        >
                            <Star className="w-5 h-5 text-white fill-current" />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight">Imagica</span>
                    </div>

                    <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'studio' ? 'bg-neonBlue text-studioBg shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => onTabChange('studio')}
                        >
                            Studio View
                        </button>
                        <button
                            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'gallery' ? 'bg-neonBlue text-studioBg shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => onTabChange('gallery')}
                        >
                            Gallery View
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-neonBlue to-neonPurple p-[2px]">
                        <div className="w-full h-full rounded-full bg-studioBg flex items-center justify-center text-xs font-bold">
                            RG
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Fixed Left Sidebar (Navigation) */}
                <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-studioBg">
                    <NavIcon icon={LayoutGrid} active={activeTab === 'canvas'} label="Canvas" onClick={() => onTabChange('canvas')} />
                    <NavIcon icon={ImageIcon} active={activeTab === 'assets'} label="Assets" onClick={() => onTabChange('assets')} />
                    <NavIcon icon={Users} active={activeTab === 'community'} label="Community" onClick={() => onTabChange('community')} />
                    <div className="mt-auto">
                        <NavIcon icon={SettingsIcon} active={activeTab === 'settings'} label="Settings" onClick={() => onTabChange('settings')} />
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-grow flex flex-col relative bg-studioBg studio-grid overflow-hidden">
                    {children}
                </main>
            </div>
        </div >
    );
};

const NavIcon = ({ icon: Icon, active, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 group relative outline-none"
    >
        <div className={`p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-neonBlue/10 text-neonBlue shadow-[0_0_20px_rgba(0,243,255,0.1)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110`} />
            {active && (
                <motion.div
                    layoutId="navGlow"
                    className="absolute inset-0 rounded-2xl border border-neonBlue/30"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </div>
        <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${active ? 'text-neonBlue' : 'text-gray-600 group-hover:text-gray-400'}`}>
            {label}
        </span>
    </button>
);

export default DesktopStudioLayout;
