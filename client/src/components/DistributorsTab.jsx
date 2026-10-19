import React, { useState } from 'react';
import { 
  Truck, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  Plus, 
  MapPin, 
  Phone, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { api } from '../api';

export default function DistributorsTab({ 
  distributors, 
  medicines, 
  lang, 
  t, 
  settings, 
  onDistributorsUpdated 
}) {
  const [selectedDistributor, setSelectedDistributor] = useState(distributors[0] || null);
  const [copied, setCopied] = useState(false);
  const [showAddDistModal, setShowAddDistModal] = useState(false);
  const [newDistData, setNewDistData] = useState({
    name: '',
    city: 'Ferozepur City',
    phone: '',
    whatsapp: '',
    supplies: '',
    deliveryDays: ''
  });

  // Automatically find medicines with stock <= minStockAlert
  const shortageMedicines = medicines.filter(m => m.stock <= m.minStockAlert);

  const generateOrderMessage = (dist) => {
    const listText = shortageMedicines.map((m, idx) => {
      const suggestQty = Math.max(20, m.minStockAlert * 3);
      return `${idx + 1}. ${m.name} - ${suggestQty} ${m.stripSize || 'units'} (Current Stock: ${m.stock})`;
    }).join('\n');

    return lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ!\nਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ (ਪਿੰਡ ਲੋਹਕੇ ਕਲਾਂ, ਤਹਿਸੀਲ ਜ਼ੀਰਾ, ਜ਼ਿਲ੍ਹਾ ਫ਼ਿਰੋਜ਼ਪੁਰ) ਵੱਲੋਂ ਤਾਜ਼ਾ ਆਰਡਰ:\n\n${listText}\n\nਕਿਰਪਾ ਕਰਕੇ ਬਿੱਲ ਬਣਾ ਕੇ ਕੱਲ੍ਹ ਦੀ ਸਪਲਾਈ ਗੱਡੀ ਰਾਹੀਂ ਮਾਲ ਭੇਜ ਦੇਣਾ ਜੀ।\n\nਦੁਕਾਨ: ${settings?.storeName || 'ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼'}\nਸੰਪਰਕ: ${settings?.phone || '9876543210'}`
      : `Sat Sri Akal ji!\nPurchase Order from Lohke Medicos (Lohke Kalan, Tehsil Zira, Distt. Ferozepur):\n\n${listText}\n\nPlease dispatch with the next delivery vehicle and send invoice copy.\n\nShop: ${settings?.storeName || 'Lohke Medicos'}\nContact: ${settings?.phone || '9876543210'}`;
  };

  const currentMessage = selectedDistributor ? generateOrderMessage(selectedDistributor) : '';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSupplierWhatsApp = (dist) => {
    const phone = dist.whatsapp || dist.phone;
    if (!phone) {
      alert('Wholesaler WhatsApp number not found');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(currentMessage)}`;
    window.open(url, '_blank');
  };

  const handleAddDistributor = async (e) => {
    e.preventDefault();
    if (!newDistData.name.trim()) return;
    try {
      await api.addDistributor(newDistData);
      setShowAddDistModal(false);
      setNewDistData({ name: '', city: 'Ferozepur City', phone: '', whatsapp: '', supplies: '', deliveryDays: '' });
      if (onDistributorsUpdated) onDistributorsUpdated();
    } catch (err) {
      alert('Error adding distributor: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shortage Summary Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">
              {lang === 'pa' ? 'ਮੁੱਕਣ ਵਾਲੀਆਂ ਦਵਾਈਆਂ ਦੀ ਆਟੋ ਲਿਸਟ' : 'Auto Shortage Reorder List'}
            </h4>
            <p className="text-xs text-amber-700">
              {lang === 'pa' 
                ? `${shortageMedicines.length} ਦਵਾਈਆਂ ਮਿਨੀਮਮ ਸਟਾਕ ਲਿਮਿਟ ਤੋਂ ਘੱਟ ਹਨ।` 
                : `${shortageMedicines.length} medicines are currently below reorder threshold.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddDistModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'pa' ? 'ਨਵਾਂ ਥੋਕ ਸਪਲਾਇਰ' : 'Add Wholesaler'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: List of Wholesalers */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
            {t.wholesalerOrders}
          </h3>

          <div className="space-y-2">
            {distributors.map(dist => (
              <div
                key={dist.id}
                onClick={() => setSelectedDistributor(dist)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs ${
                  selectedDistributor?.id === dist.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm">{dist.name}</div>
                <div className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${selectedDistributor?.id === dist.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  <MapPin className="w-3 h-3" />
                  <span>{dist.city}</span>
                </div>
                <div className={`text-[11px] mt-1 ${selectedDistributor?.id === dist.id ? 'text-slate-300' : 'text-slate-600'}`}>
                  Supplies: {dist.supplies}
                </div>
                <div className={`text-[10px] mt-1 font-mono ${selectedDistributor?.id === dist.id ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  🚚 Delivery: {dist.deliveryDays}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Shortage Items Table & WhatsApp Generator */}
        <div className="lg:col-span-2 space-y-4">
          {/* Shortage Items Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'pa' ? 'ਥੋਕ ਵਿੱਚ ਮੰਗਵਾਉਣ ਵਾਲੀਆਂ ਦਵਾਈਆਂ' : 'Items to Reorder from Wholesaler'}</span>
            </h4>

            {shortageMedicines.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                {lang === 'pa' ? 'ਸਾਰਾ ਸਟਾਕ ਪੂਰਾ ਹੈ, ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਮੁੱਕੀ।' : 'All medicine stocks are healthy! No shortage detected.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Medicine</th>
                      <th className="py-2 px-3">Rack</th>
                      <th className="py-2 px-3 text-center">Current</th>
                      <th className="py-2 px-3 text-center">Min Threshold</th>
                      <th className="py-2 px-3 text-center">Suggested Reorder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {shortageMedicines.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3">
                          <div className="font-bold text-slate-800">{m.name}</div>
                          <div className="text-[10px] text-slate-400">{m.brand} • {m.stripSize}</div>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{m.rack}</td>
                        <td className="py-2 px-3 text-center font-bold text-amber-700">{m.stock}</td>
                        <td className="py-2 px-3 text-center text-slate-500">{m.minStockAlert}</td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-700">
                          +{Math.max(20, m.minStockAlert * 3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Formatted Order Message Card */}
          {selectedDistributor && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                    {lang === 'pa' ? 'ਤਿਆਰ ਵਟਸਐਪ ਆਰਡਰ ਸੁਨੇਹਾ' : 'Generated Wholesaler WhatsApp Message'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    To: <span className="font-semibold text-slate-700">{selectedDistributor.name} ({selectedDistributor.city})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (lang === 'pa' ? 'ਕਾਪੀ ਹੋ ਗਿਆ' : 'Copied!') : t.copyOrderMsg}</span>
                  </button>

                  <button
                    onClick={() => handleSendSupplierWhatsApp(selectedDistributor)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.sendToSupplier}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                readOnly
                value={currentMessage}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Distributor Modal */}
      {showAddDistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Add New Wholesaler</h4>
              <button onClick={() => setShowAddDistModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDistributor} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Distributor Agency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ferozepur Pharma Stockists"
                  value={newDistData.name}
                  onChange={(e) => setNewDistData({ ...newDistData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  value={newDistData.city}
                  onChange={(e) => setNewDistData({ ...newDistData, city: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newDistData.phone}
                    onChange={(e) => setNewDistData({ ...newDistData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={newDistData.whatsapp}
                    onChange={(e) => setNewDistData({ ...newDistData, whatsapp: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Items Supplied</label>
                <input
                  type="text"
                  placeholder="e.g. Allopathic, Vet, Surgical"
                  value={newDistData.supplies}
                  onChange={(e) => setNewDistData({ ...newDistData, supplies: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri by bus"
                  value={newDistData.deliveryDays}
                  onChange={(e) => setNewDistData({ ...newDistData, deliveryDays: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDistModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
