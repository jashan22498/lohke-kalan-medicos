import React, { useState } from 'react';
import { Settings, Save, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function SettingsTab({ 
  settings, 
  lang, 
  t, 
  onSettingsUpdated 
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (onSettingsUpdated) onSettingsUpdated(updated);
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            {lang === 'pa' ? 'ਦੁਕਾਨ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਲਾਇਸੰਸ ਸੈਟਿੰਗ' : 'Pharmacy Profile & License Settings'}
          </h3>
        </div>
        {saved && (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
            <CheckCircle className="w-3.5 h-3.5" />
            {lang === 'pa' ? 'ਸੇਵ ਹੋ ਗਿਆ!' : 'Saved successfully!'}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Store Name (English) *</label>
            <input
              type="text"
              required
              value={formData.storeName || ''}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ਦੁਕਾਨ ਦਾ ਨਾਮ (ਪੰਜਾਬੀ)</label>
            <input
              type="text"
              value={formData.punjabiStoreName || ''}
              onChange={(e) => setFormData({ ...formData, punjabiStoreName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Counter Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
            <input
              type="tel"
              required
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Emergency 24x7</label>
            <input
              type="tel"
              value={formData.emergencyPhone || ''}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Drug License No. (DL)</label>
            <input
              type="text"
              value={formData.drugLicenseNo || ''}
              onChange={(e) => setFormData({ ...formData, drugLicenseNo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">GSTIN No.</label>
            <input
              type="text"
              value={formData.gstin || ''}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">UPI ID (For Dynamic QR Code)</label>
            <input
              type="text"
              placeholder="e.g. lohkemedicos@upi"
              value={formData.upiId || ''}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
            <input
              type="text"
              value={formData.operatingHours || ''}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Village Address (English)</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">ਪੂਰਾ ਪਤਾ (ਪੰਜਾਬੀ ਵਿੱਚ)</label>
          <input
            type="text"
            value={formData.punjabiAddress || ''}
            onChange={(e) => setFormData({ ...formData, punjabiAddress: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : (lang === 'pa' ? 'ਸੈਟਿੰਗਜ਼ ਸੇਵ ਕਰੋ' : 'Save Settings')}</span>
        </button>
      </form>
    </div>
  );
}
