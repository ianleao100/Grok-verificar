
import React, { useRef, useState, useEffect } from 'react';
import { Map as MapIcon, Search, Navigation, Minimize2, Maximize2 } from 'lucide-react';

declare const L: any;

interface NewCustomerAddressStepProps {
    addressForm: any;
    setAddressForm: (data: any) => void;
    customerName: string;
    customerWhatsapp: string;
}

export const NewCustomerAddressStep: React.FC<NewCustomerAddressStepProps> = ({ addressForm, setAddressForm, customerName, customerWhatsapp }) => {
    const [mapSearch, setMapSearch] = useState('');
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current && typeof L !== 'undefined') {
            const map = L.map(mapContainerRef.current, { center: [addressForm.lat, addressForm.lng], zoom: 16, zoomControl: false, attributionControl: false });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
            const icon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
            const marker = L.marker([addressForm.lat, addressForm.lng], { draggable: true, icon: icon }).addTo(map);
            
            marker.on('dragend', (e: any) => { const { lat, lng } = e.target.getLatLng(); setAddressForm((prev: any) => ({ ...prev, lat, lng })); });
            map.on('click', (e: any) => { marker.setLatLng(e.latlng); setAddressForm((prev: any) => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng })); });
            
            mapInstanceRef.current = map;
            markerRef.current = marker;
        }
        if (mapInstanceRef.current) setTimeout(() => mapInstanceRef.current.invalidateSize(), 300);
        
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const handleMapSearch = async () => {
        if (!mapSearch) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                setAddressForm((prev: any) => ({ ...prev, lat, lng }));
                if (mapInstanceRef.current && markerRef.current) { const newLatLng = new L.LatLng(lat, lng); markerRef.current.setLatLng(newLatLng); mapInstanceRef.current.setView(newLatLng, 16); }
            } else { alert("Local não encontrado."); }
        } catch (e) { console.error(e); }
    };

    const updateField = (field: string, value: string) => {
        setAddressForm((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="h-full flex flex-col animate-[slideIn_0.3s] p-8 pb-0">
            <div className="flex flex-col lg:flex-row gap-8 h-full min-h-0">
                <div className={isMapFullscreen ? "fixed inset-0 z-[9999] bg-white p-0" : "w-full lg:w-1/2 flex flex-col gap-4"}>
                    <div className={`relative w-full ${isMapFullscreen ? 'h-full' : 'h-[400px] lg:h-full rounded-3xl border border-gray-300'} bg-slate-200 overflow-hidden shadow-inner group transition-all duration-300`}>
                        <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2"><div className="relative flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5"><MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EA2831]" /><input type="text" placeholder="Pesquisar rua..." value={mapSearch} onChange={(e) => setMapSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()} className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0" /></div><button onClick={handleMapSearch} className="px-5 bg-[#EA2831] text-white rounded-2xl shadow-xl hover:bg-red-700 font-bold"><Search className="w-5 h-5" /></button></div>
                        <div ref={mapContainerRef} className="w-full h-full z-0" />
                        <div className="absolute bottom-4 left-4 z-[400] pointer-events-none"><div className="bg-white/90 px-4 py-2 rounded-xl shadow-lg border border-black/5 text-xs font-bold text-slate-700 flex items-center gap-2 backdrop-blur-sm"><Navigation className="w-4 h-4 text-[#EA2831]" /> Arraste o pino para ajustar</div></div>
                        <button onClick={() => setIsMapFullscreen(!isMapFullscreen)} className="absolute bottom-4 right-4 z-[400] p-3 bg-white hover:bg-gray-50 text-slate-700 rounded-xl shadow-lg border border-gray-200 active:scale-95">{isMapFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto no-scrollbar px-1 pb-10 space-y-5">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identificador</label><input value={addressForm.label} onChange={e => updateField('label', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" placeholder="Ex: Casa" /></div>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-9 space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rua</label><input value={addressForm.street} onChange={e => updateField('street', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" /></div>
                            <div className="col-span-3 space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nº</label><input value={addressForm.number} onChange={e => updateField('number', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bairro</label><input value={addressForm.district} onChange={e => updateField('district', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complemento</label><input value={addressForm.complement} onChange={e => updateField('complement', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" /></div>
                        </div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Referência</label><input value={addressForm.reference} onChange={e => updateField('reference', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-[#EA2831] text-sm" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
