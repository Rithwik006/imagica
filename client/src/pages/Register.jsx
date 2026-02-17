import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, username);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gray-900 -z-20"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neonBlue/20 blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neonPurple/20 blur-[100px] -z-10"></div>

            <div className="glass p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                    Create Account
                </h2>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/50">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-colors"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue transition-colors"
                            placeholder="••••••••"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-4 text-sm text-gray-400">or continue with</span>
                    <div className="flex-1 border-t border-white/10"></div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                setError('');
                                setLoading(true);
                                await loginWithGoogle(credentialResponse.credential);
                                navigate('/dashboard');
                            } catch (err) {
                                setError('Google signup failed: ' + err.message);
                            }
                            setLoading(false);
                        }}
                        onError={() => {
                            setError('Google signup failed');
                            setLoading(false);
                        }}
                        size="large"
                        shape="pill"
                        width="100%"
                        text="signup_with"
                    />
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neonBlue hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
