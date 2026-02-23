import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Crop, RotateCcw, Maximize, Wand2, ChevronRight } from 'lucide-react';

const PropertiesPanel = ({ opacity, setOpacity, blur, setBlur, onGenerate, isGenerating, disabled }) => {
    return (
        <aside className="w-80 border-l border-white/5 bg-studioBg/50 backdrop-blur-xl flex flex-col p-6 gap-8 z-40">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Properties</h3>
                <Settings className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>

            {/* Adjustment Group */}
            <div className="space-y-8">
                <AdjustmentSlider
                    label="Opacity"
                    value={opacity}
                    onChange={setOpacity}
                    unit="%"
                    color="bg-neonBlue"
                    glow="shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                />
                <AdjustmentSlider
                    label="Blur Intensity"
                    value={blur}
                    onChange={setBlur}
                    unit="PX"
                    color="bg-neonPurple"
                    glow="shadow-[0_0_15px_rgba(188,19,254,0.5)]"
                />
            </div>

            {/* Main Action Button */}
            <button
                className={`mt-auto w-full group relative overflow-hidden rounded-2xl p-[2px] focus:outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] cursor-pointer ${isGenerating ? 'opacity-80 pointer-events-none' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    if (isGenerating) return;
                    if (disabled) {
                        alert("Please upload a photo first to generate!");
                        return;
                    }
                    onGenerate();
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-neonBlue via-neonPurple to-neonBlue animate-bg-shift opacity-100"></div>
                <div className="relative bg-studioBg/90 hover:bg-transparent rounded-[14px] py-4 px-6 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        {isGenerating ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-neonBlue rounded-full animate-spin" />
                        ) : (
                            <Wand2 className="w-5 h-5 text-neonBlue group-hover:text-white transition-colors" />
                        )}
                        <span className="font-black tracking-[0.15em] text-sm uppercase text-white transition-colors">
                            {isGenerating ? 'PROCESSING...' : 'GENERATE MASTERPIECE'}
                        </span>
                    </div>
                    {!isGenerating && <ChevronRight className="w-4 h-4 text-neonBlue group-hover:text-white transition-colors" />}
                </div>
            </button>
        </aside>
    );
};

const AdjustmentSlider = ({ label, value, onChange, unit, color, glow }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <label className="text-xs uppercase tracking-widest font-bold text-gray-500">{label}</label>
            <span className="text-sm font-bold text-white tracking-widest">{value}{unit}</span>
        </div>
        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden group cursor-pointer">
            <div
                className={`absolute top-0 left-0 h-full ${color} ${glow} transition-all duration-300`}
                style={{ width: `${value}%` }}
            ></div>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
        </div>
    </div>
);

export default PropertiesPanel;
