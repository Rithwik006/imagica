import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setGoogleLoading(true);
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Google sign-in failed: ' + err.message);
        }
        setGoogleLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-900 -z-20"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neonPurple/20 blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neonBlue/20 blur-[100px] -z-10"></div>

            <div className="glass p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                    Welcome Back
                </h2>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-colors"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-4 text-sm text-gray-400">or</span>
                    <div className="flex-1 border-t border-white/10"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full py-3 rounded-xl bg-white text-gray-800 font-semibold text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
                >
                    {googleLoading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    )}
                    {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-neonBlue hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
