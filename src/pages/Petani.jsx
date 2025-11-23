import React, { useState, useRef } from 'react';
import MainLayout from "../layouts/MainLayout";
// 1. Import Data Seed
import { seedPetani } from "../data/seedPetani";

import { 
  Plus, Search, Pencil, Trash2, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowLeft, Save, Upload, MapPin, Phone, User, X, ImageIcon, Box
} from 'lucide-react';

export default function Petani() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); 
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Dari file seed) ---
  const [dataPetani] = useState(seedPetani);

  // --- STATE FORM CREATE ---
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataPetani.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.komoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS ---
  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };
  
  const handleGoToCreate = () => {
    setSelectedItem(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setView('create');
  };

  const handleGoToDetail = (item) => { setSelectedItem(item); setView('detail'); };
  const handleBack = () => { setSelectedItem(null); setView('list'); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // =========================================
  // 1. TAMPILAN DAFTAR (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header Card */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data Petani</h2>
          <p className="text-sm text-gray-500">Kelola data petani komoditas unggulan.</p>
        </div>
        <button onClick={handleGoToCreate} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
          <Plus size={18} /> Tambah Petani
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tampilkan</span>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-1.5">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>data</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
          <input type="text" value={searchTerm} onChange={handleSearch} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 pl-10 p-2" placeholder="Cari Nama, Komoditas..." />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-16 border-r border-gray-200">No</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Nama</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Komoditas</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Alamat</th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">Telepon/WA</th>
              <th className="px-6 py-4 font-semibold w-48 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{item.nama}</td>
                  <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">{item.komoditas}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-xs" title={item.alamat}>{item.alamat}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.telepon}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleGoToDetail(item)} title="Lihat Detail" className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 hover:text-orange-800 transition"><Eye size={18} /></button>
                      <button title="Ubah Data" className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"><Pencil size={18} /></button>
                      <button title="Hapus Data" className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Data petani tidak ditemukan.</td></tr>
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
  const renderCreateView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header Modern */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Data Petani</h2>
          <p className="text-sm text-gray-500">Lengkapi form di bawah untuk mendaftarkan petani baru.</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI (Inputs) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Petani <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><User size={18} /></div>
                 <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium" placeholder="Masukkan Nama Lengkap"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400"><MapPin size={18} /></div>
                 <textarea rows="4" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium resize-none" placeholder="Masukkan Alamat Lengkap"></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Telepon / WA <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Phone size={18} /></div>
                 <input type="tel" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium" placeholder="08xxxxxxxxxx"/>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Select & Upload) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Komoditas <span className="text-red-500">*</span></label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Box size={18} /></div>
                  <select className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium appearance-none">
                    <option value="">- Pilih Komoditas -</option>
                    <option value="Kopi">Kopi</option>
                    <option value="Paha Kodok">Paha Kodok</option>
                    <option value="Santan">Santan</option>
                    <option value="Kopi Bubuk">Kopi Bubuk</option>
                    <option value="Pempek">Pempek</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Foto Petani</label>
              <input type="file" ref={photoInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
              
              {!photoPreview ? (
                <div onClick={() => photoInputRef.current.click()} className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300">
                  <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300"><ImageIcon size={24} className="text-gray-400 group-hover:text-green-600" /></div>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-green-700 text-center">Upload Foto</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => {setPhotoPreview(null); setPhotoFile(null);}} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
               <label className="block text-sm font-semibold text-gray-700">Aksi</label>
               <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all duration-200"><Save size={20} /> Simpan Data</button>
               <button onClick={handleBack} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200"><X size={20} /> Batal</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // =========================================
  // 3. TAMPILAN DETIL (MODERN UI DETAIL VIEW)
  // =========================================
  const renderDetailView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header Modern */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Detail Petani</h2>
          <p className="text-sm text-gray-500">Informasi lengkap profil dan komoditas petani.</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* KOLOM KIRI: KARTU PROFIL */}
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center h-full">
                 <div className="w-40 h-40 mb-6 relative">
                    <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                       <User size={64} className="text-gray-300" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedItem?.nama || "-"}</h3>
                 <p className="text-sm text-gray-500 font-medium mb-6">Petani Terdaftar</p>
                 <div className="w-full space-y-3 mt-auto">
                    <button className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"><Pencil size={16} /> Ubah Profil</button>
                    <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"><Trash2 size={16} /> Hapus Data</button>
                 </div>
              </div>
           </div>

           {/* KOLOM KANAN: INFORMASI DETAIL */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* Card: Informasi Kontak & Lokasi */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Informasi Pribadi</h4>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Phone size={20} /></div>
                       <div><p className="text-xs font-medium text-gray-500 uppercase">Kontak / WhatsApp</p><p className="text-base font-semibold text-gray-900 font-mono mt-0.5">{selectedItem?.telepon || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-red-50 text-red-600 rounded-lg"><MapPin size={20} /></div>
                       <div><p className="text-xs font-medium text-gray-500 uppercase">Alamat Lengkap</p><p className="text-base font-semibold text-gray-900 mt-0.5 leading-relaxed">{selectedItem?.alamat || "-"}</p></div>
                    </div>
                 </div>
              </div>

              {/* Card: Informasi Bisnis */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Informasi Pertanian</h4>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Box size={20} /></div>
                    <div>
                       <p className="text-xs font-medium text-gray-500 uppercase">Komoditas Utama</p>
                       <span className="inline-flex mt-2 items-center px-3 py-1 rounded-md text-sm font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                          {selectedItem?.komoditas || "-"}
                       </span>
                    </div>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Data Petani" : view === 'create' ? "Tambah Petani" : "Detil Petani"}>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateView()}
      {view === 'detail' && renderDetailView()}
    </MainLayout>
  );
}