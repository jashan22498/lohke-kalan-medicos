import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  Phone, 
  MapPin, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  X 
} from 'lucide-react';
import { api } from '../api';

export default function PrescriptionsTab({ 
  prescriptions, 
  lang, 
  t, 
  settings, 
  onPrescriptionsUpdated 
}) {
  const [selectedRx, setSelectedRx] = useState(null);
  const [quoteInput, setQuoteInput] = useState('');
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRx = prescriptions.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const handleOpenReview = (rx) => {
    setSelectedRx(rx);
    setQuoteInput(rx.totalQuote || '');
    setReplyText(rx.chemistReply || (lang === 'pa' 
      ? 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ, ਤੁਹਾਡੀ ਪਰਚੀ ਦੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਪੈਕ ਕਰ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਤੁਸੀਂ ਦੁਕਾਨ ਤੋਂ ਲੈ ਸਕਦੇ ਹੋ।' 
      : 'Hello, your prescription medicines are packed and ready for pickup/delivery.'));
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedRx) return;
    try {
      await api.updatePrescription(selectedRx.id, {
        status: newStatus,
        totalQuote: Number(quoteInput || 0),
        chemistReply: replyText
      });
      setSelectedRx(null);
      if (onPrescriptionsUpdated) onPrescriptionsUpdated();
    } catch (err) {
      alert('Error updating: ' + err.message);
    }
  };

  const sendWhatsAppNotification = (rx) => {
    if (!rx.phone) {
      alert(lang === 'pa' ? 'ਮਰੀਜ਼ ਦਾ ਫੋਨ ਨੰਬਰ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।' : 'Patient phone number not available.');
      return;
    }

    const msg = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ ${rx.punjabiPatientName || rx.patientName}!\nਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਵੱਲੋਂ ਸੂਚਨਾ: ਤੁਹਾਡੀ ਡਾਕਟਰ ਦੀ ਪਰਚੀ ਚੈੱਕ ਕਰ ਲਈ ਗਈ ਹੈ।\n\nਸਟੇਟਸ: ${rx.status === 'READY_FOR_PICKUP' ? 'ਦਵਾਈ ਤਿਆਰ ਹੈ (Ready for pickup/delivery)' : 'ਪਰਚੀ ਮਨਜ਼ੂਰ'}\nਕੁੱਲ ਰਕਮ: ₹${rx.totalQuote || quoteInput}\nਹਦਾਇਤ: ${replyText || rx.chemistReply || 'ਦੁਕਾਨ ਤੋਂ ਆ ਕੇ ਪ੍ਰਾਪਤ ਕਰੋ ਜੀ'}\n\nਪਤਾ: ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼, ਪਿੰਡ ਲੋਹਕੇ ਕਲਾਂ\nਫੋਨ: ${settings?.phone || '9876543210'}`
      : `Sat Sri Akal ji ${rx.patientName}!\nUpdate from Lohke Medicos:\nYour prescription medicines are ready!\nTotal Amount: ₹${rx.totalQuote || quoteInput}\nNote: ${replyText || rx.chemistReply || 'Ready for collection'}\n\nAddress: Lohke Medicos, Lohke Kalan\nPhone: ${settings?.phone || '9876543210'}`;

    window.open(`https://wa.me/91${rx.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 text-xs">
        {[
          { id: 'ALL', label: lang === 'pa' ? 'ਸਾਰੀਆਂ ਪਰਚੀਆਂ' : 'All Prescriptions' },
          { id: 'PENDING', label: lang === 'pa' ? 'ਨਵੀਆਂ / ਵਿਚਾਰ ਅਧੀਨ' : 'Pending Review' },
          { id: 'READY_FOR_PICKUP', label: lang === 'pa' ? 'ਤਿਆਰ / ਰੈਡੀ' : 'Ready for Pickup' },
          { id: 'COMPLETED', label: lang === 'pa' ? 'ਮੁਕੰਮਲ' : 'Completed' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              statusFilter === filter.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRx.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400">
            <FileText className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              {lang === 'pa' ? 'ਕੋਈ ਪਰਚੀ ਨਹੀਂ ਮਿਲੀ' : 'No prescription slips found'}
            </p>
          </div>
        ) : (
          filteredRx.map(rx => (
            <div 
              key={rx.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {rx.patientName} {rx.age && `(${rx.age}y / ${rx.gender || 'M'})`}
                    </h4>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {rx.phone}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {rx.village}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rx.status === 'READY_FOR_PICKUP'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rx.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {rx.status}
                  </span>
                </div>

                {/* Prescription Image / Details */}
                <div className="mt-3 flex gap-3 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {rx.imageUrl ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 relative group cursor-pointer" onClick={() => handleOpenReview(rx)}>
                      <img src={rx.imageUrl} alt="Prescription" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}

                  <div className="text-xs space-y-1 min-w-0">
                    <div className="text-slate-600 font-medium truncate">
                      <span className="text-slate-400">Doctor:</span> {rx.doctorName || 'Not mentioned'}
                    </div>
                    <div className="text-slate-600 line-clamp-2">
                      <span className="text-slate-400">Medicines:</span> {rx.medicinesRequested || 'See prescription image'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(rx.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {rx.totalQuote > 0 && (
                  <div className="mt-2 text-xs font-bold text-emerald-800 flex justify-between bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span>Quoted Amount:</span>
                    <span>₹{rx.totalQuote}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenReview(rx)}
                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'pa' ? 'ਪਰਚੀ ਦੇਖੋ ਅਤੇ ਕੋਟ ਕਰੋ' : 'Review & Quote'}</span>
                </button>

                <button
                  onClick={() => sendWhatsAppNotification(rx)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'pa' ? 'ਵਟਸਐਪ ਸੂਚਨਾ' : 'WhatsApp'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review & Quote Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Prescription #{selectedRx.id} - {selectedRx.patientName}
                </h4>
                <p className="text-xs text-slate-500">{selectedRx.village} | Phone: {selectedRx.phone}</p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prescription Image Zoom */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2 flex items-center justify-center max-h-80">
                {selectedRx.imageUrl ? (
                  <img src={selectedRx.imageUrl} alt="Prescription Full" className="max-h-76 object-contain rounded" />
                ) : (
                  <div className="text-slate-400 text-xs text-center p-8">No image attached</div>
                )}
              </div>

              {/* Action & Status */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'pa' ? 'ਦਵਾਈਆਂ ਦੀ ਕੁੱਲ ਕੀਮਤ / ਕੋਟੇਸ਼ਨ (₹)' : 'Total Bill / Quote Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    placeholder="Enter bill quote"
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'pa' ? 'ਮਰੀਜ਼ ਲਈ ਸੁਨੇਹਾ / ਹਦਾਇਤ' : 'Message to Patient'}
                  </label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('READY_FOR_PICKUP')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition"
                  >
                    ✓ {lang === 'pa' ? 'ਦਵਾਈ ਤਿਆਰ ਹੈ (Ready for Pickup / Delivery)' : 'Mark Ready for Pickup'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition"
                  >
                    ✓ {lang === 'pa' ? 'ਮੁਕੰਮਲ ਹੋ ਗਿਆ (Mark Completed)' : 'Mark Completed'}
                  </button>

                  <button
                    type="button"
                    onClick={() => sendWhatsAppNotification(selectedRx)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'pa' ? 'ਵਟਸਐਪ ਸੁਨੇਹਾ ਭੇਜੋ' : 'Notify on WhatsApp'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
