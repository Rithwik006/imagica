import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUpload from '../components/ImageUpload';
import ProcessingOptions from '../components/ProcessingOptions';
import Settings from '../components/Settings';
import { API_URL } from '../config';

const DashboardOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
            Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-300">Total Projects</h3>
                <p className="text-4xl font-bold text-white mt-2">0</p>
            </div>
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-300">Storage Used</h3>
                <p className="text-4xl font-bold text-white mt-2">0 MB</p>
            </div>
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-300">Credits</h3>
                <p className="text-4xl font-bold text-white mt-2">Free Tier</p>
            </div>
        </div>

        <div className="glass p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <p className="text-gray-400">No recent activity found. Start creating!</p>
        </div>
    </motion.div>
);

const Generate = () => {
    const [result, setResult] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedProcessing, setSelectedProcessing] = React.useState('grayscale');
    const [intensity, setIntensity] = React.useState(5);
    const [showOptions, setShowOptions] = React.useState(false);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setShowOptions(true);
        setResult(null);
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('processingType', selectedProcessing);
        formData.append('intensity', intensity);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setResult(data);
            setShowOptions(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to process image. Make sure the server is running on port 5000.');
        }
    };

    const resetAll = () => {
        setResult(null);
        setSelectedFile(null);
        setShowOptions(false);
        setSelectedProcessing('grayscale');
        setIntensity(5);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple mb-2">
                    Generate Magic
                </h2>
                <p className="text-gray-400">Upload an image and let our AI work its magic.</p>
            </div>

            {!result && !showOptions ? (
                <div className="max-w-4xl mx-auto">
                    <ImageUpload onUpload={handleFileSelect} />
                </div>
            ) : null}

            {showOptions && !result ? (
                <div className="space-y-6">
                    <ProcessingOptions
                        onSelect={setSelectedProcessing}
                        selectedOption={selectedProcessing}
                        intensity={intensity}
                        onIntensityChange={setIntensity}
                    />

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={resetAll}
                            className="px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold"
                        >
                            Change Image
                        </button>
                        <button
                            onClick={() => handleUpload(selectedFile)}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
                        >
                            Apply Effect
                        </button>
                    </div>
                </div>
            ) : null}

            {result ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-4 rounded-3xl overflow-hidden">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 uppercase tracking-wider">Original</h3>
                            <img src={result.originalUrl} alt="Original" className="w-full rounded-2xl h-[400px] object-contain bg-black/20" />
                        </div>
                        <div className="glass p-4 rounded-3xl overflow-hidden border-neonBlue/30 border">
                            <h3 className="text-sm font-semibold text-neonBlue mb-2 px-2 uppercase tracking-wider">Processed</h3>
                            <img src={result.processedUrl} alt="Processed" className="w-full rounded-2xl h-[400px] object-contain bg-black/20" />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={resetAll}
                            className="px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold"
                        >
                            Process Another
                        </button>
                        <a
                            href={result.processedUrl}
                            download
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
                        >
                            Download Result
                        </a>
                    </div>
                </div>
            ) : null}
        </motion.div>
    );
};

const Saved = () => <div className="text-2xl font-bold">Saved Projects</div>;

const Dashboard = () => {
    return (
        <div className="min-h-full pb-10">
            <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="generate" element={<Generate />} />
                <Route path="saved" element={<Saved />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default Dashboard;
