import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  UserPlus, 
  Send, 
  CheckCircle, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MapPin, 
  Phone, 
  Calendar, 
  X 
} from 'lucide-react';
import { api } from '../api';

export default function KhataTab({ 
  khatas, 
  lang, 
  t, 
  settings, 
  onKhataUpdated 
}) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('ਦੁਕਾਨ \'ਤੇ ਨਕਦ ਜਮ੍ਹਾਂ (Cash received at counter)');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    customerName: '',
    punjabiName: '',
    phone: '',
    village: 'Lohke Kalan',
    totalDues: 0,
    limit: 5000,
    notes: ''
  });

  const totalVillageCredit = khatas.reduce((sum, k) => sum + (k.totalDues || 0), 0);

  const filteredKhatas = khatas.filter(k => {
    const q = search.toLowerCase();
    return !q ||
      k.customerName.toLowerCase().includes(q) ||
      (k.punjabiName && k.punjabiName.toLowerCase().includes(q)) ||
      (k.phone && k.phone.includes(q)) ||
      (k.village && k.village.toLowerCase().includes(q));
  });

  const handleOpenPayment = (customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount('');
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      alert('Enter valid payment amount');
      return;
    }
    try {
      await api.recordKhataPayment(selectedCustomer.id, paymentAmount, paymentNote);
      setShowPaymentModal(false);
      if (onKhataUpdated) onKhataUpdated();
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerData.customerName.trim()) {
      alert('Customer name is required');
      return;
    }
    try {
      await api.addKhataCustomer(newCustomerData);
      setShowNewCustomerModal(false);
      if (onKhataUpdated) onKhataUpdated();
    } catch (err) {
      alert('Error creating customer: ' + err.message);
    }
  };

  const sendWhatsAppReminder = (customer) => {
    if (!customer.phone) {
      alert(lang === 'pa' ? 'ਗਾਹਕ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਨਹੀਂ ਹੈ।' : 'Customer phone number not available.');
      return;
    }

    const msg = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ ${customer.punjabiName || customer.customerName}!\nਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ (ਪਿੰਡ ਲੋਹਕੇ ਕਲਾਂ) ਵੱਲੋਂ ਤੁਹਾਡਾ ਬਕਾਇਆ ਹਿਸਾਬ ₹${customer.totalDues} ਹੈ।\nਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਵੀ ਸਮਾਂ ਲੱਗੇ ਦੁਕਾਨ 'ਤੇ ਆ ਕੇ ਜਾਂ ਗੂਗਲ ਪੇ ਰਾਹੀਂ ਹਿਸਾਬ ਕਲੀਅਰ ਕਰਨ ਦੀ ਕ੍ਰਿਪਾਲਤਾ ਕਰੋ ਜੀ।\n\nਦੁਕਾਨ ਸੰਪਰਕ: ${settings?.phone || '9876543210'}\nਧੰਨਵਾਦ! - ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼`
      : `Sat Sri Akal ji ${customer.customerName}!\nReminder from Lohke Medicos (Lohke Kalan) regarding pending medicine balance of ₹${customer.totalDues}.\nKindly visit the shop or pay via UPI whenever convenient.\n\nContact: ${settings?.phone || '9876543210'}\nThank you! - Lohke Medicos`;

    window.open(`https://wa.me/91${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Village Credit Overview */}
      <div className="bg-linear-to-r from-amber-700 via-amber-800 to-amber-900 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{t.totalOutstanding}</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold mt-1">
            ₹{totalVillageCredit.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-amber-100/80 mt-1">
            {lang === 'pa'
              ? `ਪਿੰਡ ਵਿੱਚ ਕੁੱਲ ${khatas.length} ਗਾਹਕਾਂ ਦਾ ਉਧਾਰ ਹਿਸਾਬ ਚੱਲ ਰਿਹਾ ਹੈ`
              : `Total active village credit accounts: ${khatas.length}`}
          </p>
        </div>

        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 text-amber-700" />
          <span>{t.newCustomer}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder={lang === 'pa' ? 'ਗਾਹਕ ਦਾ ਨਾਮ, ਪਿੰਡ ਜਾਂ ਫੋਨ ਨੰਬਰ ਖੋਜੋ...' : 'Search customer by name, village or phone...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs py-1 focus:outline-none"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKhatas.map(customer => {
          const isHigh = customer.totalDues > (customer.limit * 0.7);

          return (
            <div 
              key={customer.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {customer.customerName}
                    </h4>
                    {customer.punjabiName && customer.punjabiName !== customer.customerName && (
                      <div className="text-xs font-semibold text-emerald-700">
                        {customer.punjabiName}
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    customer.totalDues === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : isHigh
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    ₹{customer.totalDues}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{customer.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{customer.village}</span>
                  </div>
                  {customer.notes && (
                    <div className="text-slate-400 italic text-[10px] mt-1">
                      "{customer.notes}"
                    </div>
                  )}
                </div>

                {/* Dues Limit Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Credit Limit: ₹{customer.limit || 5000}</span>
                    <span>{Math.round((customer.totalDues / (customer.limit || 5000)) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isHigh ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (customer.totalDues / (customer.limit || 5000)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleOpenPayment(customer)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-1.5 px-1 rounded-xl text-[11px] transition cursor-pointer text-center"
                >
                  {lang === 'pa' ? 'ਜਮ੍ਹਾਂ ਕਰੋ' : 'Receive'}
                </button>

                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 px-1 rounded-xl text-[11px] transition cursor-pointer text-center"
                >
                  {lang === 'pa' ? 'ਪਾਸਬੁੱਕ' : 'Passbook'}
                </button>

                <button
                  onClick={() => sendWhatsAppReminder(customer)}
                  disabled={customer.totalDues === 0}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1.5 px-1 rounded-xl text-[11px] transition disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
                  title="Send Punjabi WhatsApp reminder"
                >
                  <Send className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{lang === 'pa' ? 'ਯਾਦ-ਪੱਤਰ' : 'Remind'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                {lang === 'pa' ? 'ਉਧਾਰ ਰਕਮ ਜਮ੍ਹਾਂ ਕਰੋ' : 'Receive Payment'}
              </h4>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Customer:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedCustomer.customerName}</div>
                <div className="text-amber-800 font-semibold">Total Due: ₹{selectedCustomer.totalDues}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'pa' ? 'ਜਮ੍ਹਾਂ ਕਰਵਾਈ ਰਕਮ (₹) *' : 'Payment Amount Received (₹) *'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Note</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Passbook Modal */}
      {selectedCustomer && !showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {selectedCustomer.customerName} - {t.passbook}
                </h4>
                <p className="text-xs text-slate-500">{selectedCustomer.village} | {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
              <span className="font-semibold text-amber-900">{t.totalDue}:</span>
              <span className="text-lg font-extrabold text-amber-900">₹{selectedCustomer.totalDues}</span>
            </div>

            {/* Transactions Log */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {(!selectedCustomer.transactions || selectedCustomer.transactions.length === 0) ? (
                <div className="p-6 text-center text-slate-400">No transactions recorded yet</div>
              ) : (
                selectedCustomer.transactions.map((tx, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        tx.type === 'PAYMENT' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {tx.type === 'PAYMENT' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{tx.description}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold ${tx.type === 'PAYMENT' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {tx.type === 'PAYMENT' ? '-' : '+'} ₹{tx.amount}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bal: ₹{tx.balanceAfter}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                {t.newCustomer}
              </h4>
              <button onClick={() => setShowNewCustomerModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.customerName}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, customerName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ਗਾਹਕ ਦਾ ਨਾਮ (ਪੰਜਾਬੀ)</label>
                <input
                  type="text"
                  value={newCustomerData.punjabiName}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, punjabiName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village / Ward</label>
                <input
                  type="text"
                  value={newCustomerData.village}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, village: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Due (₹)</label>
                  <input
                    type="number"
                    value={newCustomerData.totalDues}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, totalDues: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={newCustomerData.limit}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, limit: parseFloat(e.target.value) || 5000 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Add to Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
