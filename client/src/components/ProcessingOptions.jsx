import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Droplet, Zap, Sun, Contrast, ScanLine, Camera, Undo, Grid3x3, Wand2, Smile } from 'lucide-react';

const processingOptions = [
    {
        id: 'grayscale',
        name: 'Grayscale',
        icon: Palette,
        description: 'Classic black & white',
        color: 'from-gray-400 to-gray-600',
        hasIntensity: false
    },
    {
        id: 'sepia',
        name: 'Sepia',
        icon: Camera,
        description: 'Vintage warm tone',
        color: 'from-amber-400 to-orange-600',
        hasIntensity: false
    },
    {
        id: 'blur',
        name: 'Blur',
        icon: Droplet,
        description: 'Soft focus effect',
        color: 'from-blue-400 to-cyan-600',
        hasIntensity: true,
        defaultIntensity: 5,
        min: 1,
        max: 20
    },
    {
        id: 'sharpen',
        name: 'Sharpen',
        icon: Zap,
        description: 'Enhanced details',
        color: 'from-yellow-400 to-amber-600',
        hasIntensity: false
    },
    {
        id: 'brightness',
        name: 'Brightness',
        icon: Sun,
        description: 'Adjust light level',
        color: 'from-yellow-300 to-orange-500',
        hasIntensity: true,
        defaultIntensity: 20,
        min: -50,
        max: 50
    },
    {
        id: 'contrast',
        name: 'Contrast',
        icon: Contrast,
        description: 'Enhance differences',
        color: 'from-purple-400 to-pink-600',
        hasIntensity: true,
        defaultIntensity: 20,
        min: -50,
        max: 50
    },
    {
        id: 'edge',
        name: 'Edge Detection',
        icon: ScanLine,
        description: 'Highlight edges',
        color: 'from-green-400 to-emerald-600',
        hasIntensity: false
    },
    {
        id: 'vintage',
        name: 'Vintage',
        icon: Sparkles,
        description: 'Retro film look',
        color: 'from-rose-400 to-pink-600',
        hasIntensity: false
    },
    {
        id: 'invert',
        name: 'Invert',
        icon: Undo,
        description: 'Negative colors',
        color: 'from-indigo-400 to-purple-600',
        hasIntensity: false
    },
    {
        id: 'pixelate',
        name: 'Pixelate',
        icon: Grid3x3,
        description: 'Retro pixel art',
        color: 'from-cyan-400 to-blue-600',
        hasIntensity: true,
        defaultIntensity: 10,
        min: 5,
        max: 30
    },
    {
        id: 'anime',
        name: 'Anime Style',
        icon: Wand2,
        description: 'Japanese anime art',
        color: 'from-pink-500 to-violet-600',
        hasIntensity: false,
        isAI: true
    },
    {
        id: 'cartoon',
        name: 'Cartoon',
        icon: Smile,
        description: 'Fun cartoon effect',
        color: 'from-orange-500 to-red-600',
        hasIntensity: false,
        isAI: true
    }
];

const ProcessingOptions = ({ onSelect, selectedOption, intensity, onIntensityChange }) => {
    const [hoveredOption, setHoveredOption] = useState(null);

    const handleSelect = (option) => {
        onSelect(option.id);
    };

    const selectedOptionData = processingOptions.find(opt => opt.id === selectedOption);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
                    Choose Your Effect
                </h3>
                <p className="text-gray-400">Select a processing filter to apply to your image</p>
            </div>

            {/* Processing Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {processingOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = selectedOption === option.id;
                    const isHovered = hoveredOption === option.id;

                    return (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onMouseEnter={() => setHoveredOption(option.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={() => handleSelect(option)}
                            className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 ${isSelected
                                ? 'glass border-2 border-neonBlue shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                                : 'glass hover:bg-white/10'
                                }`}
                        >
                            {/* Gradient Background on Hover/Select */}
                            {(isSelected || isHovered) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.1 }}
                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color}`}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                                {/* Icon */}
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color} bg-opacity-20`}>
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-neonBlue' : 'text-white'}`} />
                                </div>

                                {/* Name */}
                                <div>
                                    <h4 className={`font-bold text-sm ${isSelected ? 'text-neonBlue' : 'text-white'}`}>
                                        {option.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                                    {option.isAI && (
                                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full">
                                            AI
                                        </span>
                                    )}
                                </div>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 w-3 h-3 bg-neonBlue rounded-full shadow-[0_0_10px_rgba(0,243,255,0.8)]"
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Intensity Slider for Selected Option */}
            {selectedOptionData?.hasIntensity && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass p-6 rounded-2xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white">Adjust Intensity</h4>
                        <span className="text-neonBlue font-bold text-lg">{intensity}</span>
                    </div>

                    <div className="relative">
                        <input
                            type="range"
                            min={selectedOptionData.min}
                            max={selectedOptionData.max}
                            value={intensity}
                            onChange={(e) => onIntensityChange(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neonBlue slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Min ({selectedOptionData.min})</span>
                            <span>Max ({selectedOptionData.max})</span>
                        </div>
                    </div>

                    <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              background: linear-gradient(135deg, #00f3ff, #a855f7);
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
            }

            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: linear-gradient(135deg, #00f3ff, #a855f7);
              border-radius: 50%;
              cursor: pointer;
              border: none;
              box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
            }
          `}</style>
                </motion.div>
            )}
        </div>
    );
};

export default ProcessingOptions;
