
import React, { useRef, useState } from 'react';
import { ImagePlus, Wand2, Loader2, Upload } from 'lucide-react';
import { generateDishImage } from '../../../services/geminiService';

interface ProductMediaUploadProps {
    imageUrl: string;
    productName: string;
    onImageChange: (url: string) => void;
}

export const ProductMediaUpload: React.FC<ProductMediaUploadProps> = ({ imageUrl, productName, onImageChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageInput, setImageInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onImageChange(event.target!.result as string);
                    setImageInput('');
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleProcessUrl = () => {
        if (!imageInput.trim()) return;
        onImageChange(imageInput);
        setImageInput('');
    };

    const handleGenerateImage = async () => {
        if (!productName) { alert('Preencha o nome do produto primeiro.'); return; }
        try {
            setIsLoading(true);
            const img = await generateDishImage(productName);
            if (img) onImageChange(img);
        } catch (error) {
            console.error("Erro imagem IA:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div 
                className="aspect-[16/9] w-full bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden relative group border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-[#EA2831] transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-[#EA2831] transition-colors">
                        <Upload className="w-10 h-10 opacity-50 mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload Imagem</span>
                    </div>
                )}
                
                <div className="absolute bottom-2 right-2 z-20">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleGenerateImage(); }} 
                        disabled={isLoading} 
                        className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-[#EA2831] hover:text-white transition-all flex items-center gap-2 shadow-lg disabled:opacity-80 border border-gray-200"
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        {isLoading ? '...' : 'IA'}
                    </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>
            
            <div className="relative group">
                <input 
                    value={imageInput} 
                    onChange={e => setImageInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleProcessUrl()}
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#EA2831]" 
                    placeholder="Ou cole URL..." 
                />
                <button onClick={handleProcessUrl} disabled={!imageInput} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#EA2831] disabled:opacity-50"><Upload className="w-4 h-4" /></button>
            </div>
        </div>
    );
};
