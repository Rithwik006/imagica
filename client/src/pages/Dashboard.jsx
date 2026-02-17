import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUpload from '../components/ImageUpload';
import ProcessingOptions from '../components/ProcessingOptions';
import Settings from '../components/Settings';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Zap, Layers, Share2, Shield, Smartphone } from 'lucide-react';

const DashboardOverview = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = React.useState({ totalProjects: 0, storageUsed: '0 MB', credits: 'Free Tier' });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/settings/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalProjects: data.totalImages || 0,
                        storageUsed: '0 MB', // Placeholder as backend might not calculate size yet
                        credits: 'Free Tier'
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const features = [
        { icon: Sparkles, title: "Smart Filters", desc: "Apply multiple professional grade filters instantly." },
        { icon: Zap, title: "Fast Processing", desc: "Real-time image manipulation with optimized algorithms." },
        { icon: Layers, title: "Batch Editing", desc: "Layer multiple effects to create unique styles." },
        { icon: Share2, title: "Easy Export", desc: "Download high-quality results or save to your cloud gallery." },
        { icon: Shield, title: "Secure Storage", desc: "Your images are processed securely and private to you." },
        { icon: Smartphone, title: "Responsive", desc: "Works seamlessly across all your devices." }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                        Welcome back
                    </h2>
                    <p className="text-gray-400 mt-2">Ready to create something amazing today?</p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-16 h-16" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300">Total Projects</h3>
                    <p className="text-4xl font-bold text-white mt-2">{stats.totalProjects}</p>
                </div>
                <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Layers className="w-16 h-16" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300">Storage Used</h3>
                    <p className="text-4xl font-bold text-white mt-2">{stats.storageUsed}</p>
                </div>
                <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-16 h-16" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300">Fast Processing</h3>
                    <p className="text-base text-gray-400 mt-2"> Optimized for speed</p>
                </div>
            </div>

            <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">App Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="p-3 bg-neonBlue/10 rounded-lg h-fit">
                                <feature.icon className="w-6 h-6 text-neonBlue" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Generate = () => {
    const [result, setResult] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedProcessing, setSelectedProcessing] = React.useState(['grayscale']); // Array for multiple filters
    const [intensity, setIntensity] = React.useState(5);
    const [showOptions, setShowOptions] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setShowOptions(true);
        setResult(null);
    };

    const handleUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        // Send processing types as JSON string or individual fields depending on backend expectation
        // Here we send as JSON string to handle array
        formData.append('processingType', JSON.stringify(selectedProcessing));
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
            // alert('Failed to process image. Make sure the server is running on port 5000.');
            // Better error handling UI could be added
        }
    };

    const resetAll = () => {
        setResult(null);
        setSelectedFile(null);
        setShowOptions(false);
        setSelectedProcessing(['grayscale']);
        setIntensity(5);
    };

    const handleSaveProject = async () => {
        if (!result) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    originalUrl: result.originalUrl,
                    processedUrl: result.processedUrl,
                    processingType: Array.isArray(result.processingType) ? result.processingType.join(', ') : result.processingType
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Project saved successfully! View it in the "Saved" tab.');
            } else {
                alert('Failed to save project.');
            }
        } catch (e) {
            console.error(e);
            alert('Error saving project.');
        } finally {
            setIsSaving(false);
        }
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
                            Back
                        </button>
                        <button
                            onClick={() => handleUpload(selectedFile)}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
                        >
                            Apply Effects
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

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={resetAll}
                            className="px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold"
                        >
                            Process Another
                        </button>
                        <button
                            onClick={handleSaveProject}
                            disabled={isSaving}
                            className="px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Project'}
                        </button>
                        <a
                            href={result.processedUrl}
                            download={`processed-${Date.now()}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
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

const Saved = () => {
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/images`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setImages(data);
                }
            } catch (error) {
                console.error('Error fetching saved images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <div className="text-white text-center mt-10">Loading saved projects...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                Saved Projects
            </h2>

            {images.length === 0 ? (
                <div className="glass p-8 rounded-2xl text-center text-gray-400">
                    No saved projects found. Start creating!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="glass p-4 rounded-2xl group hover:bg-white/5 transition-all">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                <img
                                    src={img.processed_url}
                                    alt="Processed"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a
                                        href={img.processed_url}
                                        download={`saved-${img.id}.png`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                        title="Download"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    </a>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex flex-col">
                                    <span className="text-neonBlue font-medium capitalize truncate max-w-[150px]" title={img.processing_type}>
                                        {img.processing_type}
                                    </span>
                                    <span className="text-gray-500 text-xs">{new Date(img.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

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
