import React, { useState } from 'react';
import { 
  BarChart3, 
  Banknote, 
  Smartphone, 
  BookOpen, 
  TrendingUp, 
  Printer, 
  Receipt, 
  Calendar 
} from 'lucide-react';

export default function ReportsTab({ 
  analytics, 
  bills, 
  lang, 
  t, 
  settings, 
  setPrintData 
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const todayBills = bills.filter(b => (b.createdAt || '').slice(0, 10) === selectedDate);
  const totalDaySales = todayBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const cashSales = todayBills.filter(b => b.paymentMode === 'Cash').reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const upiSales = todayBills.filter(b => b.paymentMode === 'UPI').reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const khataSales = todayBills.filter(b => b.paymentMode === 'Khata').reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  const handleReprint = (bill) => {
    if (setPrintData) {
      setPrintData({
        bill,
        settings
      });
      setTimeout(() => {
        window.print();
      }, 300);
    }
  };

  return (
    <div className="space-y-4">
      {/* Date Filter & Title */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            {lang === 'pa' ? 'ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ਅਤੇ ਗੱਲੇ ਦਾ ਹਿਸਾਬ' : 'Daily Sales & Cash Register Summary'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'pa' ? 'ਅੱਜ ਦੀਆਂ ਰਸੀਦਾਂ, ਨਕਦ, ਯੂ.ਪੀ.ਆਈ. ਅਤੇ ਉਧਾਰ ਖਾਤਾ' : 'Track drawer cash, online UPI and credit sales'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-1.5 font-medium bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">{lang === 'pa' ? 'ਕੁੱਲ ਵਿਕਰੀ' : 'Total Revenue'}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalDaySales}</div>
          <div className="text-[10px] text-slate-400 mt-1">{todayBills.length} {lang === 'pa' ? 'ਬਿੱਲ ਕੱਟੇ' : 'bills issued'}</div>
        </div>

        {/* Cash in Drawer */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-700 font-medium flex items-center justify-between">
            <span>{lang === 'pa' ? 'ਗੱਲੇ ਵਿੱਚ ਨਕਦ' : 'Cash in Hand'}</span>
            <Banknote className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">₹{cashSales}</div>
          <div className="text-[10px] text-emerald-600 mt-1">{lang === 'pa' ? 'ਨਕਦ ਭੁਗਤਾਨ' : 'Cash payments'}</div>
        </div>

        {/* UPI Payments */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
          <div className="text-xs text-teal-700 font-medium flex items-center justify-between">
            <span>{lang === 'pa' ? 'ਯੂ.ਪੀ.ਆਈ. (UPI)' : 'UPI / Online'}</span>
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold text-teal-800 mt-1">₹{upiSales}</div>
          <div className="text-[10px] text-teal-600 mt-1">GPay / PhonePe</div>
        </div>

        {/* Village Khata (Credit) */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-700 font-medium flex items-center justify-between">
            <span>{lang === 'pa' ? 'ਅੱਜ ਦਾ ਉਧਾਰ' : 'Today Credit (Khata)'}</span>
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 mt-1">₹{khataSales}</div>
          <div className="text-[10px] text-amber-600 mt-1">{lang === 'pa' ? 'ਖਾਤੇ ਵਿੱਚ ਦਰਜ' : 'Logged to ledger'}</div>
        </div>
      </div>

      {/* Today Bills Register */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'pa' ? 'ਅੱਜ ਕੱਟੇ ਗਏ ਬਿੱਲ' : 'Bills Generated on'} ({selectedDate})</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          {todayBills.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              {lang === 'pa' ? 'ਇਸ ਮਿਤੀ ਦਾ ਕੋਈ ਬਿੱਲ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ' : 'No bills found for selected date.'}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bill #</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {todayBills.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{b.id}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{b.customerName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{b.customerVillage || 'Lohke Kalan'}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {b.items?.map(i => `${i.name} (x${i.qty})`).join(', ') || 'Medicines'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.paymentMode === 'Cash' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.paymentMode === 'UPI'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.paymentMode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      ₹{b.grandTotal}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleReprint(b)}
                        className="text-slate-500 hover:text-emerald-700 p-1 cursor-pointer"
                        title="Re-print Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
