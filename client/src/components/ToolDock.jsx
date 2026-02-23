import React from 'react';
import { MousePointer2, Pencil, Shapes, Type, Image as ImageIcon, Layers, MinusCircle, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ToolDock = ({ activeTool, onToolSelect }) => {
    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'brush', icon: Pencil, label: 'Draw' },
        { id: 'shapes', icon: Shapes, label: 'Shapes' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'image', icon: ImageIcon, label: 'Library' },
    ];

    return (
        <div className="fixed left-24 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-2 glass rounded-3xl z-40">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 group outline-none ${activeTool === tool.id
                            ? 'bg-neonBlue text-studioBg shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <tool.icon className="w-6 h-6" />

                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 px-3 py-1 bg-white text-studioBg text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {tool.label}
                    </div>
                </button>
            ))}

            <div className="w-8 h-[1px] bg-white/10 my-2"></div>

            <button className="p-4 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all outline-none">
                <Layers className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ToolDock;
