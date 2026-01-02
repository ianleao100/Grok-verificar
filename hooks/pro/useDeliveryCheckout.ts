
import { useState } from 'react';
import { useCustomerSearch } from '../useCustomerSearch';
import { roundFinance, calculatePointsDiscount } from '../../shared/utils/mathEngine';
import { PaymentMethodType, CartItem } from '../../types';
import { DeliveryAddress } from '../../components/admin/pos/delivery/types';

interface UseDeliveryCheckoutProps {
    loyaltySystem: any;
    subtotal: number;
    cart: CartItem[];
    onConfirm: (orderData: any) => void;
}

export const useDeliveryCheckout = ({ loyaltySystem, subtotal, cart, onConfirm }: UseDeliveryCheckoutProps) => {
    const [step, setStep] = useState(1);
    
    // Customer Search
    const searchLogic = useCustomerSearch({ loyaltySystem });
    
    // Fields
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerPoints, setCustomerPoints] = useState(0);
    const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
    
    // Address Form
    const [addressForm, setAddressForm] = useState({
        street: '', number: '', district: '', complement: '', reference: ''
    });

    // Map
    const [geoCoords, setGeoCoords] = useState<{lat: number, lng: number}>({ lat: -14.2233, lng: -42.7766 }); 
    const [manualMapSearch, setManualMapSearch] = useState('');
    const [isLoadingGeo, setIsLoadingGeo] = useState(false);

    // Payment & Options
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('PIX');
    const [cashPaidAmount, setCashPaidAmount] = useState(''); 
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState<number>(5.00); 
    const [discount, setDiscount] = useState<number>(0);
    const [discountType, setDiscountType] = useState<'BRL' | 'PERCENT'>('BRL');
    const [pointsToUse, setPointsToUse] = useState(0);

    // Calculations
    const isStep1Valid = customerName.length > 2 && customerPhone.length >= 14 && addressForm.street.length > 3 && addressForm.number.length > 0 && addressForm.district.length > 2;
    const calculatedDiscount = discountType === 'PERCENT' ? (subtotal * discount) / 100 : discount;
    const pointsDiscountValue = calculatePointsDiscount(pointsToUse); 
    const totalValue = roundFinance(Math.max(0, subtotal + deliveryFee - calculatedDiscount - pointsDiscountValue));
    const cashValue = parseFloat(cashPaidAmount) || 0;
    const changeValue = Math.max(0, cashValue - totalValue);

    // Handlers
    const performGeocode = async (query: string): Promise<{lat: number, lng: number} | null> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return (data && data.length > 0) ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
        } catch { return null; }
    };

    const handleManualMapSearchAction = async () => {
        if (!manualMapSearch.trim()) return;
        setIsLoadingGeo(true);
        let query = manualMapSearch.trim();
        if (!query.toLowerCase().includes('guanambi')) query += ", Guanambi, Bahia, Brazil";
        
        const result = await performGeocode(query) || await performGeocode(manualMapSearch.trim());
        if (result) setGeoCoords(result);
        else alert("Local não encontrado.");
        setIsLoadingGeo(false);
    };

    const fillCustomerData = (found: any) => {
        searchLogic.setCustomerFound(true);
        setCustomerName(found.name);
        setCustomerPhone(found.whatsapp);
        setCustomerPoints(found.points);
        
        let loadedAddresses: DeliveryAddress[] = [];
        if (found.addresses && Array.isArray(found.addresses)) loadedAddresses = found.addresses;
        else if (found.address) loadedAddresses = [found.address.id ? found.address : { id: 'addr-main', label: 'Endereço Principal', ...found.address }];
        
        setSavedAddresses(loadedAddresses);
        if (loadedAddresses.length > 0) handleSelectAddress(loadedAddresses[0].id, loadedAddresses);
        else {
            setSelectedAddressId('new');
            setAddressForm({ street: '', number: '', district: '', complement: '', reference: '' });
        }
        searchLogic.clearSuggestions();
        searchLogic.setSearchTerm(found.name);
    };

    const handleSelectAddress = (id: string, list = savedAddresses) => {
        setSelectedAddressId(id);
        if (id === 'new') {
            setAddressForm({ street: '', number: '', district: '', complement: '', reference: '' });
            setGeoCoords({ lat: -14.2233, lng: -42.7766 });
        } else {
            const addr = list.find(a => a.id === id);
            if (addr) {
                setAddressForm({
                    street: addr.street, number: addr.number, district: addr.district,
                    complement: addr.complement || '', reference: addr.reference || ''
                });
                if (addr.lat && addr.lng) setGeoCoords({ lat: addr.lat, lng: addr.lng });
            }
        }
    };

    const updateAddressField = (field: string, val: string) => {
        setAddressForm(prev => ({ ...prev, [field]: val }));
    };

    const handleFinalize = () => {
        const orderData = {
            customer: {
                name: customerName,
                whatsapp: customerPhone,
                address: `${addressForm.street}, ${addressForm.number} - ${addressForm.district} ${addressForm.complement ? '(' + addressForm.complement + ')' : ''}`,
                pointsUsed: pointsToUse
            },
            delivery: {
                fee: deliveryFee,
                coordinates: geoCoords,
                waived: deliveryFee === 0
            },
            payment: {
                method: paymentMethod,
                total: totalValue,
                subtotal: subtotal,
                discount: calculatedDiscount + pointsDiscountValue,
                changeFor: paymentMethod === 'CASH' ? cashPaidAmount : undefined
            }
        };
        onConfirm(orderData);
    };

    return {
        step, setStep,
        searchLogic,
        customerName, setCustomerName,
        customerPhone, setCustomerPhone,
        customerPoints,
        savedAddresses, selectedAddressId,
        addressForm, updateAddressField,
        handleSelectAddress, fillCustomerData,
        geoCoords, setGeoCoords,
        manualMapSearch, setManualMapSearch,
        handleManualMapSearchAction, isLoadingGeo,
        paymentMethod, setPaymentMethod,
        cashPaidAmount, setCashPaidAmount,
        showMoreOptions, setShowMoreOptions,
        deliveryFee, setDeliveryFee,
        discount, setDiscount,
        discountType, setDiscountType,
        pointsToUse, setPointsToUse,
        isStep1Valid, calculatedDiscount, pointsDiscountValue, totalValue, changeValue,
        handleFinalize
    };
};
