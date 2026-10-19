const API_BASE = '/api';

export const api = {
  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },
  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Medicines
  async getMedicines(params = {}) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/medicines?${searchParams.toString()}`);
    return res.json();
  },
  async addMedicine(data) {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateMedicine(id, data) {
    const res = await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteMedicine(id) {
    const res = await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // POS Bills
  async createBill(billData) {
    const res = await fetch(`${API_BASE}/pos/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData)
    });
    return res.json();
  },
  async getBills() {
    const res = await fetch(`${API_BASE}/pos/bills`);
    return res.json();
  },

  // Khata
  async getKhatas() {
    const res = await fetch(`${API_BASE}/khata`);
    return res.json();
  },
  async addKhataCustomer(data) {
    const res = await fetch(`${API_BASE}/khata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async recordKhataPayment(id, amount, note) {
    const res = await fetch(`${API_BASE}/khata/${id}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, note })
    });
    return res.json();
  },

  // Prescriptions
  async getPrescriptions() {
    const res = await fetch(`${API_BASE}/prescriptions`);
    return res.json();
  },
  async uploadPrescription(formData) {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  async updatePrescription(id, data) {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Wholesalers
  async getDistributors() {
    const res = await fetch(`${API_BASE}/distributors`);
    return res.json();
  },
  async addDistributor(data) {
    const res = await fetch(`${API_BASE}/distributors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  }
};
