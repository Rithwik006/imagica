import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wand2, Zap, Shield, Image as ImageIcon } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-20 px-4 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-neonPurple/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-neonBlue/20 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neonBlue/30 mb-8">
                        <span className="w-2 h-2 rounded-full bg-neonBlue animate-pulse"></span>
                        <span className="text-xs font-bold tracking-widest text-neonBlue uppercase">Imagica Studio v2.0 Live</span>
                    </div>

                    <h1 className="relative text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
                        <span className="text-white drop-shadow-2xl">
                            The Ultimate
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonBlue via-cyan-300 to-neonPurple drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                            Image Studio
                        </span>
                    </h1>
                </motion.div>

                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed z-10 font-light">
                    Harness professional-grade filters, advanced layers, and high-fidelity restoration tools. Engineered for speed, designed for creatives.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 z-10">
                    <Link
                        to="/register"
                        className="px-10 py-5 rounded-2xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-black text-lg tracking-widest lowercase shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                        START CREATING FREE
                    </Link>
                    <Link
                        to="/#features"
                        className="px-10 py-5 rounded-2xl glass text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 tracking-widest uppercase flex items-center justify-center gap-2"
                    >
                        Explore Tools
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    <FeatureCard
                        icon={<Wand2 className="w-8 h-8 text-neonBlue" />}
                        title="Professional Image Restoration"
                        desc="Upscale and restore details seamlessly with our advanced toolset."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Lightning Fast"
                        desc="Real-time processing optimized for speed on any device."
                    />
                    <FeatureCard
                        icon={<Image className="w-8 h-8 text-pink-500" />}
                        title="Precision Creative Suite"
                        desc="Intelligent object removal and professional background replacement."
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-green-400" />}
                        title="Secure Storage"
                        desc="Enterprise-grade encryption for all your digital assets."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonBlue to-neonPurple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        <div className="bg-white/5 p-4 rounded-2xl w-fit mb-6 group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const Image = ({ className }) => <ImageIcon className={className} />; // Alias wrapper

export default LandingPage;
