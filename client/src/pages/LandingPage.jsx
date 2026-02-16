import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wand2, Zap, Shield, Image as ImageIcon } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-5xl mx-auto py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neonBlue to-neonPurple opacity-30 blur-3xl"></div>
                    <h1 className="relative text-7xl font-bold tracking-tight mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300">
                            Transform Ideas into
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                            Digital Reality
                        </span>
                    </h1>
                </motion.div>

                <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
                    Imagica leverages advanced AI to edit, enhance, and transform your images in seconds.
                    Experience the future of digital creativity with our lightning-fast platform.
                </p>

                <div className="flex gap-6">
                    <Link
                        to="/register"
                        className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105"
                    >
                        Start Creating Free
                    </Link>
                    <Link
                        to="/#features"
                        className="px-8 py-4 rounded-full glass text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
                    >
                        Explore Features
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    <FeatureCard
                        icon={<Wand2 className="w-8 h-8 text-neonBlue" />}
                        title="AI Enhancement"
                        desc="Upscale and restore details seamlessly with our neural networks."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Lightning Fast"
                        desc="Real-time processing optimized for speed on any device."
                    />
                    <FeatureCard
                        icon={<Image className="w-8 h-8 text-pink-500" />}
                        title="Smart Editing"
                        desc="Intelligent object removal and background replacement."
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
