import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Send, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { api } from '../api';

export default function PrescriptionUploadModal({ 
  isOpen, 
  onClose, 
  lang, 
  t, 
  settings, 
  onPrescriptionSuccess 
}) {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('ਪਿੰਡ ਲੋਹਕੇ ਕਲਾਂ (Lohke Kalan)');
  const [doctorName, setDoctorName] = useState('');
  const [medicinesRequested, setMedicinesRequested] = useState('');
  const [deliveryType, setDeliveryType] = useState('Store Pickup');
  const [urgency, setUrgency] = useState('Normal');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedRx, setSubmittedRx] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUseSamplePrescription = (sampleNum) => {
    setSelectedFile(null);
    setPreviewUrl(`/uploads/rx${sampleNum}.svg`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) {
      alert(lang === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਮਰੀਜ਼ ਦਾ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਭਰੋ ਜੀ।' : 'Please enter patient name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('phone', phone);
      formData.append('village', village);
      formData.append('doctorName', doctorName);
      formData.append('medicinesRequested', medicinesRequested);
      formData.append('deliveryType', deliveryType);
      formData.append('urgency', urgency);

      if (selectedFile) {
        formData.append('prescriptionImage', selectedFile);
      } else if (previewUrl) {
        formData.append('imageBase64', previewUrl);
      }

      const res = await api.uploadPrescription(formData);
      setSubmittedRx(res);
      if (onPrescriptionSuccess) onPrescriptionSuccess(res);
    } catch (err) {
      console.error(err);
      alert(lang === 'pa' ? 'ਪਰਚੀ ਭੇਜਣ ਵਿੱਚ ਤਰੁੱਟੀ ਆਈ।' : 'Failed to submit prescription.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedRx(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPatientName('');
    setPhone('');
    setMedicinesRequested('');
    onClose();
  };

  const generateWhatsAppLink = () => {
    if (!submittedRx) return '#';
    const text = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਪੋਰਟਲ 'ਤੇ ਡਾਕਟਰ ਦੀ ਪਰਚੀ ਅਪਲੋਡ ਕੀਤੀ ਹੈ।\n👤 ਮਰੀਜ਼: ${submittedRx.patientName}\n📞 ਫੋਨ: ${submittedRx.phone}\n📍 ਪਿੰਡ: ${submittedRx.village}\n📝 ਦਵਾਈਆਂ/ਨੋਟ: ${submittedRx.medicinesRequested || 'ਪਰਚੀ ਦੇਖੋ'}\nਕਿਰਪਾ ਕਰਕੇ ਦਵਾਈਆਂ ਤਿਆਰ ਕਰ ਦਿਓ ਜੀ।`
      : `Hello! I have uploaded a doctor prescription on Lohke Medicos portal.\nPatient: ${submittedRx.patientName}\nPhone: ${submittedRx.phone}\nVillage: ${submittedRx.village}\nNotes: ${submittedRx.medicinesRequested || 'As per prescription'}\nPlease confirm when ready.`;
    return `https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {t.uploadPrescription}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'pa' ? 'ਲੋਹਕੇ ਕਲਾਂ ਅਤੇ ਨੇੜਲੇ ਪਿੰਡਾਂ ਲਈ ਸਿੱਧੀ ਸਹੂਲਤ' : 'Direct pharmacy service for Lohke Kalan & nearby villages'}
              </p>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedRx ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t.prescriptionSubmittedTitle}
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
                {t.prescriptionSubmittedMsg}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 text-xs space-y-1.5 font-mono">
              <div><span className="text-slate-500">Slip ID:</span> <span className="font-bold text-slate-800">{submittedRx.id}</span></div>
              <div><span className="text-slate-500">Patient:</span> {submittedRx.patientName} ({submittedRx.phone})</div>
              <div><span className="text-slate-500">Delivery:</span> {submittedRx.deliveryType}</div>
              <div><span className="text-slate-500">Village:</span> {submittedRx.village}</div>
            </div>

            {/* Direct WhatsApp notify button */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
              >
                <Send className="w-4 h-4" />
                <span>
                  {lang === 'pa' ? 'ਕੈਮਿਸਟ ਦੇ ਵਟਸਐਪ \'ਤੇ ਸੁਨੇਹਾ ਭੇਜੋ' : 'Notify Chemist on WhatsApp'}
                </span>
              </a>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-800 font-semibold"
              >
                {lang === 'pa' ? 'ਬੰਦ ਕਰੋ' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {lang === 'pa' ? 'ਪਰਚੀ ਦੀ ਫੋਟੋ ਲਗਾਓ (ਕੈਮਰਾ ਜਾਂ ਗੈਲਰੀ)' : 'Prescription Photo (Camera / File)'}
              </label>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-slate-50 max-h-48 flex items-center justify-center group">
                  <img src={previewUrl} alt="Prescription Preview" className="max-h-48 object-contain w-full" />
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700 text-xs"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer text-center">
                  <Camera className="w-8 h-8 text-emerald-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {lang === 'pa' ? 'ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਫਾਈਲ ਚੁਣੋ' : 'Click Photo or Browse File'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, PDF up to 15MB</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              )}

              {/* Sample Quick Prescription Pickers for Instant Testing */}
              {!previewUrl && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">{lang === 'pa' ? 'ਜਾਂ ਟੈਸਟ ਲਈ ਚੁਣੋ:' : 'Or test with sample:'}</span>
                  <button
                    type="button"
                    onClick={() => handleUseSamplePrescription(1)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 cursor-pointer"
                  >
                    Dr. Sharma (BP/Sugar)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseSamplePrescription(2)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 cursor-pointer"
                  >
                    Ferozepur OPD (Fever)
                  </button>
                </div>
              )}
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.patientName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'pa' ? 'ਜਿਵੇਂ: ਗੁਰਨਾਮ ਸਿੰਘ' : 'e.g. Gurnam Singh'}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.patientPhone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="98765-XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Village Address & Doctor Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{t.villageWard}</span>
                </label>
                <input
                  type="text"
                  placeholder={lang === 'pa' ? 'ਪਿੰਡ ਲੋਹਕੇ ਕਲਾਂ, ਗੁਰਦੁਆਰਾ ਨੇੜੇ' : 'Village Lohke Kalan, Near Bus Stand'}
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'pa' ? 'ਡਾਕਟਰ / ਹਸਪਤਾਲ ਦਾ ਨਾਮ' : 'Doctor / Hospital Name'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'pa' ? 'ਸਿਵਲ ਹਸਪਤਾਲ ਜ਼ੀਰਾ / ਫ਼ਿਰੋਜ਼ਪੁਰ' : 'Civil Hospital Zira / Ferozepur'}
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Delivery Option & Urgency */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  {t.deliveryType}
                </label>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="Store Pickup"
                      checked={deliveryType === 'Store Pickup'}
                      onChange={() => setDeliveryType('Store Pickup')}
                      className="text-emerald-600"
                    />
                    <span>{t.storePickup}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      value="Home Delivery"
                      checked={deliveryType === 'Home Delivery'}
                      onChange={() => setDeliveryType('Home Delivery')}
                      className="text-emerald-600"
                    />
                    <span>{t.villageDelivery}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  {lang === 'pa' ? 'ਜ਼ਰੂਰਤ' : 'Urgency'}
                </label>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="urgency" 
                      value="Normal"
                      checked={urgency === 'Normal'}
                      onChange={() => setUrgency('Normal')}
                      className="text-emerald-600"
                    />
                    <span>{lang === 'pa' ? 'ਸਾਧਾਰਨ (ਅੱਜ ਸ਼ਾਮ ਤੱਕ)' : 'Normal (Today)'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-rose-700 font-medium">
                    <input 
                      type="radio" 
                      name="urgency" 
                      value="Urgent"
                      checked={urgency === 'Urgent'}
                      onChange={() => setUrgency('Urgent')}
                      className="text-rose-600"
                    />
                    <span>{lang === 'pa' ? 'ਐਮਰਜੈਂਸੀ / ਜ਼ਰੂਰੀ' : 'Urgent (Immediate)'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notes / Medicines Needed */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'pa' ? 'ਕੋਈ ਹੋਰ ਜਾਣਕਾਰੀ ਜਾਂ ਖਾਸ ਦਵਾਈਆਂ' : 'Specific Medicines / Instructions'}
              </label>
              <textarea
                rows={2}
                placeholder={t.notesPlaceholder}
                value={medicinesRequested}
                onChange={(e) => setMedicinesRequested(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? t.submitting : t.submitPrescription}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
