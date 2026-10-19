import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Package, 
  X, 
  TrendingDown 
} from 'lucide-react';
import { api } from '../api';

export default function InventoryTab({ 
  medicines, 
  lang, 
  t, 
  onInventoryUpdated 
}) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // ALL, LOW_STOCK, EXPIRING_SOON, EXPIRED
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    punjabiName: '',
    salt: '',
    category: 'Fever & Pain',
    brand: '',
    batchNo: '',
    expiryDate: '',
    rack: '',
    stock: 20,
    minStockAlert: 10,
    mrp: 100,
    salePrice: 90,
    costPrice: 70,
    stripSize: '10 Tablets',
    requiresPrescription: false,
    usageInstructions: ''
  });

  const now = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(now.getDate() + 90);

  // Check Expiry helper
  const getExpiryStatus = (expStr) => {
    if (!expStr) return 'SAFE';
    const [year, month] = expStr.split('-').map(Number);
    const expDate = new Date(year, (month || 12) - 1, 28);
    if (expDate < now) return 'EXPIRED';
    if (expDate <= ninetyDaysFromNow) return 'EXPIRING_SOON';
    return 'SAFE';
  };

  // Filtered list
  const filteredList = useMemo(() => {
    return medicines.filter(m => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        (m.punjabiName && m.punjabiName.toLowerCase().includes(q)) ||
        (m.salt && m.salt.toLowerCase().includes(q)) ||
        (m.batchNo && m.batchNo.toLowerCase().includes(q)) ||
        (m.rack && m.rack.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;

      const expStatus = getExpiryStatus(m.expiryDate);
      const isLow = m.stock <= m.minStockAlert;

      if (filterMode === 'LOW_STOCK') return matchesSearch && matchesCat && isLow;
      if (filterMode === 'EXPIRING_SOON') return matchesSearch && matchesCat && expStatus === 'EXPIRING_SOON';
      if (filterMode === 'EXPIRED') return matchesSearch && matchesCat && expStatus === 'EXPIRED';

      return matchesSearch && matchesCat;
    });
  }, [medicines, search, filterMode, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingMed(null);
    setFormData({
      name: '',
      punjabiName: '',
      salt: '',
      category: 'Fever & Pain',
      brand: '',
      batchNo: 'BT-' + Math.floor(1000 + Math.random() * 9000),
      expiryDate: '2027-12',
      rack: 'Rack A-1',
      stock: 30,
      minStockAlert: 10,
      mrp: 100,
      salePrice: 90,
      costPrice: 70,
      stripSize: '10 Tablets',
      requiresPrescription: false,
      usageInstructions: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setFormData({ ...med });
    setShowAddModal(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editingMed) {
        await api.updateMedicine(editingMed.id, formData);
      } else {
        await api.addMedicine(formData);
      }
      setShowAddModal(false);
      if (onInventoryUpdated) onInventoryUpdated();
    } catch (err) {
      alert('Error saving medicine: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'pa' ? 'ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਇਹ ਦਵਾਈ ਹਟਾਉਣੀ ਚਾਹੁੰਦੇ ਹੋ?' : 'Are you sure you want to delete this medicine?')) return;
    try {
      await api.deleteMedicine(id);
      if (onInventoryUpdated) onInventoryUpdated();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleQuickStock = async (med, delta) => {
    const newStock = Math.max(0, med.stock + delta);
    try {
      await api.updateMedicine(med.id, { stock: newStock });
      if (onInventoryUpdated) onInventoryUpdated();
    } catch (err) {
      alert('Error updating stock');
    }
  };

  // Counts
  const lowStockCount = medicines.filter(m => m.stock <= m.minStockAlert).length;
  const expiringSoonCount = medicines.filter(m => getExpiryStatus(m.expiryDate) === 'EXPIRING_SOON').length;
  const expiredCount = medicines.filter(m => getExpiryStatus(m.expiryDate) === 'EXPIRED').length;

  return (
    <div className="space-y-4">
      {/* Top Inventory Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-400 font-medium">{lang === 'pa' ? 'ਕੁੱਲ ਦਵਾਈਆਂ' : 'Total Items'}</div>
          <div className="text-2xl font-bold mt-1">{medicines.length}</div>
        </button>

        <button
          onClick={() => setFilterMode('LOW_STOCK')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'LOW_STOCK'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="text-xs text-amber-600 font-medium flex items-center justify-between">
            <span>{t.shortageAlert}</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-700">{lowStockCount}</div>
        </button>

        <button
          onClick={() => setFilterMode('EXPIRING_SOON')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'EXPIRING_SOON'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="text-xs text-rose-600 font-medium flex items-center justify-between">
            <span>{t.expiringSoon}</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold mt-1 text-rose-700">{expiringSoonCount}</div>
        </button>

        <button
          onClick={() => setFilterMode('EXPIRED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === 'EXPIRED'
              ? 'bg-red-900 text-white border-red-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-red-400'
          }`}
        >
          <div className="text-xs text-red-700 font-medium flex items-center justify-between">
            <span>{t.expired}</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold mt-1 text-red-800">{expiredCount}</div>
        </button>
      </div>

      {/* Action Header & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addMedicine}</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{lang === 'pa' ? 'ਦਵਾਈ ਦਾ ਨਾਮ ਅਤੇ ਸਾਲਟ' : 'Medicine & Salt'}</th>
                <th className="py-3 px-3">{t.shelfRack}</th>
                <th className="py-3 px-3">{t.batchNumber}</th>
                <th className="py-3 px-3">{t.expiry}</th>
                <th className="py-3 px-3">{t.stockQty}</th>
                <th className="py-3 px-3">{t.costPrice}</th>
                <th className="py-3 px-3">{t.salePrice}</th>
                <th className="py-3 px-3 text-center">{lang === 'pa' ? 'ਕਾਰਵਾਈ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.map(med => {
                const expStatus = getExpiryStatus(med.expiryDate);
                const isLow = med.stock <= med.minStockAlert;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{med.name}</div>
                      {med.punjabiName && (
                        <div className="text-[11px] text-emerald-700">{med.punjabiName}</div>
                      )}
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        {med.salt} ({med.brand})
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200 font-semibold">
                        {med.rack || 'Counter'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                      {med.batchNo}
                    </td>

                    <td className="py-3 px-3">
                      {expStatus === 'EXPIRED' ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          🔴 {med.expiryDate} (Expired)
                        </span>
                      ) : expStatus === 'EXPIRING_SOON' ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          ⚠️ {med.expiryDate} (&lt;90d)
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px] font-mono">
                          {med.expiryDate}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs ${isLow ? 'text-amber-600' : 'text-slate-800'}`}>
                          {med.stock}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleQuickStock(med, 1)}
                            className="bg-slate-100 hover:bg-emerald-100 text-slate-700 px-1 rounded text-[10px] cursor-pointer"
                            title="Add 1"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleQuickStock(med, -1)}
                            className="bg-slate-100 hover:bg-rose-100 text-slate-700 px-1 rounded text-[10px] cursor-pointer"
                            title="Minus 1"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 text-xs">
                      ₹{med.costPrice}
                    </td>

                    <td className="py-3 px-3 font-bold text-emerald-800 text-xs">
                      ₹{med.salePrice}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(med)}
                          className="text-slate-500 hover:text-emerald-700 p-1 cursor-pointer"
                          title="Edit Medicine"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingMed ? (lang === 'pa' ? 'ਦਵਾਈ ਸੋਧੋ' : 'Edit Medicine') : t.addMedicine}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ਨਾਮ (ਪੰਜਾਬੀ)</label>
                  <input
                    type="text"
                    value={formData.punjabiName}
                    onChange={(e) => setFormData({ ...formData, punjabiName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.saltGeneric}</label>
                  <input
                    type="text"
                    value={formData.salt}
                    onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Fever & Pain">Fever & Pain (ਬੁਖਾਰ/ਦਰਦ)</option>
                    <option value="Diabetes & BP">Diabetes & BP (ਸ਼ੂਗਰ/ਬੀ.ਪੀ.)</option>
                    <option value="Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)">Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)</option>
                    <option value="Antibiotics">Antibiotics (ਐਂਟੀਬਾਇਓਟਿਕ)</option>
                    <option value="Digestive & Acidity">Digestive & Gas (ਗੈਸ/ਤੇਜ਼ਾਬ)</option>
                    <option value="Vitamins & Tonics">Vitamins & Tonics (ਤਾਕਤ)</option>
                    <option value="First Aid & Creams">First Aid & Creams (ਮਲਮਾਂ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.batchNumber}</label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.expiry} (YYYY-MM)</label>
                  <input
                    type="month"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.shelfRack}</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack A-1, Fridge"
                    value={formData.rack}
                    onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.stockQty}</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Alert Qty</label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Strip/Pack</label>
                  <input
                    type="text"
                    value={formData.stripSize}
                    onChange={(e) => setFormData({ ...formData, stripSize: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">M.R.P. (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Usage / Dosage Advice</label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet twice daily after food / ਰੋਟੀ ਤੋਂ ਬਾਅਦ"
                  value={formData.usageInstructions}
                  onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
