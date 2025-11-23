import React, { useState, useRef } from 'react';
import MainLayout from "../layouts/MainLayout";
// Pastikan path ini sesuai dengan lokasi file seedUmkm.js Anda
import { seedUmkm } from "../data/seedUmkm";

import { 
  Plus, Search, Pencil, Trash2, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowLeft, Upload, MapPin, Phone, User, Store, 
  FileCheck, Package, Save, X, ImageIcon, CloudUpload, 
  FileText, Download, Tag, FileBadge
} from 'lucide-react';

export default function Umkm() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); // 'list' | 'create' | 'detail' | 'perizinan' | 'produk'
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Dari Seed) ---
  const [dataUMKM] = useState(seedUmkm);

  // --- STATE HALAMAN PRODUK ---
  const [produkList, setProdukList] = useState([
    { id: 1, nama: "Pempek Lenjer", merek: "Pempek Frozen Ajib", noSertifikat: "1231GH7765", foto: "pempek.jpg" }
  ]);
  
  // Form Input Produk
  const [prodNama, setProdNama] = useState("");
  const [prodMerek, setProdMerek] = useState("");
  const [prodNoSertifikat, setProdNoSertifikat] = useState("");
  
  // Upload Produk
  const [prodFoto, setProdFoto] = useState(null);
  const [prodFotoPreview, setProdFotoPreview] = useState(null);
  const prodFotoRef = useRef(null);

  const [prodSertifikat, setProdSertifikat] = useState(null);
  const prodSertifikatRef = useRef(null);

  // --- STATE LAINNYA (Create, Perizinan, Search, Pagination) ---
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);
  
  // State Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- STATE PERIZINAN ---
  const [pirtFile, setPirtFile] = useState(null);
  const pirtInputRef = useRef(null);
  const [halalFile, setHalalFile] = useState(null);
  const halalInputRef = useRef(null);
  const [nibFile, setNibFile] = useState(null);
  const nibInputRef = useRef(null);

  // --- LOGIC FILTERING ---
  const filteredData = dataUMKM.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS UMUM ---
  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };

  const handleGoToDetail = (item) => { setSelectedItem(item); setView('detail'); };
  const handleGoToPerizinan = (item) => { setSelectedItem(item); setView('perizinan'); };
  
  const handleGoToProduk = (item) => { 
    setSelectedItem(item); 
    setProdNama(""); setProdMerek(""); setProdNoSertifikat("");
    setProdFoto(null); setProdFotoPreview(null); setProdSertifikat(null);
    setView('produk'); 
  };

  const handleGoToCreate = () => { setSelectedItem(null); setLogoFile(null); setLogoPreview(null); setView('create'); };
  const handleBack = () => { setSelectedItem(null); setView('list'); };

  // Handlers Upload Generic
  const handleFileChange = (setter, previewSetter = null) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      if (previewSetter) previewSetter(URL.createObjectURL(file));
    }
  };

  const handleSimpanProduk = () => {
    if(!prodNama || !prodMerek) {
        alert("Nama Produk dan Merek wajib diisi!");
        return;
    }
    const newProduct = {
        id: produkList.length + 1,
        nama: prodNama,
        merek: prodMerek,
        noSertifikat: prodNoSertifikat || "-",
        foto: prodFoto ? prodFoto.name : null
    };
    setProdukList([...produkList, newProduct]);
    setProdNama(""); setProdMerek(""); setProdNoSertifikat("");
    setProdFoto(null); setProdFotoPreview(null); setProdSertifikat(null);
  };

  // =========================================
  // 1. TAMPILAN DAFTAR (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data UMKM</h2>
          <p className="text-sm text-gray-500">Kelola data Usaha Mikro, Kecil, dan Menengah.</p>
        </div>
        <button onClick={handleGoToCreate} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
          <Plus size={18} /> Tambah UMKM
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tampilkan</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-1.5">
            <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
          </select>
          <span>data</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
          <input type="text" value={searchTerm} onChange={handleSearch} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 pl-10 p-2" placeholder="Cari Nama, Pemilik..." />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-12 border-r border-gray-200">No</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Nama UMKM</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Alamat</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Nama Pemilik</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Telepon/WA</th>
              <th className="px-6 py-4 font-semibold w-80 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{item.nama}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-xs" title={item.alamat}>{item.alamat}</td>
                  <td className="px-6 py-4 text-gray-800 border-r border-gray-200">{item.pemilik}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.telepon}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleGoToPerizinan(item)} title="Kelola Perizinan" className="p-2 text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 hover:text-teal-800 transition"><FileCheck size={18} /></button>
                      <button onClick={() => handleGoToProduk(item)} title="Kelola Produk" className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition"><Package size={18} /></button>
                      <button onClick={() => handleGoToDetail(item)} title="Lihat Detail" className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 hover:text-orange-800 transition"><Eye size={18} /></button>
                      <button title="Ubah Data" className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"><Pencil size={18} /></button>
                      <button title="Hapus Data" className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Data UMKM tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Paginasi (LENGKAP DENGAN SKIP) */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold text-gray-900">{currentItems.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredData.length)}</span> dari <span className="font-semibold text-gray-900">{filteredData.length}</span> data
        </span>

        <div className="inline-flex -space-x-px text-sm">
           {/* Tombol First (Skip to Start) */}
           <button 
             onClick={() => setCurrentPage(1)} 
             disabled={currentPage === 1} 
             className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <ChevronsLeft size={16} />
           </button>

           {/* Tombol Prev */}
           <button 
             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
             disabled={currentPage === 1} 
             className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <ChevronLeft size={16} />
           </button>

           {/* Indikator Halaman */}
           <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-bold cursor-default">
             {currentPage}
           </button>

           {/* Tombol Next */}
           <button 
             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
             disabled={currentPage === totalPages || totalPages === 0} 
             className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <ChevronRight size={16} />
           </button>

           {/* Tombol Last (Skip to End) */}
           <button 
             onClick={() => setCurrentPage(totalPages)} 
             disabled={currentPage === totalPages || totalPages === 0} 
             className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-s-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <ChevronsRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 2. TAMPILAN TAMBAH (CREATE VIEW)
  // =========================================
  const renderCreateView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/></button>
        <div><h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Data UMKM</h2><p className="text-sm text-gray-500">Lengkapi form di bawah untuk mendaftarkan UMKM baru.</p></div>
      </div>
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Nama UMKM <span className="text-red-500">*</span></label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Store size={18} /></div><input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Masukkan Nama UMKM"/></div></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></label><div className="relative"><div className="absolute top-3.5 left-4 pointer-events-none text-gray-400"><MapPin size={18} /></div><textarea rows="4" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium resize-none" placeholder="Masukkan Alamat Lengkap"></textarea></div></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Nama Pemilik <span className="text-red-500">*</span></label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><User size={18} /></div><input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Masukkan Nama Pemilik"/></div></div>
          </div>
          <div className="space-y-6">
             <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Telepon / WhatsApp <span className="text-red-500">*</span></label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Phone size={18} /></div><input type="tel" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="08xxxxxxxxxx"/></div></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Logo UMKM</label><input type="file" ref={logoInputRef} onChange={handleFileChange(setLogoFile, setLogoPreview)} accept="image/*" className="hidden" /><div onClick={() => logoInputRef.current.click()} className={`group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${logoPreview ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}>{logoPreview ? <img src={logoPreview} alt="Preview" className="h-32 object-contain" /> : <><div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:scale-110 transition-all"><ImageIcon size={24} className="text-gray-400 group-hover:text-green-600" /></div><p className="text-xs font-semibold text-gray-500 group-hover:text-green-700">Upload Logo</p></>}</div></div>
            <div className="flex justify-end pt-8 gap-3"><button onClick={handleBack} className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition"><X size={20} /> Batal</button><button onClick={handleBack} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition"><Save size={20} /> Simpan</button></div>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 3. TAMPILAN PERIZINAN (PERIZINAN VIEW)
  // =========================================
  const renderPerizinanView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/></button>
        <div><h2 className="text-xl font-bold text-gray-900 tracking-tight">Perizinan UMKM</h2><p className="text-sm text-gray-500">Kelola dokumen legalitas untuk {selectedItem?.nama}.</p></div>
      </div>
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
         <div className="space-y-6">
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Nomor PIRT</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nomor PIRT" /></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Unggah Sertifikat PIRT (PDF)</label><input type="file" ref={pirtInputRef} onChange={handleFileChange(setPirtFile)} accept=".pdf" className="hidden" /><div onClick={() => pirtInputRef.current.click()} className={`group border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${pirtFile ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}>{pirtFile ? <FileText size={20} className="text-green-600"/> : <CloudUpload size={20} className="text-gray-400"/>}<span className="text-sm font-medium text-gray-600">{pirtFile ? pirtFile.name : "Pilih Sertifikat"}</span></div></div>
            
            <div className="space-y-2 mt-6"><label className="block text-sm font-semibold text-gray-700">Nomor Halal</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nomor Sertifikat Halal" /></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Unggah Sertifikat Halal (PDF)</label><input type="file" ref={halalInputRef} onChange={handleFileChange(setHalalFile)} accept=".pdf" className="hidden" /><div onClick={() => halalInputRef.current.click()} className={`group border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${halalFile ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}>{halalFile ? <FileText size={20} className="text-green-600"/> : <CloudUpload size={20} className="text-gray-400"/>}<span className="text-sm font-medium text-gray-600">{halalFile ? halalFile.name : "Pilih Sertifikat"}</span></div></div>
         </div>
         <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
                <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">NIB</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nomor Induk Berusaha" /></div>
                <div className="space-y-2"><label className="block text-sm font-semibold text-gray-700">Unggah NIB (PDF)</label><input type="file" ref={nibInputRef} onChange={handleFileChange(setNibFile)} accept=".pdf" className="hidden" /><div onClick={() => nibInputRef.current.click()} className={`group border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${nibFile ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}>{nibFile ? <FileText size={20} className="text-green-600"/> : <CloudUpload size={20} className="text-gray-400"/>}<span className="text-sm font-medium text-gray-600">{nibFile ? nibFile.name : "Upload NIB"}</span></div></div>
            </div>
            <div className="flex justify-end pt-4 gap-3"><button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition"><X size={20} /> Batal</button><button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition"><Save size={20} /> Simpan</button></div>
         </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 4. TAMPILAN DETIL (DETAIL VIEW)
  // =========================================
  const renderDetailView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/></button>
        <div><h2 className="text-xl font-bold text-gray-900 tracking-tight">Detail UMKM</h2><p className="text-sm text-gray-500">Informasi profil UMKM.</p></div>
      </div>
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1"><div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center h-full"><div className="w-40 h-40 mb-6 relative"><div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center"><Store size={64} className="text-gray-300" /></div><div className="absolute bottom-2 right-2 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div></div><h3 className="text-xl font-bold text-gray-900 mb-1">{selectedItem?.nama || "-"}</h3><p className="text-sm text-gray-500 font-medium mb-6">UMKM Terdaftar</p><div className="w-full space-y-3 mt-auto"><button className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"><Pencil size={16} /> Ubah Profil</button><button className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"><Trash2 size={16} /> Hapus Data</button></div></div></div>
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Informasi Umum</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><User size={14} /> Nama Pemilik</label><p className="text-base font-semibold text-gray-900">{selectedItem?.pemilik || "-"}</p></div>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone size={14} /> Kontak</label><p className="text-base font-semibold text-gray-900 font-mono">{selectedItem?.telepon || "-"}</p></div>
                    <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MapPin size={14} /> Alamat</label><p className="text-base font-semibold text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedItem?.alamat || "-"}</p></div>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div onClick={() => handleGoToPerizinan(selectedItem)} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"><div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors"><FileCheck size={24} /></div><div><h4 className="font-bold text-gray-900 group-hover:text-teal-700">Perizinan</h4><p className="text-xs text-gray-500">Kelola dokumen legalitas</p></div></div>
                  <div onClick={() => handleGoToProduk(selectedItem)} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Package size={24} /></div><div><h4 className="font-bold text-gray-900 group-hover:text-indigo-700">Produk</h4><p className="text-xs text-gray-500">Kelola katalog produk</p></div></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 5. TAMPILAN PRODUK (SPLIT LAYOUT - MODERN)
  // =========================================
  const renderProdukView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Produk UMKM: {selectedItem?.nama}</h2>
          <p className="text-sm text-gray-500">Kelola daftar produk unggulan untuk UMKM ini.</p>
        </div>
      </div>

      <div className="p-8 bg-gray-50/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === KOLOM KIRI: FORM INPUT (1/3) === */}
            <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-28">
                <h3 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Plus size={16} className="text-green-600"/> Tambah Produk Baru
                </h3>
                
                {/* Nama Produk */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Nama Produk <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"><Package size={16} /></div>
                        <input type="text" value={prodNama} onChange={(e) => setProdNama(e.target.value)} className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Contoh: Pempek Lenjer" />
                    </div>
                </div>

                {/* Upload Foto Produk */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Unggah Foto Produk</label>
                    <input type="file" ref={prodFotoRef} onChange={handleFileChange(setProdFoto, setProdFotoPreview)} accept="image/*" className="hidden" />
                    {!prodFotoPreview ? (
                        <div onClick={() => prodFotoRef.current.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/20 transition h-32 group">
                            <div className="p-2 bg-gray-50 rounded-full mb-2 group-hover:bg-white"><ImageIcon size={24} className="text-gray-400 group-hover:text-green-600" /></div>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-green-700">Pilih Foto (.jpg, .png)</span>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-32 shadow-sm">
                            <img src={prodFotoPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => {setProdFotoPreview(null); setProdFoto(null);}} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"><Trash2 size={20}/></button>
                        </div>
                    )}
                </div>

                {/* Merek */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Merek <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"><Tag size={16} /></div>
                        <input type="text" value={prodMerek} onChange={(e) => setProdMerek(e.target.value)} className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Merek Dagang" />
                    </div>
                </div>

                {/* Nomor Sertifikat Merek */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">No. Sertifikat Merek</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"><FileBadge size={16} /></div>
                        <input type="text" value={prodNoSertifikat} onChange={(e) => setProdNoSertifikat(e.target.value)} className="w-full pl-10 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nomor Sertifikat (Jika Ada)" />
                    </div>
                </div>

                {/* Upload Sertifikat Merek */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Unggah Sertifikat Merek</label>
                    <input type="file" ref={prodSertifikatRef} onChange={handleFileChange(setProdSertifikat)} accept=".pdf" className="hidden" />
                    <div onClick={() => prodSertifikatRef.current.click()} className={`border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition ${prodSertifikat ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/20'}`}>
                        {prodSertifikat ? <FileText size={18} className="text-green-600"/> : <CloudUpload size={18} className="text-gray-400"/>}
                        <span className={`text-xs font-medium ${prodSertifikat ? 'text-green-700' : 'text-gray-500'}`}>{prodSertifikat ? prodSertifikat.name : "Pilih Sertifikat (.pdf)"}</span>
                    </div>
                </div>

                {/* Tombol Simpan */}
                <button onClick={handleSimpanProduk} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-black hover:shadow-lg transition-all active:scale-95 mt-4">
                    <Save size={18} /> Simpan Produk
                </button>
            </div>

            {/* === KOLOM KANAN: TABEL DAFTAR PRODUK (2/3) === */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Daftar Produk Terdaftar</h3>
                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{produkList.length} Produk</span>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold w-12 border-r border-gray-200">No</th>
                                    <th className="px-6 py-3 font-semibold border-r border-gray-200">Nama Produk</th>
                                    <th className="px-6 py-3 font-semibold border-r border-gray-200">Merek</th>
                                    <th className="px-6 py-3 font-semibold border-r border-gray-200">No Sertifikat</th>
                                    <th className="px-6 py-3 font-semibold w-32 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {produkList.length > 0 ? (
                                    produkList.map((prod, idx) => (
                                        <tr key={prod.id} className="bg-white hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-100 text-center">{idx + 1}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-100 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                    {prod.foto ? <img src={prod.foto} className="w-full h-full object-cover" alt=""/> : <Package className="p-1.5 w-full h-full text-gray-400"/>}
                                                </div>
                                                {prod.nama}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 border-r border-gray-100">{prod.merek}</td>
                                            <td className="px-6 py-4 text-gray-600 font-mono border-r border-gray-100 text-xs">{prod.noSertifikat}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button title="Lihat Detail" className="p-1.5 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition"><Eye size={16} /></button>
                                                    <button title="Ubah" className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><Pencil size={16} /></button>
                                                    <button title="Hapus" className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Package size={48} strokeWidth={1.5} className="mb-3 opacity-50"/>
                                                <p className="text-base font-medium text-gray-500">Belum ada produk</p>
                                                <p className="text-sm">Silakan tambahkan produk melalui form di sebelah kiri.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Data UMKM" : view === 'create' ? "Tambah UMKM" : view === 'perizinan' ? "Perizinan UMKM" : view === 'produk' ? "Produk UMKM" : "Detil UMKM"}>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateView()}
      {view === 'perizinan' && renderPerizinanView()}
      {view === 'produk' && renderProdukView()}
      {view === 'detail' && renderDetailView()}
    </MainLayout>
  );
}