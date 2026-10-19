import React from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  ShoppingBag, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  Clock, 
  Store, 
  UserCheck 
} from 'lucide-react';

export default function Header({ 
  lang, 
  setLang, 
  t, 
  mode, 
  setMode, 
  cartCount, 
  setIsCartOpen,
  settings 
}) {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      {/* Top Village Notice Bar */}
      <div className="bg-emerald-700 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="font-medium tracking-wide">
            {lang === 'pa' ? settings?.punjabiAddress || t.villageLocation : settings?.address || t.villageLocation}
          </span>
          <span className="hidden sm:inline text-emerald-300">|</span>
          <span className="hidden sm:inline font-mono">DL: {settings?.drugLicenseNo || 'PB-FZP-19842-DL'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-200">
            <Clock className="w-3 h-3" />
            <span>{settings?.operatingHours || '7:00 AM - 10:00 PM'}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'pa' ? 'en' : 'pa')}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white px-2 py-0.5 rounded text-xs transition border border-emerald-600 font-semibold cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{lang === 'pa' ? 'English' : 'ਪੰਜਾਬੀ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setMode('patient')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-linear-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                {lang === 'pa' ? (settings?.punjabiStoreName || t.punjabiStoreName) : (settings?.storeName || t.storeName)}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Lohke Kalan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Emergency Call */}
          <a
            href={`tel:${settings?.emergencyPhone || '9876543210'}`}
            className="hidden md:flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
            <span>{t.emergencyCall}</span>
          </a>

          {/* Direct WhatsApp */}
          <a
            href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(lang === 'pa' ? 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ, ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਤੋਂ ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।' : 'Hello, I need medicine inquiry from Lohke Medicos.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.whatsappUs}</span>
          </a>

          {/* Cart Icon (Visible in Patient Mode) */}
          {mode === 'patient' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'pa' ? 'ਲਿਸਟ' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[11px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Switch to Chemist Portal / Patient Mode */}
          {mode === 'patient' ? (
            <button
              onClick={() => setMode('chemist')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer shadow-xs"
              title="Switch to Father's Chemist Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{t.chemistPortal}</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('patient')}
              className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border border-emerald-300"
            >
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.patientView}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
