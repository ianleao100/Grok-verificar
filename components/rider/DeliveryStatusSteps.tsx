
import React from 'react';
import { ShieldCheck, CheckCircle, Camera } from 'lucide-react';

interface DeliveryStatusStepsProps {
    validationCode: string;
    setValidationCode: (val: string) => void;
    onValidate: () => void;
    onTakePhoto: () => void;
    onBackToRoute: () => void;
    showCamera: boolean;
    setShowCamera: (show: boolean) => void;
    isLastStop?: boolean;
}

export const DeliveryStatusSteps: React.FC<DeliveryStatusStepsProps> = ({
    validationCode,
    setValidationCode,
    onValidate,
    onTakePhoto,
    onBackToRoute,
    showCamera,
    setShowCamera,
    isLastStop = true
}) => {
    
    // MOCK CAMERA OVERLAY
    if (showCamera) {
        return (
            <div className="fixed inset-0 z-[200] bg-black flex flex-col">
                <div className="flex-1 bg-gray-900 relative">
                    <div className="absolute inset-0 border-[2px] border-white/30 m-8 rounded-3xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold uppercase tracking-widest">
                        Câmera Ativa
                    </div>
                </div>
                <div className="h-32 bg-black flex items-center justify-center gap-10">
                    <button onClick={() => setShowCamera(false)} className="text-white font-bold uppercase">Cancelar</button>
                    <button onClick={onTakePhoto} className="size-20 bg-white rounded-full border-4 border-gray-300 active:scale-90 transition-transform"></button>
                    <div className="w-16"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#EA2831] h-full text-white animate-[slideUp_0.3s]">
            <div className="p-8 pt-12 flex flex-col items-center text-center gap-6">
                <ShieldCheck className="w-20 h-20" />
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Validar Entrega</h2>
                    <p className="text-white/80 font-bold mt-2">Solicite o código ao cliente</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-t-[40px] p-8 flex flex-col gap-8 shadow-2xl text-black">
                {/* INPUT CODE */}
                <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block text-center">Código de Segurança</label>
                    <input 
                        type="tel" 
                        maxLength={6}
                        value={validationCode}
                        onChange={(e) => setValidationCode(e.target.value)}
                        placeholder="000000"
                        className="w-full h-24 text-center text-5xl font-black tracking-[0.5em] border-b-4 border-gray-200 focus:border-[#EA2831] outline-none text-black placeholder:text-gray-200 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                    <button 
                        onClick={onValidate}
                        disabled={validationCode.length < 4}
                        className="h-20 w-full bg-[#EA2831] disabled:bg-gray-300 text-white rounded-3xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                    >
                        <CheckCircle className="w-8 h-8" /> 
                        {!isLastStop ? 'Próxima Entrega' : 'Finalizar Rota'}
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OU</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button 
                        onClick={() => setShowCamera(true)}
                        className="h-16 w-full bg-black text-white rounded-3xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
                    >
                        <Camera className="w-6 h-6" /> Foto Comprovante
                    </button>
                    
                    <button 
                        onClick={onBackToRoute}
                        className="text-gray-400 font-bold text-sm uppercase p-4"
                    >
                        Voltar para Rota
                    </button>
                </div>
            </div>
        </div>
    );
};
