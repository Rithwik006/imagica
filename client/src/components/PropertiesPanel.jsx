import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Crop, RotateCcw, Maximize, Wand2, ChevronRight } from 'lucide-react';

const PropertiesPanel = ({ opacity, setOpacity, blur, setBlur, onFlip, onCrop }) => {
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
                className="mt-auto w-full group relative overflow-hidden rounded-2xl p-[2px] focus:outline-none"
                onClick={() => {
                    const el = document.getElementById('generate-btn');
                    if (el) el.click();
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-neonBlue via-neonPurple to-neonBlue animate-bg-shift"></div>
                <div className="relative bg-studioBg rounded-[14px] py-4 px-6 flex items-center justify-between group-hover:bg-transparent transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <Wand2 className="w-5 h-5 text-neonBlue group-hover:text-white transition-colors" />
                        <span className="font-bold tracking-tighter text-sm group-hover:text-white transition-colors">GENERATE MASTERPIECE</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
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

const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="glass rounded-2xl flex flex-col items-center justify-center py-6 gap-3 group hover:border-neonBlue/30 hover:bg-white/5 transition-all duration-300 outline-none"
    >
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-neonBlue/10 group-hover:text-neonBlue transition-all duration-300">
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 group-hover:text-white transition-colors">
            {label}
        </span>
    </button>
);

export default PropertiesPanel;
