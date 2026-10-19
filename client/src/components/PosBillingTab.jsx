import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  Send, 
  QrCode, 
  UserPlus, 
  Check, 
  AlertCircle, 
  Receipt, 
  Banknote, 
  Smartphone, 
  BookOpen 
} from 'lucide-react';
import { api } from '../api';

export default function PosBillingTab({ 
  medicines, 
  khatas, 
  lang, 
  t, 
  settings, 
  onSaleCompleted, 
  setPrintData 
}) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('ਨਕਦ ਗਾਹਕ (Cash Customer)');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerVillage, setCustomerVillage] = useState('Lohke Kalan');
  const [paymentMode, setPaymentMode] = useState('Cash'); // Cash, UPI, Khata
  const [selectedKhataId, setSelectedKhataId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Quick medicine search
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return medicines.filter(m => 
      m.name.toLowerCase().includes(q) ||
      (m.punjabiName && m.punjabiName.toLowerCase().includes(q)) ||
      (m.salt && m.salt.toLowerCase().includes(q)) ||
      (m.batchNo && m.batchNo.toLowerCase().includes(q)) ||
      (m.rack && m.rack.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search, medicines]);

  // Add item to POS cart
  const addItem = (med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.qty >= med.stock) {
          alert(`Only ${med.stock} units available in stock for ${med.name}`);
          return prev;
        }
        return prev.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: med.id,
        name: med.name,
        punjabiName: med.punjabiName || '',
        batchNo: med.batchNo || 'DL-2026',
        rack: med.rack || '',
        unitPrice: med.salePrice,
        mrp: med.mrp,
        maxStock: med.stock,
        qty: 1
      }];
    });
    setSearch('');
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        if (newQty > item.maxStock) {
          alert(`Warning: Requested ${newQty} exceeds current stock of ${item.maxStock}`);
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleKhataSelect = (e) => {
    const kId = e.target.value;
    setSelectedKhataId(kId);
    if (!kId) return;
    const khata = khatas.find(k => k.id === kId);
    if (khata) {
      setCustomerName(khata.customerName);
      setCustomerPhone(khata.phone || '');
      setCustomerVillage(khata.village || 'Lohke Kalan');
      setPaymentMode('Khata');
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));

  const handleCheckout = async (printImmediately = false) => {
    if (cart.length === 0) {
      alert(lang === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਬਿੱਲ ਵਿੱਚ ਦਵਾਈਆਂ ਜੋੜੋ।' : 'Please add medicines to cart first.');
      return;
    }

    if (paymentMode === 'Khata' && (!customerName || customerName.includes('Cash Customer'))) {
      alert(lang === 'pa' ? 'ਉਧਾਰ (ਖਾਤਾ) ਲਈ ਗਾਹਕ ਦਾ ਨਾਮ ਲਿਖਣਾ ਲਾਜ਼ਮੀ ਹੈ।' : 'Please enter customer name for Khata/Credit.');
      return;
    }

    setSubmitting(true);
    try {
      const billData = {
        customerName,
        customerPhone,
        customerVillage,
        items: cart.map(i => ({
          id: i.id,
          name: i.name,
          batchNo: i.batchNo,
          qty: i.qty,
          unitPrice: i.unitPrice,
          total: i.unitPrice * i.qty
        })),
        subtotal,
        discount: Number(discount || 0),
        grandTotal,
        paymentMode,
        notes
      };

      const createdBill = await api.createBill(billData);

      // Trigger thermal receipt print if requested
      if (printImmediately && setPrintData) {
        setPrintData({
          bill: createdBill,
          settings
        });
        setTimeout(() => {
          window.print();
        }, 300);
      }

      // Reset POS cart
      setCart([]);
      setDiscount(0);
      setNotes('');
      setCustomerName('ਨਕਦ ਗਾਹਕ (Cash Customer)');
      setCustomerPhone('');
      setSelectedKhataId('');
      setPaymentMode('Cash');

      if (onSaleCompleted) onSaleCompleted(createdBill);

      alert(lang === 'pa' ? `ਬਿੱਲ #${createdBill.billNumber} ਸਫਲਤਾਪੂਰਵਕ ਬਣ ਗਿਆ! ਰਕਮ: ₹${grandTotal}` : `Bill #${createdBill.billNumber} created successfully! Total: ₹${grandTotal}`);
    } catch (err) {
      console.error(err);
      alert('Error creating bill: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendBillWhatsApp = () => {
    if (!customerPhone) {
      alert(lang === 'pa' ? 'ਵਟਸਐਪ ਭੇਜਣ ਲਈ ਗਾਹਕ ਦਾ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ।' : 'Enter customer phone number to send WhatsApp bill.');
      return;
    }

    const itemsSummary = cart.map((i, idx) => `${idx + 1}. ${i.name} (x${i.qty}) = ₹${i.unitPrice * i.qty}`).join('\n');
    const msg = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਵੱਲੋਂ ਤੁਹਾਡਾ ਬਿੱਲ:\n\n${itemsSummary}\n\nਛੋਟ: ₹${discount}\nਕੁੱਲ ਰਕਮ: ₹${grandTotal}\nਭੁਗਤਾਨ: ${paymentMode}\n\nਧੰਨਵਾਦ! ਚੰਗੀ ਸਿਹਤ ਦੀ ਕਾਮਨਾ ਕਰਦੇ ਹਾਂ।\n- ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼, ਲੋਹਕੇ ਕਲਾਂ`
      : `Hello! Bill from Lohke Medicos:\n\n${itemsSummary}\n\nDiscount: ₹${discount}\nGrand Total: ₹${grandTotal}\nPayment: ${paymentMode}\n\nThank you!\n- Lohke Medicos, Lohke Kalan`;

    window.open(`https://wa.me/91${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // UPI Payment Link and QR Code generator
  const upiUrl = `upi://pay?pa=${settings?.upiId || 'lohkemedicos@upi'}&pn=${encodeURIComponent(settings?.storeName || 'Lohke Medicos')}&am=${grandTotal}&cu=INR&tn=LohkeMedicosBill`;

  return (
    <div className="space-y-4">
      {/* Search & Top Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder={t.searchMedPos}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-xl border border-emerald-200 shadow-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {searchResults.map(med => (
              <div 
                key={med.id}
                onClick={() => addItem(med)}
                className="p-3 hover:bg-emerald-50 flex items-center justify-between cursor-pointer transition text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span>{med.name}</span>
                    {med.punjabiName && (
                      <span className="text-[11px] font-semibold text-emerald-700">({med.punjabiName})</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                    <span>Salt: {med.salt}</span>
                    <span className="font-mono bg-slate-100 px-1 rounded">Batch: {med.batchNo}</span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">Rack: {med.rack}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">₹{med.salePrice}</div>
                  <div className={`text-[10px] font-bold ${med.stock <= med.minStockAlert ? 'text-amber-600' : 'text-slate-500'}`}>
                    Stock: {med.stock}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main POS Interface: Split into Cart Table & Billing Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Cart Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-96">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'pa' ? 'ਚਾਲੂ ਬਿੱਲ ਆਈਟਮਾਂ' : 'Current Bill Items'}</span>
              <span className="text-xs font-normal text-slate-500">
                ({cart.length} {lang === 'pa' ? 'ਦਵਾਈਆਂ' : 'items'})
              </span>
            </h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                {lang === 'pa' ? 'ਸਾਰਾ ਬਿੱਲ ਖਾਲੀ ਕਰੋ' : 'Clear All'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 text-center">
                <Receipt className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                <p className="text-sm font-medium">
                  {lang === 'pa' ? 'ਬਿੱਲ ਅਜੇ ਖਾਲੀ ਹੈ' : 'POS Cart is empty'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {lang === 'pa' 
                    ? 'ਉੱਪਰ ਦਿੱਤੇ ਸਰਚ ਬਾਰ ਵਿੱਚ ਦਵਾਈ ਦਾ ਨਾਮ ਜਾਂ ਬੈਚ ਲਿਖ ਕੇ ਬਿੱਲ ਵਿੱਚ ਜੋੜੋ।' 
                    : 'Search medicine name, barcode or rack above to add to bill.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">{lang === 'pa' ? 'ਦਵਾਈ ਦਾ ਨਾਮ' : 'Medicine'}</th>
                    <th className="py-2.5 px-3">Batch / Rack</th>
                    <th className="py-2.5 px-3">{lang === 'pa' ? 'ਦਰ (₹)' : 'Rate'}</th>
                    <th className="py-2.5 px-3 text-center">{lang === 'pa' ? 'ਗਿਣਤੀ' : 'Qty'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'pa' ? 'ਕੁੱਲ (₹)' : 'Total'}</th>
                    <th className="py-2.5 px-3 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cart.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        {item.punjabiName && (
                          <div className="text-[11px] text-emerald-700">{item.punjabiName}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        <div>{item.batchNo}</div>
                        <div className="text-[10px] text-slate-400">{item.rack}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700">₹{item.unitPrice}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 text-center text-xs font-bold border border-slate-300 rounded py-0.5"
                          />
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ₹{item.unitPrice * item.qty}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Col: Customer Details & Checkout Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <span>{lang === 'pa' ? 'ਗਾਹਕ ਅਤੇ ਭੁਗਤਾਨ ਵੇਰਵਾ' : 'Customer & Payment'}</span>
          </h3>

          {/* Quick Select from Village Khata */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>{lang === 'pa' ? 'ਪਿੰਡ ਦਾ ਖਾਤਾ ਚੁਣੋ (ਜੇਕਰ ਉਧਾਰ ਹੈ):' : 'Select Village Khata (If Credit):'}</span>
            </label>
            <select
              value={selectedKhataId}
              onChange={handleKhataSelect}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{lang === 'pa' ? '-- ਨਕਦ ਗਾਹਕ (ਜਾਂ ਨਵਾਂ ਨਾਮ ਲਿਖੋ) --' : '-- Cash Customer (Or Type Name) --'}</option>
              {khatas.map(k => (
                <option key={k.id} value={k.id}>
                  {k.customerName} - {k.village} (ਬਕਾਇਆ: ₹{k.totalDues})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {t.customerName}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {t.patientPhone}
              </label>
              <input
                type="tel"
                placeholder="Phone for bill"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.paymentMode}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  paymentMode === 'Cash'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 mb-1" />
                <span>{t.cash}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMode('UPI');
                  setShowUpiModal(true);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  paymentMode === 'UPI'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1" />
                <span>{t.upi}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('Khata')}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  paymentMode === 'Khata'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span>{t.khata}</span>
              </button>
            </div>
          </div>

          {/* Bill Calculation Box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{lang === 'pa' ? 'ਸਬ-ਟੋਟਲ:' : 'Subtotal:'}</span>
              <span className="font-semibold text-slate-800">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>{t.discount}:</span>
              <div className="flex items-center gap-1">
                <span>₹</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-16 text-right px-2 py-0.5 rounded border border-slate-300 font-bold bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">{t.grandTotal}:</span>
              <span className="text-xl font-extrabold text-emerald-700">₹{grandTotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => handleCheckout(true)}
              disabled={submitting || cart.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t.completeSale}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCheckout(false)}
                disabled={submitting || cart.length === 0}
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-2 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'pa' ? 'ਸਿਰਫ਼ ਸੇਵ ਕਰੋ' : 'Save Only'}</span>
              </button>

              <button
                onClick={handleSendBillWhatsApp}
                disabled={cart.length === 0}
                className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold py-2 px-2 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'pa' ? 'ਵਟਸਐਪ ਬਿੱਲ' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UPI QR Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h4 className="font-bold text-slate-900 text-base">
              {lang === 'pa' ? 'ਯੂ.ਪੀ.ਆਈ. ਸਕੈਨ ਅਤੇ ਭੁਗਤਾਨ' : 'Scan & Pay via UPI'}
            </h4>
            <p className="text-xs text-slate-500">
              Google Pay, PhonePe, Paytm, BHIM App
            </p>

            {/* Generated UPI QR Code SVG */}
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-emerald-500 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
                <rect width="180" height="180" fill="#ffffff" />
                {/* Visual QR Pattern representation */}
                <rect x="15" y="15" width="45" height="45" fill="#047857" rx="6" />
                <rect x="25" y="25" width="25" height="25" fill="#ffffff" />
                <rect x="32" y="32" width="11" height="11" fill="#047857" />

                <rect x="120" y="15" width="45" height="45" fill="#047857" rx="6" />
                <rect x="130" y="25" width="25" height="25" fill="#ffffff" />
                <rect x="137" y="32" width="11" height="11" fill="#047857" />

                <rect x="15" y="120" width="45" height="45" fill="#047857" rx="6" />
                <rect x="25" y="130" width="25" height="25" fill="#ffffff" />
                <rect x="32" y="137" width="11" height="11" fill="#047857" />

                {/* Simulated QR data matrix dots */}
                <rect x="75" y="20" width="10" height="10" fill="#0f172a" />
                <rect x="95" y="20" width="10" height="10" fill="#0f172a" />
                <rect x="75" y="40" width="10" height="10" fill="#0f172a" />
                <rect x="75" y="60" width="30" height="10" fill="#0f172a" />
                <rect x="20" y="75" width="10" height="25" fill="#0f172a" />
                <rect x="40" y="75" width="15" height="15" fill="#0f172a" />
                <rect x="70" y="85" width="40" height="20" fill="#047857" rx="4" />
                <rect x="120" y="75" width="15" height="15" fill="#0f172a" />
                <rect x="145" y="75" width="15" height="15" fill="#0f172a" />
                <rect x="75" y="120" width="10" height="25" fill="#0f172a" />
                <rect x="95" y="135" width="20" height="10" fill="#0f172a" />
                <rect x="125" y="125" width="35" height="35" fill="#0f172a" />
              </svg>
            </div>

            <div className="font-mono text-sm font-bold text-slate-800">
              UPI ID: <span className="text-emerald-700">{settings?.upiId || 'lohkemedicos@upi'}</span>
            </div>

            <div className="text-xl font-extrabold text-emerald-800">
              ₹{grandTotal}
            </div>

            <button
              onClick={() => setShowUpiModal(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
            >
              {lang === 'pa' ? 'ਭੁਗਤਾਨ ਹੋ ਗਿਆ (ਬੰਦ ਕਰੋ)' : 'Payment Received (Close)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
