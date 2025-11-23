import React, { useState } from 'react';
import MainLayout from "../layouts/MainLayout";
import QRCode from "react-qr-code"; // 1. Import Library QR Code Asli
// Pastikan path ini sesuai dengan lokasi file seedProsesEkspor.js Anda
import { seedProsesEkspor } from "../data/seedProsesEkspor";

import { 
  Plus, Search, Pencil, Trash2, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowLeft, Download, Printer, Copy, CheckSquare, Square,
  FileText, MapPin, Package
} from 'lucide-react';

export default function ProsesEkspor() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); 
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Editable State) ---
  const [dataProses, setDataProses] = useState(seedProsesEkspor);

  // --- STATE FORM CREATE ---
  const [selectedKomoditas, setSelectedKomoditas] = useState("");

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataProses.filter((item) =>
    item.eksportir.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.komoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.negara.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS ---
  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };
  const handleGoToDetail = (item) => { setSelectedItem(item); setView('detail'); };
  const handleGoToCreate = () => { setSelectedItem(null); setSelectedKomoditas(""); setView('create'); };
  const handleBack = () => { setSelectedItem(null); setView('list'); };

  // --- TOGGLE CHECKBOX ---
  const handleToggleStatus = (id, field) => {
    const updatedData = dataProses.map((item) => {
      if (item.id === id) return { ...item, [field]: !item[field] }; 
      return item;
    });
    setDataProses(updatedData);
  };

  // =========================================
  // 1. TAMPILAN DAFTAR (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data Proses Ekspor</h2>
          <p className="text-sm text-gray-500">Kelola proses ekspor, QR Code, dan status dokumen.</p>
        </div>
        <button onClick={handleGoToCreate} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
          <Plus size={18} /> Tambah Proses Ekspor
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tampilkan</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-1.5">
            <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option>
          </select>
          <span>data</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
          <input type="text" value={searchTerm} onChange={handleSearch} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 pl-10 p-2" placeholder="Cari Eksportir, Komoditas..." />
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-12 border-r border-gray-200">No</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Tanggal Ekspor</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Eksportir</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Komoditas</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Negara Tujuan</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Nomor Kontainer</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200 text-center">COO</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200 text-center">Sertifikat Kesehatan</th>
              <th className="px-6 py-4 font-semibold w-48 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.tanggal}</td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{item.eksportir}</td>
                  <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">{item.komoditas}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.negara}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.kontainer}</td>
                  
                  {/* Checklist COO */}
                  <td className="px-6 py-4 text-center border-r border-gray-200">
                     <button onClick={() => handleToggleStatus(item.id, 'coo')} className="hover:scale-110 transition-transform focus:outline-none" title={item.coo ? "Sudah Ada" : "Belum Ada"}>
                        {item.coo ? <CheckSquare size={22} className="text-green-600 inline shadow-sm rounded-sm"/> : <Square size={22} className="text-gray-300 inline hover:text-gray-400"/>}
                     </button>
                  </td>
                  
                  {/* Checklist Health Cert */}
                  <td className="px-6 py-4 text-center border-r border-gray-200">
                     <button onClick={() => handleToggleStatus(item.id, 'healthCert')} className="hover:scale-110 transition-transform focus:outline-none" title={item.healthCert ? "Sudah Ada" : "Belum Ada"}>
                        {item.healthCert ? <CheckSquare size={22} className="text-green-600 inline shadow-sm rounded-sm"/> : <Square size={22} className="text-gray-300 inline hover:text-gray-400"/>}
                     </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleGoToDetail(item)} title="Lihat Detail" className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition"><Eye size={18} /></button>
                      <button title="Ubah Data" className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><Pencil size={18} /></button>
                      <button title="Hapus Data" className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginasi */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">Showing {currentItems.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}</span>
        <div className="inline-flex -space-x-px text-sm">
           <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"><ChevronsLeft size={16}/></button>
           <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
           <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 font-bold">{currentPage}</button>
           <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16}/></button>
           <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"><ChevronsRight size={16}/></button>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 2. TAMPILAN TAMBAH (MODERN UI CREATE VIEW)
  // =========================================
  const renderCreateView = () => {
    const groupA = ["Kopi", "Paha Kodok", "Santan"];
    const groupB = ["Pempek", "Kerupuk", "Kopi Bubuk"];
    const isGroupA = groupA.includes(selectedKomoditas);
    const isGroupB = groupB.includes(selectedKomoditas);

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
          <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/></button>
          <div><h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Data Proses Ekspor</h2><p className="text-sm text-gray-500">Lengkapi form untuk mencatat proses ekspor baru.</p></div>
        </div>
        <div className="p-8 bg-gray-50/30">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* ... (Bagian Form Input Kiri & Kanan sama seperti sebelumnya) ... */}
            {/* Agar tidak terlalu panjang, bagian renderCreateView ini sama persis dengan kode sebelumnya */}
             <div className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Komoditas <span className="text-red-500">*</span></label>
                    <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Package size={18} /></div><select value={selectedKomoditas} onChange={(e) => setSelectedKomoditas(e.target.value)} className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium appearance-none"><option value="">- Pilih Komoditas -</option><optgroup label="Komoditas Mentah"><option value="Kopi">Kopi</option><option value="Paha Kodok">Paha Kodok</option><option value="Santan">Santan</option></optgroup><optgroup label="Produk UMKM"><option value="Pempek">Pempek</option><option value="Kerupuk">Kerupuk</option><option value="Kopi Bubuk">Kopi Bubuk</option></optgroup></select></div>
                </div>
                <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Negara Tujuan</label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><MapPin size={18} /></div><input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Contoh: Malaysia" /></div></div>
                <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Nomor Kontainer</label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><FileText size={18} /></div><input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Contoh: MEDU1234567" /></div></div>
            </div>
            <div className="space-y-6 flex flex-col justify-between">
                {isGroupA && (<div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Eksportir</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih Eksportir -</option><option>PT. AJ Kopi</option></select></div><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Gudang</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih Gudang -</option><option>Gudang Sriwijaya</option></select></div><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Pengepul</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih Pengepul -</option><option>Fauzi Abror</option></select></div><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Petani</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih Petani -</option><option>Andi Marhan</option></select></div></div>)}
                {isGroupB && (<div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">UMKM</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih UMKM -</option><option>Pempek Belido 99</option></select></div><div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Produk dan Merek</label><select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium"><option>- Pilih Merek -</option><option>Pempek Frozen 99</option></select></div></div>)}
                {!isGroupA && !isGroupB && (<div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 px-4"><Package size={32} className="mb-2 opacity-50"/><p className="text-sm font-medium">Silahkan pilih Komoditas terlebih dahulu</p></div>)}
                {(isGroupA || isGroupB) && (<div className="flex justify-end pt-8 mt-auto"><button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all duration-200"><Plus size={20} /> Buat QR Code & Simpan</button></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================
  // 3. TAMPILAN DETIL (MODERN UI DETAIL VIEW + REAL QR)
  // =========================================
  const renderDetailView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header Detil */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Detil Proses Ekspor</h2>
          <p className="text-sm text-gray-500">Informasi lengkap pengiriman dan dokumen.</p>
        </div>
      </div>

      {/* Konten Detil */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* KOLOM KIRI: QR CODE ASLI (GENERATED) */}
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center h-full">
                 
                 {/* REAL QR CODE GENERATOR */}
                 <div className="w-full aspect-square bg-white border-4 border-gray-900 p-4 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 180, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`
ID Ekspor: ${selectedItem?.id}
Tanggal: ${selectedItem?.tanggal}
Eksportir: ${selectedItem?.eksportir}
Komoditas: ${selectedItem?.komoditas}
Negara: ${selectedItem?.negara}
Kontainer: ${selectedItem?.kontainer}
                            `}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                 </div>

                 <p className="text-xs text-gray-400 mb-4 font-mono uppercase tracking-widest">ID: {selectedItem?.id} / {selectedItem?.tanggal}</p>
                 
                 <div className="w-full space-y-3 mt-auto">
                    <button className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20">
                       <Printer size={16}/> Cetak QR Code
                    </button>
                    <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2">
                       <Copy size={16}/> Salin Info
                    </button>
                 </div>
              </div>
           </div>

           {/* KOLOM KANAN: INFORMASI DETAIL (Sama seperti sebelumnya) */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Data Pengiriman</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Tanggal</label><p className="text-base font-semibold text-gray-900">{selectedItem?.tanggal}</p></div>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Negara Tujuan</label><p className="text-base font-semibold text-gray-900">{selectedItem?.negara}</p></div>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Eksportir</label><p className="text-base font-bold text-green-700">{selectedItem?.eksportir}</p></div>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Komoditas</label><span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">{selectedItem?.komoditas}</span></div>
                    <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium text-gray-500 uppercase">No. Kontainer</label><p className="text-base font-mono font-semibold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-200 inline-block">{selectedItem?.kontainer}</p></div>
                 </div>
              </div>

              {selectedItem?.tipe !== 'umkm' && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Rantai Pasok</h4>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Gudang</span><span className="font-semibold text-gray-900">{selectedItem?.gudang}</span></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Pengepul</span><span className="font-semibold text-gray-900">{selectedItem?.pengepul}</span></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Petani</span><span className="font-semibold text-gray-900">{selectedItem?.petani}</span></div>
                     </div>
                  </div>
              )}

               {selectedItem?.tipe === 'umkm' && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Detail Produk</h4>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Nama UMKM</span><span className="font-semibold text-gray-900">{selectedItem?.umkm}</span></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Produk</span><span className="font-semibold text-gray-900">{selectedItem?.produk}</span></div>
                     </div>
                  </div>
              )}

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Status Dokumen</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                       <span className="text-sm font-medium text-gray-700">COO</span>
                       <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Download size={14}/> Unduh</button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                       <span className="text-sm font-medium text-gray-700">Health Cert</span>
                       <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Download size={14}/> Unduh</button>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Data Proses Ekspor" : view === 'create' ? "Tambah Proses Ekspor" : "Detil Proses Ekspor"}>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateView()}
      {view === 'detail' && renderDetailView()}
    </MainLayout>
  );
}