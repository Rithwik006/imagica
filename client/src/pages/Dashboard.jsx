import React from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Layers, Share2, Shield, Smartphone, Globe, Eye, EyeOff, Search, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import DesktopStudioLayout from '../layouts/DesktopStudioLayout';
import ToolDock from '../components/ToolDock';
import PropertiesPanel from '../components/PropertiesPanel';
import ImageUpload from '../components/ImageUpload';
import ProcessingOptions from '../components/ProcessingOptions';
import Settings from '../components/Settings';

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
        { icon: Sparkles, title: "Pro Filters", desc: "Apply multiple professional grade filters instantly." },
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
    const [searchParams] = useSearchParams();
    const [result, setResult] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedProcessing, setSelectedProcessing] = React.useState(['grayscale']);
    const [intensity, setIntensity] = React.useState(50); // Scale to 100 for proper slider feel
    const [opacity, setOpacity] = React.useState(100);
    const [blur, setBlur] = React.useState(0);
    const [showOptions, setShowOptions] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [activeTool, setActiveTool] = React.useState('select');

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
        <div className="flex flex-grow overflow-hidden relative">
            <ToolDock activeTool={activeTool} onToolSelect={setActiveTool} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow flex flex-col items-center justify-center p-12 overflow-hidden"
            >
                {/* Creative Canvas */}
                <div className="relative w-full max-w-5xl aspect-video bg-black/40 rounded-[32px] border border-white/5 flex items-center justify-center overflow-hidden group shadow-2xl">
                    {!selectedFile && !result ? (
                        <div className="max-w-md w-full p-8 text-center transition-all duration-500 group-hover:scale-105">
                            <div className="w-20 h-20 rounded-3xl bg-neonBlue/10 flex items-center justify-center mx-auto mb-6">
                                <ImageIcon className="w-10 h-10 text-neonBlue" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Drop your asset here</h2>
                            <p className="text-gray-500 text-sm mb-8">Start your next masterpiece by uploading a photo</p>
                            <ImageUpload onUpload={handleFileSelect} />
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <img
                                src={result?.processedUrl || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
                                alt="Canvas"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-500"
                                style={{ opacity: opacity / 100, filter: `blur(${blur}px)` }}
                            />

                            {/* Canvas Controls Overlay */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 glass rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={resetAll} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Discard</button>
                                <div className="w-[1px] h-4 bg-white/10"></div>
                                <span className="text-[10px] font-bold text-neonBlue">124% ZOOM</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                {result && (
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSaveProject}
                            disabled={isSaving}
                            className="px-10 py-4 rounded-2xl glass hover:bg-white/5 transition-all font-bold text-sm tracking-widest disabled:opacity-50"
                        >
                            {isSaving ? 'SAVING...' : 'SAVE TO POSTS'}
                        </button>
                        <a
                            href={result.processedUrl}
                            download={`imagica-${Date.now()}.png`}
                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-neonBlue to-neonPurple text-studioBg font-black text-sm tracking-widest hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all"
                        >
                            DOWNLOAD
                        </a>
                    </div>
                )}
            </motion.div>

            <PropertiesPanel
                opacity={opacity}
                setOpacity={setOpacity}
                blur={blur}
                setBlur={setBlur}
                onFlip={() => { }}
                onCrop={() => { }}
            />
        </div>
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
    const navigate = useNavigate();
    const location = useLocation();

    // Map current path to tab
    const getActiveTab = () => {
        const path = location.pathname.split('/').pop();
        if (path === 'dashboard' || path === 'generate') return 'canvas';
        if (path === 'posts') return 'assets';
        if (path === 'public') return 'community';
        if (path === 'settings') return 'settings';
        return 'studio';
    };

    const handleTabChange = (tab) => {
        const routes = {
            'canvas': '/dashboard/generate',
            'assets': '/dashboard/posts',
            'community': '/dashboard/public',
            'settings': '/dashboard/settings',
            'studio': '/dashboard/generate',
            'gallery': '/dashboard/public'
        };
        navigate(routes[tab] || '/dashboard');
    };

    return (
        <DesktopStudioLayout activeTab={getActiveTab()} onTabChange={handleTabChange}>
            <div className="p-8 pb-20">
                <Routes>
                    <Route index element={<DashboardOverview />} />
                    <Route path="generate" element={<Generate />} />
                    <Route path="posts" element={<YourPosts />} />
                    <Route path="public" element={<PublicFeed />} />
                    <Route path="settings" element={<Settings />} />
                </Routes>
            </div>
        </DesktopStudioLayout>
    );
};

export default Dashboard;
