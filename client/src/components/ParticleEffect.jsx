import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleEffect = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const handleInteraction = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            if (!x || !y) return;

            const id = Math.random().toString(36).substr(2, 9);
            const newParticle = {
                id,
                x,
                y,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? '#00f3ff' : '#bc13fe',
                angle: Math.random() * Math.PI * 2,
                velocity: Math.random() * 2 + 1
            };

            setParticles(prev => [...prev.slice(-15), newParticle]);
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== id));
            }, 800);
        };

        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);

        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0.8, x: p.x, y: p.y, scale: 1 }}
                        animate={{
                            opacity: 0,
                            x: p.x + Math.cos(p.angle) * 50 * p.velocity,
                            y: p.y + Math.sin(p.angle) * 50 * p.velocity,
                            scale: 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            boxShadow: `0 0 10px ${p.color}`
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ParticleEffect;
