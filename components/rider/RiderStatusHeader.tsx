
import React from 'react';
import { Bike, Power } from 'lucide-react';

interface RiderStatusHeaderProps {
    onLogout: () => void;
}

export const RiderStatusHeader: React.FC<RiderStatusHeaderProps> = ({ onLogout }) => {
    return (
        <header className="bg-black text-white p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-[#EA2831] p-2 rounded-lg">
                    <Bike className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-widest leading-none">RIDER</h1>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Dreamlícias Express</span>
                </div>
            </div>
            <button onClick={onLogout} className="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <Power className="w-6 h-6" />
            </button>
        </header>
    );
};
