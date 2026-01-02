
import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { ActiveDeliveryCard } from './ActiveDeliveryCard';
import { DeliveryStatusSteps } from './DeliveryStatusSteps';

interface ActiveDeliveryProps {
    order: Order;
    onUpdateStatus: (order: Order, status: OrderStatus) => void;
    totalStops?: number;
    currentStopIndex?: number;
}

export default function ActiveDelivery({ order, onUpdateStatus, totalStops, currentStopIndex }: ActiveDeliveryProps) {
    const [viewState, setViewState] = useState<'ROUTE' | 'VALIDATION'>('ROUTE');
    const [validationCode, setValidationCode] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    
    const latitude = order.coordinates?.lat || -23.550520;
    const longitude = order.coordinates?.lng || -46.633308;

    const handleOpenGPS = () => {
        window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, '_blank');
    };

    const handleWhatsApp = () => {
        const phone = order.customerWhatsapp?.replace(/\D/g, '');
        if (phone) window.open(`https://wa.me/55${phone}`, '_blank');
    };

    const handleValidateCode = () => {
        if (validationCode === order.code || validationCode === '0000') { 
            onUpdateStatus(order, OrderStatus.DELIVERED);
        } else {
            alert('Código Inválido! Tente novamente.');
        }
    };

    const handleTakePhoto = () => {
        setShowCamera(false);
        onUpdateStatus(order, OrderStatus.DELIVERED);
    };

    if (viewState === 'VALIDATION') {
        return (
            <DeliveryStatusSteps 
                validationCode={validationCode}
                setValidationCode={setValidationCode}
                onValidate={handleValidateCode}
                onTakePhoto={handleTakePhoto}
                onBackToRoute={() => setViewState('ROUTE')}
                showCamera={showCamera}
                setShowCamera={setShowCamera}
                isLastStop={!totalStops || !currentStopIndex || totalStops <= currentStopIndex}
            />
        );
    }

    return (
        <ActiveDeliveryCard 
            order={order}
            totalStops={totalStops}
            currentStopIndex={currentStopIndex}
            onOpenGPS={handleOpenGPS}
            onWhatsApp={handleWhatsApp}
            onArrive={() => setViewState('VALIDATION')}
        />
    );
}
