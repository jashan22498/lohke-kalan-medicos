import React, { useState } from 'react';
import { 
  Receipt, 
  Package, 
  BookOpen, 
  FileText, 
  Truck, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Banknote, 
  Smartphone, 
  Lock 
} from 'lucide-react';
import PosBillingTab from './PosBillingTab';
import InventoryTab from './InventoryTab';
import KhataTab from './KhataTab';
import PrescriptionsTab from './PrescriptionsTab';
import DistributorsTab from './DistributorsTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';

export default function ChemistDashboard({ 
  medicines, 
  bills, 
  khatas, 
  prescriptions, 
  distributors, 
  settings, 
  analytics, 
  lang, 
  t, 
  onRefreshData, 
  setPrintData 
}) {
  const [activeTab, setActiveTab] = useState('pos'); // pos, inventory, khata, prescriptions, distributors, reports, settings

  // Tabs config with badge notifications
  const pendingRxCount = prescriptions.filter(p => p.status === 'PENDING').length;
  const lowStockCount = medicines.filter(m => m.stock <= m.minStockAlert).length;
  const totalKhataDue = khatas.reduce((sum, k) => sum + (k.totalDues || 0), 0);

  const TABS = [
    { id: 'pos', label: t.posBilling, icon: Receipt, color: 'emerald' },
    { id: 'inventory', label: t.inventoryExpiry, icon: Package, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'amber' },
    { id: 'khata', label: t.customerKhata, icon: BookOpen, badge: `₹${totalKhataDue}`, badgeColor: 'slate' },
    { id: 'prescriptions', label: t.prescriptionQueue, icon: FileText, badge: pendingRxCount > 0 ? pendingRxCount : null, badgeColor: 'rose' },
    { id: 'distributors', label: t.supplierOrders, icon: Truck, badge: lowStockCount > 0 ? `${lowStockCount} items` : null, badgeColor: 'teal' },
    { id: 'reports', label: t.dailyReports, icon: BarChart3 },
    { id: 'settings', label: t.storeSettings, icon: Settings }
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Chemist Metrics Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              🏪
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'pa' ? 'ਕੈਮਿਸਟ ਕੰਟਰੋਲ ਡੈਸ਼ਬੋਰਡ' : 'Chemist Command Dashboard'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {settings?.storeName || 'Lohke Medicos'} • {settings?.address || 'Lohke Kalan, Ferozepur'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live POS Terminal
            </span>
          </div>
        </div>

        {/* Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block">{lang === 'pa' ? 'ਅੱਜ ਦੀ ਵਿਕਰੀ' : 'Today Sales'}</span>
            <span className="text-base font-extrabold text-slate-900">₹{analytics?.todaySales || 0}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-700 text-[11px] block">{lang === 'pa' ? 'ਗੱਲੇ \'ਚ ਨਕਦ' : 'Cash in Hand'}</span>
            <span className="text-base font-extrabold text-emerald-800">₹{analytics?.todayCash || 0}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200">
            <span className="text-teal-700 text-[11px] block">UPI / GPay</span>
            <span className="text-base font-extrabold text-teal-800">₹{analytics?.todayUpi || 0}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-amber-800 text-[11px] block">{lang === 'pa' ? 'ਕੁੱਲ ਉਧਾਰ' : 'Village Credit'}</span>
            <span className="text-base font-extrabold text-amber-900">₹{totalKhataDue}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <span className="text-rose-700 text-[11px] block">{lang === 'pa' ? 'ਨਵੀਆਂ ਪਰਚੀਆਂ' : 'Prescriptions'}</span>
            <span className="text-base font-extrabold text-rose-800">{pendingRxCount} pending</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-amber-800 text-[11px] block">{lang === 'pa' ? 'ਘੱਟ ਸਟਾਕ' : 'Low Stock'}</span>
            <span className="text-base font-extrabold text-amber-900">{lowStockCount} items</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'pos' && (
          <PosBillingTab
            medicines={medicines}
            khatas={khatas}
            lang={lang}
            t={t}
            settings={settings}
            onSaleCompleted={onRefreshData}
            setPrintData={setPrintData}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab
            medicines={medicines}
            lang={lang}
            t={t}
            onInventoryUpdated={onRefreshData}
          />
        )}

        {activeTab === 'khata' && (
          <KhataTab
            khatas={khatas}
            lang={lang}
            t={t}
            settings={settings}
            onKhataUpdated={onRefreshData}
          />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionsTab
            prescriptions={prescriptions}
            lang={lang}
            t={t}
            settings={settings}
            onPrescriptionsUpdated={onRefreshData}
          />
        )}

        {activeTab === 'distributors' && (
          <DistributorsTab
            distributors={distributors}
            medicines={medicines}
            lang={lang}
            t={t}
            settings={settings}
            onDistributorsUpdated={onRefreshData}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            analytics={analytics}
            bills={bills}
            lang={lang}
            t={t}
            settings={settings}
            setPrintData={setPrintData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            lang={lang}
            t={t}
            onSettingsUpdated={onRefreshData}
          />
        )}
      </div>
    </div>
  );
}
