
import React from 'react';
import { MapPin, Bike } from 'lucide-react';
import { DashboardGeoMap } from '../tabs/DashboardGeoMap';
import { formatCurrency } from '../../../shared/utils/mathEngine';

interface GeoMapSectionProps {
    points: { lat: number; lng: number; weight: number }[];
    topNeighborhoods: { name: string; value: number }[];
}

export const GeoMapSection: React.FC<GeoMapSectionProps> = ({ points, topNeighborhoods }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 p-1 flex flex-col h-96">
                <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#EA2831]" /> Pontos de Calor</h3>
                </div>
                <div className="flex-1 rounded-[28px] overflow-hidden m-1 mt-0 relative">
                    <DashboardGeoMap points={points} />
                </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Bike className="w-5 h-5 text-slate-700" /> Top Bairros</h3>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                    {topNeighborhoods.map((bairro, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="flex size-6 items-center justify-center bg-white rounded-lg text-xs font-black text-slate-400 shadow-sm">{idx + 1}</span>
                                <span className="text-sm font-bold text-slate-700">{bairro.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">{formatCurrency(bairro.value)}</span>
                        </div>
                    ))}
                    {topNeighborhoods.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Sem dados de entrega.</p>}
                </div>
            </div>
        </div>
    );
};
