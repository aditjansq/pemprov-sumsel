// src/data/seedProsesEkspor.js

export const seedProsesEkspor = [
  { 
    id: 1, 
    tanggal: "19 November 2025", 
    eksportir: "PT. AJ Kopi", 
    komoditas: "Kopi", 
    negara: "Malaysia", 
    kontainer: "712",
    coo: true,
    healthCert: true,
    // Data tambahan untuk detail
    gudang: "Gudang Sriwijaya",
    pengepul: "Fauzi Abror",
    petani: "Andi Marhan",
    tipe: "komoditas_mentah" 
  },
  { 
    id: 2, 
    tanggal: "20 November 2025", 
    eksportir: "PT. AJ Kopi", 
    komoditas: "Kopi", 
    negara: "Singapore", 
    kontainer: "881",
    coo: true,
    healthCert: false,
    tipe: "komoditas_mentah"
  },
  { 
    id: 3, 
    tanggal: "21 November 2025", 
    eksportir: "Pempek Belido 99", 
    komoditas: "Pempek", 
    negara: "Malaysia", 
    kontainer: "905",
    coo: false,
    healthCert: false,
    // Data tambahan umkm
    umkm: "Pempek Belido 99",
    produk: "Pempek Frozen 99",
    tipe: "umkm"
  },
];