
import React from 'react';
import { Clock } from 'lucide-react';

interface KitchenOrderTimerProps {
    elapsedMinutes: number;
}

export const KitchenOrderTimer: React.FC<KitchenOrderTimerProps> = ({ elapsedMinutes }) => {
    const isCritical = elapsedMinutes >= 60;
    const isWarning = elapsedMinutes >= 40 && elapsedMinutes < 60;

    let badgeClass = 'bg-slate-100 text-slate-600';
    if (isWarning) badgeClass = 'bg-yellow-50 text-yellow-700';
    else if (isCritical) badgeClass = 'bg-red-50 text-red-600';

    return (
        <div className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${badgeClass}`}>
            <Clock className="w-3 h-3" />
            {elapsedMinutes} min
        </div>
    );
};
