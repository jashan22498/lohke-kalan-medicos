import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Uploads directory for prescription photos
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

// Create sample prescription SVG files if they do not exist
const sampleRx1 = path.join(UPLOAD_DIR, 'rx1.svg');
const sampleRx2 = path.join(UPLOAD_DIR, 'rx2.svg');

if (!fs.existsSync(sampleRx1)) {
  fs.writeFileSync(sampleRx1, `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <rect width="600" height="750" fill="#fdfbf7" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="20" y="20" width="560" height="120" rx="6" fill="#f0fdf4" stroke="#86efac"/>
    <text x="300" y="55" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#15803d" text-anchor="middle">DR. SHARMA'S CLINIC</text>
    <text x="300" y="80" font-family="Arial, sans-serif" font-size="13" fill="#374151" text-anchor="middle">Civil Hospital Road, Zira (Distt. Ferozepur)</text>
    <text x="300" y="102" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">Reg No: PB/1892/PMC | Phone: 98140-XXXXX</text>
    <line x1="20" y1="160" x2="580" y2="160" stroke="#94a3b8" stroke-dasharray="4"/>
    <text x="40" y="190" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Patient: <tspan font-weight="bold">Simranjit Kaur</tspan></text>
    <text x="380" y="190" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Age/Sex: <tspan font-weight="bold">48 / F</tspan></text>
    <text x="40" y="220" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Address: <tspan font-weight="bold">Village Lohke Kalan</tspan></text>
    <text x="380" y="220" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Date: <tspan font-weight="bold">18-Oct-2026</tspan></text>
    
    <text x="40" y="290" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#0284c7">℞</text>
    
    <text x="90" y="310" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">1. Tab. Telma 40mg (Telmisartan) - 1 strip</text>
    <text x="110" y="335" font-family="sans-serif" font-size="13" fill="#475569">   [1 Tab OD Morning after breakfast x 30 days]</text>
    
    <text x="90" y="380" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">2. Tab. Glycomet-GP 1 (Metformin+Glimepiride) - 2 strips</text>
    <text x="110" y="405" font-family="sans-serif" font-size="13" fill="#475569">   [1 Tab BD before food x 30 days]</text>

    <text x="90" y="450" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">3. Cap. Pan-D - 1 strip</text>
    <text x="110" y="475" font-family="sans-serif" font-size="13" fill="#475569">   [1 Cap empty stomach morning x 15 days]</text>

    <text x="90" y="520" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">4. Tab. Shelcal 500 - 1 strip</text>
    <text x="110" y="545" font-family="sans-serif" font-size="13" fill="#475569">   [1 Tab at bedtime with milk]</text>

    <line x1="40" y1="620" x2="560" y2="620" stroke="#e2e8f0"/>
    <text x="450" y="660" font-family="cursive, sans-serif" font-size="18" fill="#1e3a8a">Dr. Sharma</text>
    <text x="440" y="685" font-family="sans-serif" font-size="12" fill="#64748b">MBBS, MD (Physician)</text>
  </svg>`);
}

if (!fs.existsSync(sampleRx2)) {
  fs.writeFileSync(sampleRx2, `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <rect width="600" height="750" fill="#fcfcfd" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="20" y="20" width="560" height="110" rx="6" fill="#f8fafc" stroke="#94a3b8"/>
    <text x="300" y="60" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">FEROZEPUR RURAL HEALTH CARE</text>
    <text x="300" y="85" font-family="Arial, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Emergency & OPD Services, Ferozepur Cantt</text>
    <line x1="20" y1="150" x2="580" y2="150" stroke="#94a3b8" stroke-dasharray="4"/>
    <text x="40" y="180" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Patient: <tspan font-weight="bold">Gurpreet Singh</tspan> (Male, 32)</text>
    <text x="400" y="180" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">Date: <tspan font-weight="bold">19-Oct-2026</tspan></text>
    <text x="40" y="205" font-family="Arial, sans-serif" font-size="13" fill="#64748b">Village Lohke Kalan</text>

    <text x="40" y="270" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#2563eb">℞</text>

    <text x="90" y="295" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">1. Tab. Azithral 500mg - 1 strip (5 Tabs)</text>
    <text x="110" y="320" font-family="sans-serif" font-size="13" fill="#475569">   [1 Tab daily after lunch x 5 days]</text>

    <text x="90" y="365" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">2. Tab. Dolo 650mg - 10 tablets</text>
    <text x="110" y="390" font-family="sans-serif" font-size="13" fill="#475569">   [Take when fever > 100 F or severe headache]</text>

    <text x="90" y="435" font-family="Courier, monospace" font-size="16" font-weight="bold" fill="#0f172a">3. Tab. Cetirizine 10mg - 5 tablets</text>
    <text x="110" y="460" font-family="sans-serif" font-size="13" fill="#475569">   [1 Tab night for sneezing/runny nose]</text>

    <line x1="40" y1="620" x2="560" y2="620" stroke="#e2e8f0"/>
    <text x="450" y="660" font-family="cursive, sans-serif" font-size="18" fill="#0284c7">Medical Officer</text>
  </svg>`);
}

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'rx-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// --- API ROUTES ---

// 1. Settings / Shop Info
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// 2. Medicines Catalog & Inventory
app.get('/api/medicines', (req, res) => {
  let list = db.getMedicines();
  const { search, category, lowStock, expiring } = req.query;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.punjabiName && m.punjabiName.toLowerCase().includes(q)) ||
      (m.salt && m.salt.toLowerCase().includes(q)) ||
      (m.brand && m.brand.toLowerCase().includes(q)) ||
      (m.rack && m.rack.toLowerCase().includes(q))
    );
  }

  if (category && category !== 'All') {
    list = list.filter(m => m.category === category);
  }

  if (lowStock === 'true') {
    list = list.filter(m => m.stock <= m.minStockAlert);
  }

  res.json(list);
});

app.post('/api/medicines', (req, res) => {
  const med = db.addMedicine(req.body);
  res.status(201).json(med);
});

app.put('/api/medicines/:id', (req, res) => {
  const updated = db.updateMedicine(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Medicine not found' });
  res.json(updated);
});

app.delete('/api/medicines/:id', (req, res) => {
  const ok = db.deleteMedicine(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Medicine not found' });
  res.json({ success: true });
});

// 3. POS Billing
app.post('/api/pos/bills', (req, res) => {
  try {
    const bill = db.createBill(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pos/bills', (req, res) => {
  res.json(db.getBills());
});

// 4. Village Khata (Customer Credit Ledger)
app.get('/api/khata', (req, res) => {
  res.json(db.getKhatas());
});

app.post('/api/khata', (req, res) => {
  const customer = db.addKhataCustomer(req.body);
  res.status(201).json(customer);
});

app.post('/api/khata/:id/payment', (req, res) => {
  const { amount, note } = req.body;
  const updated = db.recordKhataPayment(req.params.id, amount, note);
  if (!updated) return res.status(404).json({ error: 'Khata account not found' });
  res.json(updated);
});

// 5. Prescriptions & Orders (Patient Access)
app.get('/api/prescriptions', (req, res) => {
  res.json(db.getPrescriptions());
});

app.post('/api/prescriptions', upload.single('prescriptionImage'), (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageBase64) {
      imageUrl = req.body.imageBase64;
    } else {
      imageUrl = '/uploads/rx1.svg'; // Default sample if none uploaded
    }

    const newRx = db.addPrescription({
      patientName: req.body.patientName || 'Anonymous Villager',
      punjabiPatientName: req.body.punjabiPatientName || '',
      phone: req.body.phone || '',
      village: req.body.village || 'Lohke Kalan',
      age: req.body.age || '',
      gender: req.body.gender || '',
      doctorName: req.body.doctorName || '',
      medicinesRequested: req.body.medicinesRequested || '',
      imageUrl,
      urgency: req.body.urgency || 'Normal',
      deliveryType: req.body.deliveryType || 'Store Pickup', // Store Pickup or Village Delivery
      notes: req.body.notes || ''
    });

    res.status(201).json(newRx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/prescriptions/:id', (req, res) => {
  const updated = db.updatePrescription(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Prescription record not found' });
  res.json(updated);
});

// 6. Wholesalers & Distributors (Ferozepur / Zira / Moga)
app.get('/api/distributors', (req, res) => {
  res.json(db.getDistributors());
});

app.post('/api/distributors', (req, res) => {
  const dist = db.addDistributor(req.body);
  res.status(201).json(dist);
});

// 7. Analytics & Dashboard Summary
app.get('/api/analytics', (req, res) => {
  res.json(db.getAnalytics());
});

// Root Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    store: 'Lohke Medicos (ਲੋਹਕੇ ਕਲਾਂ ਮੈਡੀਕੋਜ਼)',
    location: 'Lohke Kalan, Tehsil Zira, Distt. Ferozepur, Punjab',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if available
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
    next();
  });
}


app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 LOHKE MEDICOS SERVER RUNNING on http://localhost:${PORT}`);
  console.log(`📍 Serving: Lohke Kalan, Ferozepur District, Punjab`);
  console.log(`=======================================================`);
});

