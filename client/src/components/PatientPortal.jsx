import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UploadCloud, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  ShoppingBag, 
  Send, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Layers 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', en: 'All Medicines', pa: 'ਸਾਰੀਆਂ ਦਵਾਈਆਂ' },
  { id: 'Fever & Pain', en: 'Fever & Pain', pa: 'ਬੁਖਾਰ ਅਤੇ ਦਰਦ' },
  { id: 'Diabetes & BP', en: 'Diabetes & BP', pa: 'ਸ਼ੂਗਰ ਅਤੇ ਬੀ.ਪੀ.' },
  { id: 'Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)', en: 'Veterinary (Cattle/Buffalo)', pa: 'ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ' },
  { id: 'Antibiotics', en: 'Antibiotics', pa: 'ਐਂਟੀਬਾਇਓਟਿਕਸ' },
  { id: 'Digestive & Acidity', en: 'Gas & Acidity', pa: 'ਤੇਜ਼ਾਬ ਅਤੇ ਗੈਸ' },
  { id: 'Vitamins & Tonics', en: 'Vitamins & Tonics', pa: 'ਤਾਕਤ ਅਤੇ ਵਿਟਾਮਿਨ' },
  { id: 'First Aid & Creams', en: 'First Aid & Creams', pa: 'ਮਲਮਾਂ ਅਤੇ ਪੱਟੀਆਂ' }
];

export default function PatientPortal({ 
  medicines, 
  lang, 
  t, 
  settings, 
  addToCart, 
  openPrescriptionModal 
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickFilter, setQuickFilter] = useState('');

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      const q = (search || quickFilter).toLowerCase();
      const matchesSearch = !q || 
        med.name.toLowerCase().includes(q) ||
        (med.punjabiName && med.punjabiName.toLowerCase().includes(q)) ||
        (med.salt && med.salt.toLowerCase().includes(q)) ||
        (med.category && med.category.toLowerCase().includes(q)) ||
        (med.brand && med.brand.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [medicines, search, quickFilter, selectedCategory]);

  const handleQuickWhatsAppSingle = (med) => {
    const text = lang === 'pa'
      ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਨੂੰ ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਤੋਂ ਇਹ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ:\nਦਵਾਈ: ${med.name} (${med.punjabiName || ''})\nਕੀਮਤ: ₹${med.salePrice}\nਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ ਕਿ ਉਪਲਬਧ ਹੈ। ਧੰਨਵਾਦ!`
      : `Hello, I need this medicine from Lohke Medicos:\nMedicine: ${med.name}\nPrice: ₹${med.salePrice}\nPlease confirm availability. Thank you!`;
    const url = `https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Village Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {lang === 'pa' ? 'ਲੋਹਕੇ ਕਲਾਂ ਦੇ ਵਸਨੀਕਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਸੇਵਾ' : 'Serving Lohke Kalan & Neighboring Villages'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {lang === 'pa' 
              ? 'ਤੁਹਾਡੇ ਆਪਣੇ ਪਿੰਡ ਦੀ ਦੁਕਾਨ, ਅਸਲੀ ਦਵਾਈਆਂ ਅਤੇ ਭਰੋਸਾ' 
              : 'Your Trusted Village Pharmacy in Lohke Kalan'}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {lang === 'pa'
              ? 'ਡਾਕਟਰ ਦੀ ਪਰਚੀ ਦੀ ਫੋਟੋ ਭੇਜੋ, ਪਿੰਡ \'ਚ ਘਰ ਮੰਗਵਾਓ ਜਾਂ ਦੁਕਾਨ ਤੋਂ ਲਵੋ। ਪਸ਼ੂਆਂ ਅਤੇ ਮਨੁੱਖੀ ਇਲਾਜ ਦੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਉਪਲਬਧ।'
              : 'Upload doctor slips directly, get quick delivery in Lohke Kalan or pickup at store. Full range of human & cattle medicines.'}
          </p>

          {/* Quick CTA row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={openPrescriptionModal}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-lg transition cursor-pointer text-sm"
            >
              <UploadCloud className="w-4 h-4 text-slate-900" />
              <span>{t.uploadPrescription}</span>
            </button>

            <a
              href={`tel:${settings?.emergencyPhone || '9876543210'}`}
              className="flex items-center gap-2 bg-emerald-900/80 hover:bg-emerald-950 text-white font-semibold px-4 py-2.5 rounded-xl border border-emerald-400/40 transition text-sm"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>{t.emergencyCall}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Featured Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Prescription Upload */}
        <div 
          onClick={openPrescriptionModal}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
              {t.uploadPrescription}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.uploadPrescriptionSub}
            </p>
          </div>
        </div>

        {/* Card 2: Veterinary Hub */}
        <div 
          onClick={() => {
            setSelectedCategory('Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)');
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md hover:border-amber-300 transition cursor-pointer group flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <span className="text-2xl">🐄</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
              {t.veterinaryHub}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.veterinarySub}
            </p>
          </div>
        </div>

        {/* Card 3: Free Village Delivery */}
        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === 'pa' ? 'ਲੋਹਕੇ ਕਲਾਂ \'ਚ ਘਰ ਪਹੁੰਚ' : 'Home Delivery in Lohke Kalan'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lang === 'pa' 
                ? 'ਬਜ਼ੁਰਗਾਂ ਅਤੇ ਮਰੀਜ਼ਾਂ ਲਈ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਦਵਾਈ ਪਹੁੰਚਾਉਣ ਦੀ ਸਹੂਲਤ' 
                : 'Free door-to-door medicine delivery for village elders & urgent patients'}
            </p>
          </div>
        </div>
      </div>

      {/* Common Village Ailments Quick Finder */}
      <div className="bg-slate-100/70 p-3 rounded-2xl flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-700 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          {lang === 'pa' ? 'ਆਮ ਲੋੜਾਂ:' : 'Quick tags:'}
        </span>
        {[
          { label: lang === 'pa' ? 'ਬੁਖਾਰ/ਦਰਦ' : 'Fever/Pain', query: 'Dolo' },
          { label: lang === 'pa' ? 'ਸ਼ੂਗਰ' : 'Sugar/Diabetes', query: 'Sugar' },
          { label: lang === 'pa' ? 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ' : 'BP', query: 'BP' },
          { label: lang === 'pa' ? 'ਤੇਜ਼ਾਬ/ਗੈਸ' : 'Acidity/Gas', query: 'Pan' },
          { label: lang === 'pa' ? 'ਡੰਗਰਾਂ ਦਾ ਕੈਲਸ਼ੀਅਮ' : 'Cattle Calcium', query: 'Ostovet' },
          { label: lang === 'pa' ? 'ਜ਼ਖਮ ਦੀ ਮਲਮ' : 'Wound Ointment', query: 'Betadine' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => { setSearch(item.query); setQuickFilter(''); }}
            className="shrink-0 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition font-medium cursor-pointer"
          >
            {item.label}
          </button>
        ))}
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-rose-600 hover:underline shrink-0 text-xs font-semibold ml-2 cursor-pointer"
          >
            {lang === 'pa' ? 'ਸਾਫ਼ ਕਰੋ' : 'Clear search'}
          </button>
        )}
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lang === 'pa' ? cat.pa : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <span>
            {lang === 'pa' ? `ਮਿਲੀਆਂ ਦਵਾਈਆਂ: ${filteredMedicines.length}` : `Showing ${filteredMedicines.length} medicines`}
          </span>
          <span className="text-emerald-700 font-medium">
            {lang === 'pa' ? 'ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਅਸਲੀ ਅਤੇ ਤਾਜ਼ਾ ਬੈਚ ਹਨ' : 'Genuine medicines with fresh batch dates'}
          </span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">
              {lang === 'pa' ? 'ਇਸ ਨਾਮ ਨਾਲ ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਮਿਲੀ' : 'No medicine matched your search'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'pa'
                ? 'ਕੋਈ ਫ਼ਿਕਰ ਨਹੀਂ! ਤੁਸੀਂ ਡਾਕਟਰ ਦੀ ਪਰਚੀ ਦੀ ਫੋਟੋ ਭੇਜ ਸਕਦੇ ਹੋ ਜਾਂ ਕੈਮਿਸਟ ਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ।'
                : 'You can upload the doctor prescription slip or contact the chemist directly to arrange it.'}
            </p>
            <button
              onClick={openPrescriptionModal}
              className="mt-2 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{t.uploadPrescription}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedicines.map((med) => {
              const isLow = med.stock <= med.minStockAlert;
              const isOut = med.stock === 0;

              return (
                <div 
                  key={med.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between p-4"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {med.category}
                      </span>

                      {isOut ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {t.outOfStock}
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {t.lowStock} ({med.stock} left)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {t.inStock}
                        </span>
                      )}
                    </div>

                    {/* Name & Punjabi Name */}
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {med.name}
                    </h4>
                    {med.punjabiName && (
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {med.punjabiName}
                      </p>
                    )}

                    {/* Salt / Generic */}
                    <div className="mt-1.5 text-[11px] text-slate-500 line-clamp-1">
                      <span className="font-semibold text-slate-600">{t.saltGeneric}: </span>
                      {med.salt}
                    </div>

                    {/* Brand & Pack info */}
                    <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Brand: {med.brand}</span>
                      <span>{med.stripSize}</span>
                    </div>

                    {/* Rack Location Badge (Village trust indicator) */}
                    {med.rack && (
                      <div className="mt-2 text-[10px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 inline-block">
                        📍 {med.rack}
                      </div>
                    )}

                    {/* Usage hint */}
                    {med.usageInstructions && (
                      <p className="mt-2 text-[11px] text-slate-500 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100/60 line-clamp-2">
                        💡 {med.usageInstructions}
                      </p>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{med.salePrice}
                        </span>
                        {med.mrp > med.salePrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5">
                            ₹{med.mrp}
                          </span>
                        )}
                      </div>
                      {med.mrp > med.salePrice && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{med.mrp - med.salePrice}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(med)}
                        disabled={isOut}
                        className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-2 rounded-xl shadow-xs transition disabled:opacity-40 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t.addToCart}</span>
                      </button>

                      <button
                        onClick={() => handleQuickWhatsAppSingle(med)}
                        className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-2 rounded-xl transition cursor-pointer"
                        title="Order directly over WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'pa' ? 'ਵਟਸਐਪ' : 'WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency & Monthly Refill Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {lang === 'pa' ? 'ਬਜ਼ੁਰਗਾਂ ਦੀ ਹਰ ਮਹੀਨੇ ਦੀ ਦਵਾਈ (ਮਾਸਿਕ ਰੀਫਿਲ)' : 'Monthly Chronic Medicine Refills for Elders'}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {lang === 'pa'
                ? 'ਸ਼ੂਗਰ, ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਜਾਂ ਦਿਲ ਦੀਆਂ ਦਵਾਈਆਂ ਹਰ ਮਹੀਨੇ ਬਿਨਾਂ ਭੁੱਲੇ ਘਰ ਪਹੁੰਚਾਉਣ ਲਈ ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰਵਾਓ।'
                : 'Never run out of regular BP, Diabetes or Heart medicines. Contact us to schedule regular monthly home refills.'}
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/${settings?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(lang === 'pa' ? 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਬਜ਼ੁਰਗਾਂ ਦੀ ਹਰ ਮਹੀਨੇ ਦੀ ਰੈਗੂਲਰ ਦਵਾਈ ਦਾ ਸ਼ਡਿਊਲ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।' : 'Hello, I want to setup monthly medicine refill schedule for elder patient.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
        >
          {lang === 'pa' ? 'ਰੀਫਿਲ ਸ਼ਡਿਊਲ ਬਣਾਓ' : 'Set Up Refill Reminder'}
        </a>
      </div>
    </div>
  );
}
