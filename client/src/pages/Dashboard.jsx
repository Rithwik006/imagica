import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUpload from '../components/ImageUpload';
import ProcessingOptions from '../components/ProcessingOptions';
import Settings from '../components/Settings';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Zap, Layers, Share2, Shield, Smartphone, Globe, Eye, EyeOff } from 'lucide-react';

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
                        storageUsed: '0 MB',
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
    const [selectedProcessing, setSelectedProcessing] = React.useState(['grayscale']);
    const [intensity, setIntensity] = React.useState(5);
    const [strength, setStrength] = React.useState(0.55); // For AI Anime
    const [showOptions, setShowOptions] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isConverting, setIsConverting] = React.useState(false);
    const [mode, setMode] = React.useState('classic'); // 'classic' or 'ai'

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setShowOptions(true);
        setResult(null);
    };

    const handleUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
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
            alert('Processing failed. Please try again.');
        }
    };

    const handleConvertToAnime = async (file) => {
        if (!file) return;
        setIsConverting(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('strength', strength);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/anime`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.details || 'Conversion failed');
            }

            const data = await response.json();
            setResult(data);
            setShowOptions(false);
        } catch (error) {
            console.error('Error converting to anime:', error);
            alert(`Anime conversion failed: ${error.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const resetAll = () => {
        setResult(null);
        setSelectedFile(null);
        setShowOptions(false);
        setSelectedProcessing(['grayscale']);
        setIntensity(5);
        setStrength(0.55);
        setMode('classic');
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
                alert('Project saved! View it in "Your Posts" tab.');
            } else {
                const data = await response.json();
                alert(`Failed to save project: ${data.details || data.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            alert(`Error saving project: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple mb-2">
                        Generate Magic
                    </h2>
                    <p className="text-gray-400">Upload an image and let our AI work its magic.</p>
                </div>
                {!result && !showOptions && (
                    <div className="flex bg-white/5 p-1 rounded-xl glass border border-white/10">
                        <button
                            onClick={() => setMode('classic')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'classic' ? 'bg-neonBlue text-white shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            Classic
                        </button>
                        <button
                            onClick={() => setMode('ai')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${mode === 'ai' ? 'bg-neonPurple text-white shadow-[0_0_15px_rgba(188,19,254,0.3)]' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Sparkles className="w-4 h-4" /> AI Anime
                        </button>
                    </div>
                )}
            </div>

            {!result && !showOptions ? (
                <div className="max-w-4xl mx-auto">
                    <ImageUpload onUpload={handleFileSelect} />
                </div>
            ) : null}

            {showOptions && !result ? (
                <div className="space-y-6">
                    {mode === 'classic' ? (
                        <ProcessingOptions
                            onSelect={setSelectedProcessing}
                            selectedOption={selectedProcessing}
                            intensity={intensity}
                            onIntensityChange={setIntensity}
                        />
                    ) : (
                        <div className="glass p-8 rounded-3xl space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                <div className="p-3 bg-neonPurple/20 rounded-2xl">
                                    <Sparkles className="w-8 h-8 text-neonPurple" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">AI Anime Settings</h3>
                                    <p className="text-gray-400 text-sm">Fine-tune the conversion strength</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-300 font-medium">Conversion Strength</label>
                                    <span className="px-3 py-1 bg-neonPurple/20 rounded-lg text-neonPurple font-bold">
                                        {(strength * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.3"
                                    max="0.8"
                                    step="0.05"
                                    value={strength}
                                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neonPurple"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Realistic (0.3)</span>
                                    <span>Creative (0.8)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={resetAll}
                            disabled={isConverting}
                            className="px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold disabled:opacity-50"
                        >
                            Back
                        </button>
                        {mode === 'classic' ? (
                            <button
                                onClick={() => handleUpload(selectedFile)}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300"
                            >
                                Apply Effects
                            </button>
                        ) : (
                            <button
                                onClick={() => handleConvertToAnime(selectedFile)}
                                disabled={isConverting}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-neonPurple to-magenta text-white font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-all duration-300 flex items-center gap-2"
                            >
                                {isConverting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" /> Convert to Anime
                                    </>
                                )}
                            </button>
                        )}
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
                            {isSaving ? 'Saving...' : 'Save to Posts'}
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

// ─── YOUR POSTS ─────────────────────────────────────────────────────────────
const YourPosts = () => {
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [toggling, setToggling] = React.useState(null);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/posts/mine`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => { fetchPosts(); }, []);

    const handleTogglePublish = async (id) => {
        setToggling(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/posts/publish/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setImages(prev => prev.map(img =>
                    img.id === id ? { ...img, is_public: data.is_public } : img
                ));
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-neonBlue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                    Your Posts
                </h2>
                <p className="text-gray-400 mt-1">Manage your saved images and publish them to the public feed.</p>
            </div>

            {images.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-gray-400 text-lg">No posts yet.</p>
                    <p className="text-gray-500 text-sm mt-2">Process an image and save it to see it here.</p>
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
                                {img.is_public ? (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-neonBlue/80 rounded-full text-xs text-white font-semibold flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Public
                                    </div>
                                ) : (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-full text-xs text-gray-300 font-semibold flex items-center gap-1">
                                        <EyeOff className="w-3 h-3" /> Private
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-neonBlue font-medium capitalize truncate max-w-[130px] text-sm" title={img.processing_type}>
                                        {img.processing_type}
                                    </span>
                                    <span className="text-gray-500 text-xs">{new Date(img.created_at).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => handleTogglePublish(img.id)}
                                    disabled={toggling === img.id}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 ${img.is_public
                                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40'
                                        : 'bg-neonBlue/20 text-neonBlue hover:bg-neonBlue/30 border border-neonBlue/40'
                                        }`}
                                >
                                    {toggling === img.id ? '...' : img.is_public ? 'Unpublish' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// ─── PUBLIC FEED ─────────────────────────────────────────────────────────────
const PublicFeed = () => {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPublic = async () => {
            try {
                const response = await fetch(`${API_URL}/api/posts/public`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Error fetching public feed:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublic();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-neonBlue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple flex items-center gap-3">
                    <Globe className="w-8 h-8 text-neonBlue" /> Public Feed
                </h2>
                <p className="text-gray-400 mt-1">Discover AI-processed images shared by the community.</p>
            </div>

            {posts.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center">
                    <div className="text-6xl mb-4">🌐</div>
                    <p className="text-gray-400 text-lg">No public posts yet.</p>
                    <p className="text-gray-500 text-sm mt-2">Be the first! Go to "Your Posts" and hit Publish.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {posts.map((post) => {
                        const displayName = post.name || post.username || post.email?.split('@')[0] || 'Anonymous';
                        const avatar = displayName[0].toUpperCase();
                        return (
                            <div key={post.id} className="glass rounded-2xl overflow-hidden group hover:bg-white/5 transition-all duration-300 break-inside-avoid mb-6">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={post.processed_url}
                                        alt={post.processing_type}
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neonBlue to-neonPurple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                                            <p className="text-gray-500 text-xs capitalize">{post.processing_type} · {new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                <Route path="posts" element={<YourPosts />} />
                <Route path="public" element={<PublicFeed />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default Dashboard;
