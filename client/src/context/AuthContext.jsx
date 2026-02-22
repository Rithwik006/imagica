import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';
import { signInWithGoogle, firebaseSignOut, auth } from '../firebase';
import { getRedirectResult } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const AUTH_API_URL = `${API_URL}/api/auth`;

    async function signup(email, password, username) {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to sign up');

        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    async function login(email, password) {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to login');

        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    async function loginWithGoogle() {
        // Step 1: Firebase Google redirect. 
        // This will navigate the user away from the app.
        await signInWithGoogle();
    }

    function logout() {
        localStorage.removeItem('token');
        setCurrentUser(null);
        firebaseSignOut().catch(() => { }); // Also sign out from Firebase silently
    }

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${AUTH_API_URL}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data.user);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth verification failed', error);
                localStorage.removeItem('token');
            }
            setLoading(false);
        };

        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const firebaseUser = result.user;
                    const idToken = await firebaseUser.getIdToken();

                    const response = await fetch(`${AUTH_API_URL}/google-firebase`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Failed to complete Google sign-in');

                    localStorage.setItem('token', data.token);
                    setCurrentUser(data.user);
                }
            } catch (error) {
                console.error("Error handling Google redirect result:", error);
                alert("Google Sign-In failed: " + error.message);
            }
        };

        const initAuth = async () => {
            await checkRedirectResult(); // First check if we're coming back from Google
            await verifyToken();         // Then check our own JWT session
        };

        initAuth();
    }, []);

    const updateProfile = (userData) => {
        setCurrentUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
