
import React from 'react';
import { MapPin, Navigation, Phone, User } from 'lucide-react';
import { Order } from '../../types';

interface ActiveDeliveryCardProps {
    order: Order;
    totalStops?: number;
    currentStopIndex?: number;
    onOpenGPS: () => void;
    onWhatsApp: () => void;
    onArrive: () => void;
}

export const ActiveDeliveryCard: React.FC<ActiveDeliveryCardProps> = ({
    order,
    totalStops,
    currentStopIndex,
    onOpenGPS,
    onWhatsApp,
    onArrive
}) => {
    return (
        <div className="flex-1 flex flex-col bg-white h-full animate-[slideIn_0.3s]">
            {/* INFO CARD GIGANTE */}
            <div className="flex-1 p-6 flex flex-col justify-center gap-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-4 h-4" /> Cliente
                        </span>
                        <h2 className="text-4xl font-black text-black leading-tight">{order.customerName}</h2>
                    </div>
                    {order.sector && (
                        <div className="bg-slate-100 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Zona {order.sector}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-3xl">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-8 h-8 text-[#EA2831] shrink-0 mt-1" />
                            <div>
                                <p className="text-2xl font-bold text-gray-800 leading-snug">{order.address}</p>
                                <p className="text-sm font-bold text-gray-400 mt-2 uppercase">Pagamento: {order.paymentMethod}</p>
                                {(order as any).changeFor && (
                                    <p className="text-sm font-black text-red-600 mt-1 uppercase bg-red-50 inline-block px-2 py-1 rounded">
                                        Troco para R$ {(order as any).changeFor}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Indicador de Próximas Entregas */}
                    {totalStops && totalStops > 1 && (
                        <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Mais {totalStops - (currentStopIndex || 1)} entregas nesta rota
                            </p>
                        </div>
                    )}
                </div>

                {/* ACTION BUTTONS GRID */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button onClick={onOpenGPS} className="h-24 bg-blue-600 text-white rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl">
                        <Navigation className="w-8 h-8" />
                        <span className="font-black text-lg uppercase tracking-wider">Abrir GPS</span>
                    </button>
                    <button onClick={onWhatsApp} className="h-24 bg-green-600 text-white rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl">
                        <Phone className="w-8 h-8" />
                        <span className="font-black text-lg uppercase tracking-wider">WhatsApp</span>
                    </button>
                </div>
            </div>

            {/* BOTTOM ACTION */}
            <div className="p-6 pb-8 bg-white border-t border-gray-100">
                <button onClick={onArrive} className="w-full h-20 bg-black text-white rounded-full font-black text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform">
                    <MapPin className="w-6 h-6" /> Cheguei no Local
                </button>
            </div>
        </div>
    );
};
