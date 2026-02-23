import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen flex flex-col text-white">
            {/* Show Navbar on non-dashboard pages */}
            {!isDashboard && <Navbar />}

            <div className="flex flex-grow relative z-10">
                {/* Redundant Sidebar removed in favor of DesktopStudioLayout in Dashboard */}

                <main className={`flex-grow ${isDashboard ? 'h-screen pt-0' : 'pt-24 px-4'}`}>
                    {children}
                </main>
            </div>

            {/* Global Background */}
            <div className="fixed inset-0 -z-10 bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black"></div>

            {/* CSS Grid Pattern */}
            <div
                className="fixed inset-0 -z-10 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(180deg, white, rgba(255,255,255,0))'
                }}
            ></div>
        </div>
    );
};

export default Layout;
