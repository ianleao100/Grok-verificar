
import React from 'react';
import { Users } from 'lucide-react';

interface RetentionTableProps {
    data: any[];
}

export const RetentionTable: React.FC<RetentionTableProps> = ({ data }) => {
    return (
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-blue-500" /> Retenção por Campanha (30 dias)
            </h3>
            
            <div className="flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-tl-xl">Cupom / Campanha</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Usaram</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Retornaram</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right rounded-tr-xl">Taxa de Retenção</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((camp, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-sm text-slate-700">{camp.name}</td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">{camp.used}</td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">{camp.returned}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                        camp.rate >= 50 ? 'bg-green-100 text-green-700' :
                                        camp.rate >= 25 ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                        {camp.rate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
