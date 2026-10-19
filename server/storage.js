import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data_store');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data with authentic Indian pharmacy medicines, veterinary medicines, and sample village khata
const INITIAL_DATA = {
  settings: {
    storeName: "Lohke Medicos & Healthcare",
    punjabiStoreName: "ਲੋਹਕੇ ਮੈਡੀਕੋਜ਼ ਅਤੇ ਹੈਲਥਕੇਅਰ ਸੈਂਟਰ",
    tagline: "ਤੁਹਾਡੇ ਪਿੰਡ ਦੀ ਆਪਣੀ ਭਰੋਸੇਮੰਦ ਦੁਕਾਨ (Lohke Kalan, Ferozepur)",
    ownerName: "Chemist In-Charge",
    phone: "9876543210",
    whatsappNumber: "919876543210",
    address: "Main Road Near Gurdwara / Bus Stand, Lohke Kalan, Tehsil Zira, Distt. Ferozepur, Punjab - 142044",
    punjabiAddress: "ਮੁੱਖ ਸੜਕ, ਨੇੜੇ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ/ਬੱਸ ਅੱਡਾ, ਲੋਹਕੇ ਕਲਾਂ, ਤਹਿਸੀਲ ਜ਼ੀਰਾ, ਜ਼ਿਲ੍ਹਾ ਫ਼ਿਰੋਜ਼ਪੁਰ",
    drugLicenseNo: "PB-FZP-19842-DL",
    gstin: "03AAAPL9821R1Z8",
    upiId: "lohkemedicos@upi",
    emergencyPhone: "9876543210",
    operatingHours: "7:00 AM - 10:00 PM (Emergency 24x7)"
  },
  medicines: [
    // Common Village Human Medicines
    {
      id: "med_1",
      name: "Dolo 650 mg Tablet",
      punjabiName: "ਡੋਲੋ ੬੫੦ (ਬੁਖਾਰ ਅਤੇ ਦਰਦ)",
      salt: "Paracetamol 650mg",
      category: "Fever & Pain",
      brand: "Micro Labs",
      batchNo: "DL-9821",
      expiryDate: "2027-05",
      rack: "Rack A-1 (Top)",
      stock: 120,
      minStockAlert: 30,
      mrp: 34.00,
      salePrice: 30.00,
      costPrice: 22.50,
      stripSize: "15 Tablets",
      requiresPrescription: false,
      usageInstructions: "1 tablet after meal for fever/body ache. ਦਿਨ 'ਚ 2 ਵਾਰੀ ਰੋਟੀ ਤੋਂ ਬਾਅਦ",
      isPopular: true
    },
    {
      id: "med_2",
      name: "Pan-D Capsule",
      punjabiName: "ਪੈਨ-ਡੀ (ਤੇਜ਼ਾਬ/ਗੈਸ ਦਾ ਕੈਪਸੂਲ)",
      salt: "Pantoprazole 40mg + Domperidone 30mg SR",
      category: "Digestive & Acidity",
      brand: "Alkem",
      batchNo: "PND-441",
      expiryDate: "2027-02",
      rack: "Rack A-2",
      stock: 85,
      minStockAlert: 20,
      mrp: 199.00,
      salePrice: 175.00,
      costPrice: 135.00,
      stripSize: "15 Capsules",
      requiresPrescription: true,
      usageInstructions: "1 capsule empty stomach in morning. ਸਵੇਰੇ ਖਾਲੀ ਪੇਟ",
      isPopular: true
    },
    {
      id: "med_3",
      name: "Azithral 500 mg Tablet",
      punjabiName: "ਅਜ਼ੀਥਰਲ ੫੦੦ (ਗਲੇ ਦੀ ਖਰਾਸ਼/ਐਂਟੀਬਾਇਓਟਿਕ)",
      salt: "Azithromycin 500mg",
      category: "Antibiotics",
      brand: "Alembic",
      batchNo: "AZ-2201",
      expiryDate: "2026-12",
      rack: "Rack B-1",
      stock: 45,
      minStockAlert: 15,
      mrp: 132.00,
      salePrice: 120.00,
      costPrice: 90.00,
      stripSize: "5 Tablets",
      requiresPrescription: true,
      usageInstructions: "1 tablet daily for 3 to 5 days. ਦਿਨ 'ਚ 1 ਵਾਰੀ",
      isPopular: true
    },
    {
      id: "med_4",
      name: "Telma 40 mg Tablet",
      punjabiName: "ਟੈਲਮਾ ੪੦ (ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ/BP ਦੀ ਗੋਲੀ)",
      salt: "Telmisartan 40mg",
      category: "Diabetes & BP",
      brand: "Glenmark",
      batchNo: "TL-882",
      expiryDate: "2027-08",
      rack: "Rack B-3 (BP Shelf)",
      stock: 60,
      minStockAlert: 20,
      mrp: 230.00,
      salePrice: 205.00,
      costPrice: 160.00,
      stripSize: "30 Tablets",
      requiresPrescription: true,
      usageInstructions: "1 tablet once daily morning regularly for BP control.",
      isPopular: true
    },
    {
      id: "med_5",
      name: "Glycomet-GP 1 Tablet",
      punjabiName: "ਗਲਾਈਕੋਮੈੱਟ ਜੀਪੀ ੧ (ਸ਼ੂਗਰ ਦੀ ਦਵਾਈ)",
      salt: "Glimepiride 1mg + Metformin 500mg SR",
      category: "Diabetes & BP",
      brand: "USV Ltd",
      batchNo: "GL-1190",
      expiryDate: "2027-03",
      rack: "Rack B-3 (Sugar Shelf)",
      stock: 55,
      minStockAlert: 15,
      mrp: 110.00,
      salePrice: 95.00,
      costPrice: 72.00,
      stripSize: "15 Tablets",
      requiresPrescription: true,
      usageInstructions: "Before breakfast with water. ਸਵੇਰ ਦੇ ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ",
      isPopular: true
    },
    {
      id: "med_6",
      name: "Combiflam Tablet",
      punjabiName: "ਕੌਂਬੀਫਲੈਮ (ਜੋੜਾਂ ਤੇ ਸਿਰ ਦਰਦ)",
      salt: "Ibuprofen 400mg + Paracetamol 325mg",
      category: "Fever & Pain",
      brand: "Sanofi",
      batchNo: "CF-330",
      expiryDate: "2026-11", // Expiring soon for alerts!
      rack: "Rack A-1",
      stock: 8, // Low stock alert!
      minStockAlert: 25,
      mrp: 52.00,
      salePrice: 48.00,
      costPrice: 38.00,
      stripSize: "20 Tablets",
      requiresPrescription: false,
      usageInstructions: "For severe pain/inflammation. Always take after milk/food.",
      isPopular: true
    },
    {
      id: "med_7",
      name: "Augmentin 625 Duo Tablet",
      punjabiName: "ਔਗਮੈਂਟਿਨ ੬੨੫ (ਜ਼ਖਮ/ਇਨਫੈਕਸ਼ਨ ਸੁਕਾਉਣ ਲਈ)",
      salt: "Amoxicillin 500mg + Clavulanic Acid 125mg",
      category: "Antibiotics",
      brand: "GSK",
      batchNo: "AUG-772",
      expiryDate: "2026-11", // Expiring soon
      rack: "Rack B-2",
      stock: 12,
      minStockAlert: 15,
      mrp: 204.00,
      salePrice: 185.00,
      costPrice: 148.00,
      stripSize: "10 Tablets",
      requiresPrescription: true,
      usageInstructions: "Twice daily after food. 100% course must be completed.",
      isPopular: true
    },
    {
      id: "med_8",
      name: "Shelcal 500 Tablet",
      punjabiName: "ਸ਼ੈਲਕਲ ੫੦੦ (ਹੱਡੀਆਂ ਦੀ ਕੈਲਸ਼ੀਅਮ ਅਤੇ ਵਿਟਾਮਿਨ D3)",
      salt: "Calcium 500mg + Vitamin D3 250 IU",
      category: "Vitamins & Tonics",
      brand: "Torrent",
      batchNo: "SH-551",
      expiryDate: "2027-09",
      rack: "Rack C-1",
      stock: 70,
      minStockAlert: 20,
      mrp: 144.00,
      salePrice: 130.00,
      costPrice: 98.00,
      stripSize: "15 Tablets",
      requiresPrescription: false,
      usageInstructions: "Daily 1 tablet at night with milk. ਰਾਤ ਨੂੰ ਦੁੱਧ ਨਾਲ",
      isPopular: true
    },
    {
      id: "med_9",
      name: "Electral ORS Powder (21.8g)",
      punjabiName: "ਇਲੈਕਟਰਾਲ ਓ.ਆਰ.ਐਸ. (ਉਲਟੀ/ਦਸਤ ਤੇ ਕਮਜ਼ੋਰੀ ਲਈ)",
      salt: "Oral Rehydration Salts (WHO Formula)",
      category: "First Aid & Creams",
      brand: "FDC",
      batchNo: "EL-901",
      expiryDate: "2027-10",
      rack: "Front Counter Shelf",
      stock: 140,
      minStockAlert: 30,
      mrp: 24.50,
      salePrice: 22.00,
      costPrice: 17.00,
      stripSize: "1 Sachet",
      requiresPrescription: false,
      usageInstructions: "Dissolve entire packet in 1 liter clean water.",
      isPopular: true
    },
    {
      id: "med_10",
      name: "Betadine 10% Ointment (20g)",
      punjabiName: "ਬੀਟਾਡੀਨ ਮੱਲ੍ਹਮ (ਸੱਟ/ਜ਼ਖਮ ਦੀ ਮਲਮ)",
      salt: "Povidone Iodine 10%",
      category: "First Aid & Creams",
      brand: "Win-Medicare",
      batchNo: "BT-102",
      expiryDate: "2027-06",
      rack: "Front Counter Box 2",
      stock: 35,
      minStockAlert: 10,
      mrp: 125.00,
      salePrice: 115.00,
      costPrice: 88.00,
      stripSize: "1 Tube",
      requiresPrescription: false,
      usageInstructions: "Clean wound and apply gently 2 times daily.",
      isPopular: false
    },
    {
      id: "med_11",
      name: "Cetirizine 10 mg (Cetzine)",
      punjabiName: "ਸੈਟਰੀਜ਼ੀਨ (ਛਿੱਕਾਂ, ਐਲਰਜੀ ਅਤੇ ਖਾਰਸ਼)",
      salt: "Cetirizine Dihydrochloride 10mg",
      category: "Fever & Pain",
      brand: "Dr. Reddy's",
      batchNo: "CZ-612",
      expiryDate: "2027-07",
      rack: "Rack A-3",
      stock: 90,
      minStockAlert: 20,
      mrp: 22.00,
      salePrice: 20.00,
      costPrice: 12.00,
      stripSize: "10 Tablets",
      requiresPrescription: false,
      usageInstructions: "1 tablet at bedtime for allergy/sneezing. ਰਾਤ ਨੂੰ ਸੌਣ ਵੇਲੇ",
      isPopular: true
    },
    {
      id: "med_12",
      name: "Becosules Z Capsules",
      punjabiName: "ਬੀਕੋਸੂਲਜ਼ (ਮੂੰਹ ਦੇ ਛਾਲੇ ਅਤੇ ਕਮਜ਼ੋਰੀ)",
      salt: "B-Complex + Vitamin C + Zinc",
      category: "Vitamins & Tonics",
      brand: "Pfizer",
      batchNo: "BC-490",
      expiryDate: "2027-04",
      rack: "Rack C-2",
      stock: 80,
      minStockAlert: 20,
      mrp: 58.00,
      salePrice: 52.00,
      costPrice: 41.00,
      stripSize: "20 Capsules",
      requiresPrescription: false,
      usageInstructions: "Daily 1 capsule after lunch for mouth ulcers and energy.",
      isPopular: true
    },
    {
      id: "med_13",
      name: "Volini Gel 30g",
      punjabiName: "ਵੋਲਿਨੀ ਜੈੱਲ (ਪਿੱਠ/ਲੱਕ ਅਤੇ ਗੋਡਿਆਂ ਦੇ ਦਰਦ ਦੀ ਮਲਮ)",
      salt: "Diclofenac Diethylamine + Virgin Linseed Oil",
      category: "First Aid & Creams",
      brand: "Sun Pharma",
      batchNo: "VL-811",
      expiryDate: "2027-01",
      rack: "Front Counter Shelf",
      stock: 28,
      minStockAlert: 10,
      mrp: 145.00,
      salePrice: 130.00,
      costPrice: 100.00,
      stripSize: "1 Tube",
      requiresPrescription: false,
      usageInstructions: "Apply gently on painful joints or back without harsh massage.",
      isPopular: true
    },

    // Authentic Veterinary Medicines (Essential for Punjab Rural Pharmacy)
    {
      id: "med_14",
      name: "Ostovet Forte (1 Litre)",
      punjabiName: "ਓਸਟੋਵੈੱਟ ਫੋਰਟੇ (ਗਾਂ/ਮੱਝ ਦੇ ਦੁੱਧ ਵਧਾਉਣ ਲਈ ਕੈਲਸ਼ੀਅਮ)",
      salt: "Calcium, Phosphorus, Vitamin D3 & B12 Liquid",
      category: "Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)",
      brand: "Virbac Animal Health",
      batchNo: "OST-992",
      expiryDate: "2027-11",
      rack: "Bottom Storage Rack Vet-1",
      stock: 18,
      minStockAlert: 8,
      mrp: 260.00,
      salePrice: 235.00,
      costPrice: 190.00,
      stripSize: "1 Litre Bottle",
      requiresPrescription: false,
      usageInstructions: "100ml daily mixed in cattle feed/chara for milk yield and bone health.",
      isPopular: true
    },
    {
      id: "med_15",
      name: "Himax Ointment (50g)",
      punjabiName: "ਹਿਮੈਕਸ ਮਲਮ (ਪਸ਼ੂਆਂ ਦੇ ਜ਼ਖਮ, ਕੀੜੇ ਅਤੇ ਖੁਰਲੀ ਦੀ ਲਾਗ)",
      salt: "Herbal Antiseptic & Fly Repellent",
      category: "Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)",
      brand: "Indian Herbs",
      batchNo: "HM-301",
      expiryDate: "2027-08",
      rack: "Vet Rack Top",
      stock: 22,
      minStockAlert: 10,
      mrp: 95.00,
      salePrice: 85.00,
      costPrice: 65.00,
      stripSize: "1 Tube",
      requiresPrescription: false,
      usageInstructions: "Apply over animal wound to heal and prevent fly eggs/maggots.",
      isPopular: true
    },
    {
      id: "med_16",
      name: "Albendazole 3000mg Bolus (Albomar)",
      punjabiName: "ਅਲਬੋਮਾਰ ਵੱਡੀ ਗੋਲੀ (ਪਸ਼ੂਆਂ ਦੇ ਪੇਟ ਦੇ ਕੀੜਿਆਂ ਦੀ ਦਵਾਈ)",
      salt: "Albendazole 3g",
      category: "Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)",
      brand: "Virbac",
      batchNo: "ALB-721",
      expiryDate: "2027-04",
      rack: "Vet Drawer 1",
      stock: 40,
      minStockAlert: 15,
      mrp: 65.00,
      salePrice: 58.00,
      costPrice: 42.00,
      stripSize: "1 Bolus",
      requiresPrescription: false,
      usageInstructions: "Give 1 bolus empty stomach in morning once every 3 months for deworming.",
      isPopular: true
    },
    {
      id: "med_17",
      name: "Mammitel Intramammary Infusion",
      punjabiName: "ਮੈਮੀਟੈੱਲ ਟਿਊਬ (ਲੇਵੇ/ਥਣਾਂ ਦੀ ਸੋਜ ਅਤੇ ਛਿੱਦੀਆਂ ਦੀ ਦਵਾਈ)",
      salt: "Cloxacillin + Ampicillin Infusion",
      category: "Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)",
      brand: "Intas Animal Health",
      batchNo: "MM-120",
      expiryDate: "2026-12",
      rack: "Fridge (Bottom Tray)",
      stock: 14,
      minStockAlert: 6,
      mrp: 110.00,
      salePrice: 100.00,
      costPrice: 78.00,
      stripSize: "1 Syringe Tube",
      requiresPrescription: true,
      usageInstructions: "Administer through infected teat canal after milking as advised by doctor.",
      isPopular: true
    },
    {
      id: "med_18",
      name: "Belamyl Injection (10ml)",
      punjabiName: "ਬੇਲਾਮਿਲ ਟੀਕਾ (ਪਸ਼ੂਆਂ ਲਈ ਲਿਵਰ ਅਤੇ ਭੁੱਖ ਵਧਾਉਣ ਲਈ)",
      salt: "Vitamin B-Complex with Liver Extract",
      category: "Veterinary (ਪਸ਼ੂਆਂ ਦੀਆਂ ਦਵਾਈਆਂ)",
      brand: "Zydus Animal Health",
      batchNo: "BEL-55",
      expiryDate: "2027-05",
      rack: "Fridge (Ampoules)",
      stock: 25,
      minStockAlert: 8,
      mrp: 75.00,
      salePrice: 68.00,
      costPrice: 50.00,
      stripSize: "10ml Vial",
      requiresPrescription: true,
      usageInstructions: "For animal weakness and loss of appetite. Intramuscular injection.",
      isPopular: true
    },
    {
      id: "med_19",
      name: "Insulin Mixtard 30/70 (40IU/ml)",
      punjabiName: "ਮਿਕਸਟਾਰਡ ਇੰਸੁਲਿਨ ਟੀਕਾ (ਸ਼ੂਗਰ ਦਾ ਟੀਕਾ)",
      salt: "Biphasic Isophane Insulin Injection",
      category: "Diabetes & BP",
      brand: "Novo Nordisk",
      batchNo: "MX-291",
      expiryDate: "2027-02",
      rack: "Fridge (Medicine Compartment 2)",
      stock: 16,
      minStockAlert: 5,
      mrp: 185.00,
      salePrice: 170.00,
      costPrice: 142.00,
      stripSize: "10ml Vial",
      requiresPrescription: true,
      usageInstructions: "Must keep in refrigerator between 2-8 C. Administer as prescribed.",
      isPopular: true
    },
    {
      id: "med_20",
      name: "Otrivin Adult Nasal Spray 10ml",
      punjabiName: "ਓਟਰੀਵਿਨ ਸਪਰੇਅ (ਬੰਦ ਨੱਕ ਖੋਲ੍ਹਣ ਲਈ)",
      salt: "Xylometazoline HCl 0.1%",
      category: "Fever & Pain",
      brand: "GSK",
      batchNo: "OTR-11",
      expiryDate: "2027-09",
      rack: "Rack A-3",
      stock: 24,
      minStockAlert: 8,
      mrp: 115.00,
      salePrice: 105.00,
      costPrice: 82.00,
      stripSize: "10ml Bottle",
      requiresPrescription: false,
      usageInstructions: "1 spray in each nostril for quick nasal blockage relief.",
      isPopular: false
    }
  ],
  khatas: [
    {
      id: "kht_1",
      customerName: "Sardar Gurnam Singh Gill",
      punjabiName: "ਸਰਦਾਰ ਗੁਰਨਾਮ ਸਿੰਘ ਗਿੱਲ",
      phone: "9876512345",
      village: "Lohke Kalan (West Patti)",
      totalDues: 1450.00,
      limit: 5000.00,
      notes: "Regular village elder, pays every wheat/paddy harvest season.",
      transactions: [
        {
          id: "tx_101",
          date: "2026-10-01T10:30:00Z",
          type: "PURCHASE",
          amount: 650.00,
          description: "Telma 40 (2 strips) + Pan-D (1 strip)",
          balanceAfter: 650.00
        },
        {
          id: "tx_102",
          date: "2026-10-10T16:15:00Z",
          type: "PURCHASE",
          amount: 800.00,
          description: "Ostovet Forte 1L + Albomar Bolus",
          balanceAfter: 1450.00
        }
      ]
    },
    {
      id: "kht_2",
      customerName: "Harbhajan Singh Numberdar",
      punjabiName: "ਹਰਭਜਨ ਸਿੰਘ ਨੰਬਰਦਾਰ",
      phone: "9814423456",
      village: "Lohke Kalan (Near Pind School)",
      totalDues: 820.00,
      limit: 10000.00,
      notes: "Very trustworthy, Numberdar family.",
      transactions: [
        {
          id: "tx_201",
          date: "2026-10-12T11:00:00Z",
          type: "PURCHASE",
          amount: 1320.00,
          description: "Monthly BP & Diabetes medicines",
          balanceAfter: 1320.00
        },
        {
          id: "tx_202",
          date: "2026-10-16T18:20:00Z",
          type: "PAYMENT",
          amount: 500.00,
          description: "Partial cash payment received at shop",
          balanceAfter: 820.00
        }
      ]
    },
    {
      id: "kht_3",
      customerName: "Jagtar Singh Sandhu",
      punjabiName: "ਜਗਤਾਰ ਸਿੰਘ ਸੰਧੂ",
      phone: "9855567890",
      village: "Mallanwala (Nearby Village)",
      totalDues: 340.00,
      limit: 3000.00,
      notes: "Farmer from neighbor village",
      transactions: [
        {
          id: "tx_301",
          date: "2026-10-15T14:40:00Z",
          type: "PURCHASE",
          amount: 340.00,
          description: "Himax + Betadine + Cotton Roll",
          balanceAfter: 340.00
        }
      ]
    }
  ],
  bills: [
    {
      id: "BILL-2026-1001",
      billNumber: 1001,
      createdAt: "2026-10-19T09:15:00.000Z",
      customerName: "Kulwant Singh",
      customerPhone: "9872111222",
      customerVillage: "Lohke Kalan",
      items: [
        {
          id: "med_1",
          name: "Dolo 650 mg Tablet",
          qty: 2,
          unitPrice: 30.00,
          total: 60.00,
          batchNo: "DL-9821"
        },
        {
          id: "med_2",
          name: "Pan-D Capsule",
          qty: 1,
          unitPrice: 175.00,
          total: 175.00,
          batchNo: "PND-441"
        }
      ],
      subtotal: 235.00,
      discount: 10.00,
      grandTotal: 225.00,
      paymentMode: "Cash",
      isPaid: true
    },
    {
      id: "BILL-2026-1002",
      billNumber: 1002,
      createdAt: "2026-10-19T10:45:00.000Z",
      customerName: "Balwinder Kaur",
      customerPhone: "9815099887",
      customerVillage: "Lohke Kalan",
      items: [
        {
          id: "med_4",
          name: "Telma 40 mg Tablet",
          qty: 1,
          unitPrice: 205.00,
          total: 205.00,
          batchNo: "TL-882"
        },
        {
          id: "med_8",
          name: "Shelcal 500 Tablet",
          qty: 1,
          unitPrice: 130.00,
          total: 130.00,
          batchNo: "SH-551"
        }
      ],
      subtotal: 335.00,
      discount: 15.00,
      grandTotal: 320.00,
      paymentMode: "UPI",
      isPaid: true
    }
  ],
  prescriptions: [
    {
      id: "rx_1",
      patientName: "Simranjit Kaur",
      punjabiPatientName: "ਸਿਮਰਨਜੀਤ ਕੌਰ",
      phone: "9814499001",
      village: "Lohke Kalan (Near Pind Gurdwara)",
      age: "48",
      gender: "Female",
      doctorName: "Dr. Sharma (Civil Hospital Zira)",
      medicinesRequested: "Need 1 month sugar and blood pressure medicine as per attached slip",
      imageUrl: "/sample-prescriptions/rx1.svg",
      status: "READY_FOR_PICKUP", // PENDING, QUOTED, READY_FOR_PICKUP, COMPLETED, REJECTED
      urgency: "Normal",
      createdAt: "2026-10-19T08:30:00.000Z",
      totalQuote: 480.00,
      chemistReply: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ, ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਪੈਕ ਕਰ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਤੁਸੀਂ ਦੁਕਾਨ ਤੋਂ ਆ ਕੇ ਲੈ ਸਕਦੇ ਹੋ ਜਾਂ ਅਸੀਂ ਪਿੰਡ 'ਚ ਭੇਜ ਦੇਵਾਂਗੇ।"
    },
    {
      id: "rx_2",
      patientName: "Gurpreet Singh",
      punjabiPatientName: "ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ",
      phone: "9876544332",
      village: "Lohke Kalan (Canal Bridge Side)",
      age: "32",
      gender: "Male",
      doctorName: "Local Clinic Ferozepur",
      medicinesRequested: "Cough syrup and fever tablets prescribed yesterday",
      imageUrl: "/sample-prescriptions/rx2.svg",
      status: "PENDING",
      urgency: "Urgent",
      createdAt: "2026-10-19T11:20:00.000Z",
      totalQuote: 0,
      chemistReply: ""
    }
  ],
  distributors: [
    {
      id: "dist_1",
      name: "Bansal Pharma Wholesale (ਬੰਸਲ ਫਾਰਮਾ ਫ਼ਿਰੋਜ਼ਪੁਰ)",
      city: "Ferozepur City (Railway Road)",
      phone: "9872112345",
      whatsapp: "919872112345",
      supplies: "Allopathic, Antibiotics, Alkem, Micro Labs",
      deliveryDays: "Tuesday, Thursday, Saturday"
    },
    {
      id: "dist_2",
      name: "Kisan & Animal Care Agency Zira (ਕਿਸਾਨ ਏਜੰਸੀ ਜ਼ੀਰਾ)",
      city: "Zira (Talwandi Road)",
      phone: "9814055667",
      whatsapp: "919814055667",
      supplies: "Veterinary medicines, Virbac, Intas, Cattle Feed Tonics",
      deliveryDays: "Monday, Wednesday, Friday"
    },
    {
      id: "dist_3",
      name: "National Medicos Distributor Moga (ਨੈਸ਼ਨਲ ਮੋਗਾ)",
      city: "Moga (Baghapurana Chowk)",
      phone: "9855198765",
      whatsapp: "919855198765",
      supplies: "General, Ayurvedic, Surgical items, Cotton, Syringes",
      deliveryDays: "Daily Courier / Bus Service"
    }
  ]
};

class DataStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = INITIAL_DATA;
        this.save();
      }
    } catch (err) {
      console.error("Error initializing database, using initial data:", err);
      this.data = INITIAL_DATA;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error("Error saving database:", err);
      return false;
    }
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  getMedicines() {
    return this.data.medicines;
  }

  addMedicine(medicine) {
    const newMed = {
      id: 'med_' + Date.now(),
      ...medicine,
      stock: Number(medicine.stock || 0),
      minStockAlert: Number(medicine.minStockAlert || 10),
      mrp: Number(medicine.mrp || 0),
      salePrice: Number(medicine.salePrice || 0),
      costPrice: Number(medicine.costPrice || 0)
    };
    this.data.medicines.unshift(newMed);
    this.save();
    return newMed;
  }

  updateMedicine(id, updates) {
    const index = this.data.medicines.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.data.medicines[index] = {
      ...this.data.medicines[index],
      ...updates,
      stock: updates.stock !== undefined ? Number(updates.stock) : this.data.medicines[index].stock,
      mrp: updates.mrp !== undefined ? Number(updates.mrp) : this.data.medicines[index].mrp,
      salePrice: updates.salePrice !== undefined ? Number(updates.salePrice) : this.data.medicines[index].salePrice
    };
    this.save();
    return this.data.medicines[index];
  }

  deleteMedicine(id) {
    const index = this.data.medicines.findIndex(m => m.id === id);
    if (index === -1) return false;
    this.data.medicines.splice(index, 1);
    this.save();
    return true;
  }

  // POS & Billing
  createBill(billData) {
    const billNumber = (this.data.bills.length ? Math.max(...this.data.bills.map(b => b.billNumber || 1000)) : 1000) + 1;
    const newBill = {
      id: `BILL-2026-${billNumber}`,
      billNumber,
      createdAt: new Date().toISOString(),
      ...billData
    };

    // Decrement stock for items sold
    if (Array.isArray(billData.items)) {
      billData.items.forEach(item => {
        const med = this.data.medicines.find(m => m.id === item.id);
        if (med) {
          med.stock = Math.max(0, med.stock - Number(item.qty || 1));
        }
      });
    }

    // If Khata payment, link or add to customer ledger
    if (billData.paymentMode === 'Khata' && billData.customerName) {
      this.recordKhataDebit(billData.customerName, billData.customerPhone, billData.customerVillage, billData.grandTotal, `Bill #${billNumber}`);
    }

    this.data.bills.unshift(newBill);
    this.save();
    return newBill;
  }

  getBills() {
    return this.data.bills;
  }

  // Khata (Village Credit System)
  getKhatas() {
    return this.data.khatas;
  }

  addKhataCustomer(customer) {
    const newKhata = {
      id: 'kht_' + Date.now(),
      customerName: customer.customerName,
      punjabiName: customer.punjabiName || customer.customerName,
      phone: customer.phone,
      village: customer.village || "Lohke Kalan",
      totalDues: Number(customer.totalDues || 0),
      limit: Number(customer.limit || 5000),
      notes: customer.notes || "",
      transactions: []
    };
    if (newKhata.totalDues > 0) {
      newKhata.transactions.push({
        id: 'tx_' + Date.now(),
        date: new Date().toISOString(),
        type: 'OPENING_BALANCE',
        amount: newKhata.totalDues,
        description: 'Opening balance / ਪੁਰਾਣਾ ਬਕਾਇਆ',
        balanceAfter: newKhata.totalDues
      });
    }
    this.data.khatas.unshift(newKhata);
    this.save();
    return newKhata;
  }

  recordKhataPayment(khataId, amount, note = "Cash Payment Received") {
    const khata = this.data.khatas.find(k => k.id === khataId);
    if (!khata) return null;
    const amt = Number(amount);
    khata.totalDues = Math.max(0, khata.totalDues - amt);
    khata.transactions.unshift({
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: 'PAYMENT',
      amount: amt,
      description: note,
      balanceAfter: khata.totalDues
    });
    this.save();
    return khata;
  }

  recordKhataDebit(customerName, phone, village, amount, description) {
    let khata = this.data.khatas.find(k => 
      k.customerName.toLowerCase() === customerName.toLowerCase() || 
      (phone && k.phone === phone)
    );
    if (!khata) {
      khata = {
        id: 'kht_' + Date.now(),
        customerName,
        punjabiName: customerName,
        phone: phone || '',
        village: village || 'Lohke Kalan',
        totalDues: 0,
        limit: 5000,
        notes: "Created from POS Bill",
        transactions: []
      };
      this.data.khatas.unshift(khata);
    }

    const amt = Number(amount);
    khata.totalDues += amt;
    khata.transactions.unshift({
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      type: 'PURCHASE',
      amount: amt,
      description,
      balanceAfter: khata.totalDues
    });
    this.save();
    return khata;
  }

  // Prescriptions & Requests
  getPrescriptions() {
    return this.data.prescriptions;
  }

  addPrescription(rxData) {
    const newRx = {
      id: 'rx_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      totalQuote: 0,
      chemistReply: '',
      ...rxData
    };
    this.data.prescriptions.unshift(newRx);
    this.save();
    return newRx;
  }

  updatePrescription(id, updates) {
    const rx = this.data.prescriptions.find(r => r.id === id);
    if (!rx) return null;
    Object.assign(rx, updates);
    this.save();
    return rx;
  }

  // Distributors
  getDistributors() {
    return this.data.distributors;
  }

  addDistributor(dist) {
    const newDist = {
      id: 'dist_' + Date.now(),
      ...dist
    };
    this.data.distributors.push(newDist);
    this.save();
    return newDist;
  }

  // Analytics & Dashboard Stats
  getAnalytics() {
    const medicines = this.data.medicines;
    const bills = this.data.bills;
    const khatas = this.data.khatas;
    const prescriptions = this.data.prescriptions;

    // Check expiry in next 90 days or expired
    const now = new Date();
    const ninetyDays = new Date();
    ninetyDays.setDate(now.getDate() + 90);

    const expiredList = [];
    const expiringSoonList = [];
    const lowStockList = [];

    medicines.forEach(m => {
      if (m.stock <= m.minStockAlert) {
        lowStockList.push(m);
      }
      if (m.expiryDate) {
        // Expiry format YYYY-MM
        const [year, month] = m.expiryDate.split('-').map(Number);
        const expDate = new Date(year, (month || 12) - 1, 28);
        if (expDate < now) {
          expiredList.push(m);
        } else if (expDate <= ninetyDays) {
          expiringSoonList.push(m);
        }
      }
    });

    // Today sales
    const todayStr = now.toISOString().slice(0, 10);
    const todayBills = bills.filter(b => (b.createdAt || '').slice(0, 10) === todayStr);
    const totalTodaySales = todayBills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);
    const cashSales = todayBills.filter(b => b.paymentMode === 'Cash').reduce((acc, b) => acc + (b.grandTotal || 0), 0);
    const upiSales = todayBills.filter(b => b.paymentMode === 'UPI').reduce((acc, b) => acc + (b.grandTotal || 0), 0);
    const khataSales = todayBills.filter(b => b.paymentMode === 'Khata').reduce((acc, b) => acc + (b.grandTotal || 0), 0);

    const totalKhataOutstanding = khatas.reduce((acc, k) => acc + (k.totalDues || 0), 0);
    const pendingPrescriptions = prescriptions.filter(p => p.status === 'PENDING').length;

    return {
      totalMedicines: medicines.length,
      totalInventoryValue: medicines.reduce((acc, m) => acc + (m.stock * m.salePrice), 0),
      totalCostValue: medicines.reduce((acc, m) => acc + (m.stock * m.costPrice), 0),
      lowStockCount: lowStockList.length,
      lowStockList,
      expiringSoonCount: expiringSoonList.length,
      expiringSoonList,
      expiredCount: expiredList.length,
      expiredList,
      todaySales: totalTodaySales,
      todayCash: cashSales,
      todayUpi: upiSales,
      todayKhata: khataSales,
      todayBillsCount: todayBills.length,
      totalKhataOutstanding,
      pendingPrescriptions
    };
  }
}

export const db = new DataStore();
