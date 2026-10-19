import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  CheckCircle, 
  MapPin, 
  Phone 
} from 'lucide-react';
import { api } from '../api';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  updateQty, 
  removeFromCart, 
  clearCart, 
  lang, 
  t, 
  settings 
}) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Lohke Kalan');
  const [deliveryType, setDeliveryType] = useState('Store Pickup');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.salePrice * item.qty), 0);
  const totalMrp = cart.reduce((sum, item) => sum + (item.mrp * item.qty), 0);
  const totalSavings = Math.max(0, totalMrp - totalAmount);

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim() || !phone.trim()) {
      alert(lang === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਭਰੋ ਜੀ।' : 'Please enter your name and phone number.');
      return;
    }

    const itemsList = cart.map((item, idx) => 
      `${idx + 1}. ${item.name} (${lang === 'pa' ? item.punjabiName : ''}) x ${item.qty} = ₹${item.salePrice * item.qty}`
    ).join('\n');

    const message = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਤੋਂ ਹੇਠ ਲਿਖੀਆਂ ਦਵਾਈਆਂ ਮੰਗਵਾਉਣੀਆਂ ਚਾਹੁੰਦਾ ਹਾਂ:\n\n${itemsList}\n\n💰 ਕੁੱਲ ਰਕਮ: ₹${totalAmount}\n👤 ਗਾਹਕ ਦਾ ਨਾਮ: ${customerName}\n📞 ਮੋਬਾਈਲ: ${phone}\n📍 ਪਤਾ: ${village}\n📦 ਤਰੀਕਾ: ${deliveryType === 'Store Pickup' ? 'ਦੁਕਾਨ ਤੋਂ ਆਪ ਲਵਾਂਗੇ' : 'ਪਿੰਡ ਵਿੱਚ ਘਰ ਡਿਲੀਵਰੀ'}\n\nਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ ਜੀ। ਧੰਨਵਾਦ!`
      : `Hello! I would like to order medicines from Lohke Medicos:\n\n${itemsList}\n\n💰 Total Amount: ₹${totalAmount}\n👤 Customer Name: ${customerName}\n📞 Phone: ${phone}\n📍 Address: ${village}\n📦 Mode: ${deliveryType}\n\nPlease confirm availability. Thank you!`;

    const whatsappUrl = `https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(message)}`;
    
    // Also save as an order in backend
    api.uploadPrescription({
      patientName: customerName,
      phone: phone,
      village: village,
      medicinesRequested: cart.map(i => `${i.name} (Qty: ${i.qty})`).join(', '),
      deliveryType: deliveryType,
      urgency: 'Normal',
      notes: `Direct cart order for ₹${totalAmount}`
    }).catch(console.error);

    window.open(whatsappUrl, '_blank');
    clearCart();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">{t.cartTitle}</h3>
            <span className="bg-emerald-800 text-emerald-200 text-xs px-2 py-0.5 rounded-full font-mono">
              {cart.reduce((sum, item) => sum + item.qty, 0)} {lang === 'pa' ? 'ਚੀਜ਼ਾਂ' : 'items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">
              {lang === 'pa' ? 'ਆਰਡਰ ਵਟਸਐਪ \'ਤੇ ਭੇਜਿਆ ਗਿਆ!' : 'Order sent via WhatsApp!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              {lang === 'pa' 
                ? 'ਕੈਮਿਸਟ ਤੁਹਾਡਾ ਆਰਡਰ ਚੈੱਕ ਕਰਕੇ ਤੁਹਾਨੂੰ ਜਲਦੀ ਹੀ ਸੁਨੇਹਾ ਜਾਂ ਕਾਲ ਕਰਨਗੇ।' 
                : 'The chemist will review your items and call/message you shortly.'}
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              {lang === 'pa' ? 'ਠੀਕ ਹੈ' : 'Done'}
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-slate-400">
            <ShoppingBag className="w-14 h-14 mb-2 stroke-1 text-slate-300" />
            <p className="text-sm font-medium">{t.cartEmpty}</p>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'pa' ? 'ਦਵਾਈਆਂ ਦੇਖੋ ਅਤੇ ਲਿਸਟ ਵਿੱਚ ਜੋੜੋ' : 'Browse catalog to add medicines'}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 truncate">{item.name}</div>
                  {lang === 'pa' && item.punjabiName && (
                    <div className="text-[11px] text-emerald-700 truncate">{item.punjabiName}</div>
                  )}
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ₹{item.salePrice} / {item.stripSize || 'unit'}
                  </div>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-slate-800 text-xs">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-12 font-bold text-slate-900">
                    ₹{item.salePrice * item.qty}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Savings Banner */}
            {totalSavings > 0 && (
              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border border-emerald-200">
                <span>{lang === 'pa' ? 'ਤੁਹਾਡੀ ਬੱਚਤ (M.R.P ਤੋਂ ਘੱਟ):' : 'Total Savings on MRP:'}</span>
                <span className="font-bold text-emerald-700">₹{totalSavings}</span>
              </div>
            )}

            {/* Checkout Details */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 pt-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {lang === 'pa' ? 'ਗਾਹਕ ਦਾ ਵੇਰਵਾ (ਆਰਡਰ ਲਈ)' : 'Customer Details'}
              </h4>
              <input
                type="text"
                placeholder={lang === 'pa' ? 'ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ *' : 'Your Name *'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder={lang === 'pa' ? 'ਮੋਬਾਈਲ ਨੰਬਰ *' : 'Mobile Number *'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder={lang === 'pa' ? 'ਪਿੰਡ ਦਾ ਪਤਾ (ਲੋਹਕੇ ਕਲਾਂ / ਢਾਣੀ)' : 'Village address / Ward'}
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <div className="flex gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cartDelivery"
                    checked={deliveryType === 'Store Pickup'}
                    onChange={() => setDeliveryType('Store Pickup')}
                    className="text-emerald-600"
                  />
                  <span>{t.storePickup}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cartDelivery"
                    checked={deliveryType === 'Home Delivery'}
                    onChange={() => setDeliveryType('Home Delivery')}
                    className="text-emerald-600"
                  />
                  <span>{t.villageDelivery}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && !submitted && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">{t.totalAmount}:</span>
              <span className="text-xl font-bold text-slate-900">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{t.checkoutWhatsApp}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
