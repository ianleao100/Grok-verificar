
import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

interface CustomDatePickerProps {
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, placeholder = "Selecione a data" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, alignRight: false });

    // Estado interno para navegação do calendário
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [time, setTime] = useState({ hours: '23', minutes: '59' });

    // Sincroniza com o valor externo (value)
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setSelectedDate(date);
                setViewDate(date);
                setTime({
                    hours: date.getHours().toString().padStart(2, '0'),
                    minutes: date.getMinutes().toString().padStart(2, '0')
                });
            }
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    // Calcula posição ao abrir
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const dropdownWidth = 288; // w-72 = 18rem = 288px
            
            // Se for vazar para a direita, alinha à direita do input
            const alignRight = (rect.left + dropdownWidth) > screenWidth;

            setPosition({
                top: rect.bottom + window.scrollY + 8, // 8px de margem
                left: alignRight ? (rect.right + window.scrollX) : (rect.left + window.scrollX),
                alignRight
            });
        }
    }, [isOpen]);

    // Fecha ao clicar fora e ao rolar a janela (para evitar desconexão visual)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Verifica se o clique foi dentro do portal do calendário (se estivesse usando portal, aqui usamos fixed direto no DOM)
                const calendarEl = document.getElementById('fixed-calendar-popover');
                if (calendarEl && calendarEl.contains(event.target as Node)) return;
                
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true); // true para capturar scroll de qualquer container
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDayClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        newDate.setHours(parseInt(time.hours), parseInt(time.minutes));
        
        const isoString = toLocalISOString(newDate);
        onChange(isoString);
        // Não fecha automaticamente para permitir ajuste de hora se quiser, ou pode fechar
        // setIsOpen(false); 
    };

    const handleTimeChange = (field: 'hours' | 'minutes', val: string) => {
        let cleanVal = val.replace(/\D/g, '').slice(0, 2);
        
        if (field === 'hours' && parseInt(cleanVal) > 23) cleanVal = '23';
        if (field === 'minutes' && parseInt(cleanVal) > 59) cleanVal = '59';

        const newTime = { ...time, [field]: cleanVal };
        setTime(newTime);

        if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(parseInt(newTime.hours || '0'), parseInt(newTime.minutes || '0'));
            onChange(toLocalISOString(newDate));
        }
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
        setViewDate(newDate);
    };

    const toLocalISOString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSelectedDate(null);
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const displayValue = selectedDate 
        ? `${selectedDate.getDate().toString().padStart(2,'0')}/${(selectedDate.getMonth()+1).toString().padStart(2,'0')}/${selectedDate.getFullYear()} ${time.hours}:${time.minutes}` 
        : '';

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Input Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 cursor-pointer group hover:border-[#EA2831] transition-all h-[42px]"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <CalendarIcon className={`w-4 h-4 shrink-0 transition-colors ${displayValue ? 'text-[#EA2831]' : 'text-slate-400 group-hover:text-[#EA2831]'}`} />
                    <span className={`text-xs font-bold truncate ${displayValue ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {displayValue || placeholder}
                    </span>
                </div>
                {value && (
                    <button onClick={handleClear} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Popover Calendar (Fixed Position to break overflow) */}
            {isOpen && (
                <div 
                    id="fixed-calendar-popover"
                    style={{ 
                        position: 'fixed', 
                        top: position.top, 
                        left: position.alignRight ? 'auto' : position.left,
                        right: position.alignRight ? (window.innerWidth - position.left) : 'auto',
                        zIndex: 9999 
                    }}
                    className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-72 animate-[fadeIn_0.2s] font-sans"
                >
                    {/* Header: Mês/Ano */}
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-500 hover:text-[#EA1D2C]">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-black text-slate-800 dark:text-white capitalize text-sm">
                            {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-500 hover:text-[#EA1D2C]">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 text-center mb-2">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {days.map((day, idx) => {
                            if (day === null) return <div key={idx} />;
                            
                            const isSelected = selectedDate && 
                                selectedDate.getDate() === day && 
                                selectedDate.getMonth() === viewDate.getMonth() && 
                                selectedDate.getFullYear() === viewDate.getFullYear();
                            
                            const isToday = 
                                new Date().getDate() === day && 
                                new Date().getMonth() === viewDate.getMonth() && 
                                new Date().getFullYear() === viewDate.getFullYear();

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDayClick(day)}
                                    className={`
                                        h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                        ${isSelected 
                                            ? 'bg-[#EA1D2C] text-white shadow-md shadow-red-500/30' 
                                            : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300'
                                        }
                                        ${!isSelected && isToday ? 'text-[#EA1D2C] ring-1 ring-[#EA1D2C]' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Time Picker */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Horário</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-100 dark:border-gray-700 focus-within:border-[#EA1D2C] transition-colors">
                            <input 
                                type="text" 
                                value={time.hours} 
                                onChange={(e) => handleTimeChange('hours', e.target.value)}
                                className="w-6 text-center bg-transparent border-none font-bold text-xs focus:ring-0 p-0 text-slate-700 dark:text-white selection:bg-[#EA1D2C] selection:text-white"
                                placeholder="HH"
                            />
                            <span className="font-bold text-slate-400 text-xs">:</span>
                            <input 
                                type="text" 
                                value={time.minutes} 
                                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                className="w-6 text-center bg-transparent border-none font-bold text-xs focus:ring-0 p-0 text-slate-700 dark:text-white selection:bg-[#EA1D2C] selection:text-white"
                                placeholder="MM"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
