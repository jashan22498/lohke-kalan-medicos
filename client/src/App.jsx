import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PatientPortal from './components/PatientPortal';
import ChemistDashboard from './components/ChemistDashboard';
import PrescriptionUploadModal from './components/PrescriptionUploadModal';
import CartDrawer from './components/CartDrawer';
import PrintableReceipt from './components/PrintableReceipt';
import { translations } from './translations';
import { api } from './api';
import { Heart, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('pa'); // Default to Punjabi ('pa'), toggleable to 'en'
  const [mode, setMode] = useState('patient'); // 'patient' or 'chemist'
  const [medicines, setMedicines] = useState([]);
  const [bills, setBills] = useState([]);
  const [khatas, setKhatas] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = translations[lang] || translations.pa;

  // Fetch all initial data from Express backend
  const refreshAllData = useCallback(async () => {
    try {
      const [
        medsData,
        billsData,
        khatasData,
        rxData,
        distData,
        settingsData,
        analyticsData
      ] = await Promise.all([
        api.getMedicines(),
        api.getBills(),
        api.getKhatas(),
        api.getPrescriptions(),
        api.getDistributors(),
        api.getSettings(),
        api.getAnalytics()
      ]);

      setMedicines(medsData);
      setBills(billsData);
      setKhatas(khatasData);
      setPrescriptions(rxData);
      setDistributors(distData);
      setSettings(settingsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching data from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Cart Management
  const addToCart = (med) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === med.id);
      if (exists) {
        return prev.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: med.id,
        name: med.name,
        punjabiName: med.punjabiName || '',
        salt: med.salt || '',
        salePrice: med.salePrice,
        mrp: med.mrp,
        stripSize: med.stripSize,
        qty: 1
      }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-bold text-slate-700">
          ਲੋਹਕੇ ਕਲਾਂ ਮੈਡੀਕੋਜ਼ ਪੋਰਟਲ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        mode={mode}
        setMode={setMode}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        settings={settings}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {mode === 'patient' ? (
          <PatientPortal
            medicines={medicines}
            lang={lang}
            t={t}
            settings={settings}
            addToCart={addToCart}
            openPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
          />
        ) : (
          <ChemistDashboard
            medicines={medicines}
            bills={bills}
            khatas={khatas}
            prescriptions={prescriptions}
            distributors={distributors}
            settings={settings}
            analytics={analytics}
            lang={lang}
            t={t}
            onRefreshData={refreshAllData}
            setPrintData={setPrintData}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        lang={lang}
        t={t}
        settings={settings}
        onPrescriptionSuccess={refreshAllData}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateCartQty}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        lang={lang}
        t={t}
        settings={settings}
      />

      {/* Printable Receipt (only prints on window.print()) */}
      <PrintableReceipt printData={printData} />

      {/* Village Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              +
            </div>
            <span className="font-bold text-slate-800">
              {settings?.punjabiStoreName || 'ਲੋਹਕੇ ਕਲਾਂ ਮੈਡੀਕੋਜ਼'} ({settings?.storeName || 'Lohke Medicos'})
            </span>
            <span>•</span>
            <span>{settings?.address || 'Lohke Kalan, Ferozepur, Punjab'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Drug License: {settings?.drugLicenseNo || 'PB-FZP-19842-DL'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Genuine Medicines &amp; Rural Healthcare
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
