import React, { useState, useRef } from 'react';
import MainLayout from "../layouts/MainLayout";
// Import Data Seed
import { seedPeternakan } from "../data/seedPeternakan";

import { 
  Plus, Search, Pencil, Trash2, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowLeft, Upload, Download, Phone, MapPin, User, FileText, Save, X,
  ImageIcon, CloudUpload, Box
} from 'lucide-react';

export default function Peternakan() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); // 'list' | 'create' | 'detail'
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Dari Seed) ---
  const [dataPeternakan] = useState(seedPeternakan);

  // --- STATE FORM CREATE ---
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef(null);

  const [ownerPhotoFile, setOwnerPhotoFile] = useState(null);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState(null);
  const ownerPhotoInputRef = useRef(null);

  const [certFile, setCertFile] = useState(null);
  const certInputRef = useRef(null);


  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataPeternakan.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hewan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.komoditas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleGoToDetail = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  const handleGoToCreate = () => {
    setSelectedItem(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setOwnerPhotoFile(null);
    setOwnerPhotoPreview(null);
    setCertFile(null);
    setView('create');
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView('list');
  };

  const handleFileChange = (setter, previewSetter = null) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      if (previewSetter) previewSetter(URL.createObjectURL(file));
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
          <h2 className="text-lg font-bold text-gray-800">Data Peternakan</h2>
          <p className="text-sm text-gray-500">Kelola data usaha peternakan dan komoditas hewani.</p>
        </div>
        
        <button 
          onClick={handleGoToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Plus size={18} />
          Tambah Peternakan
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        
        {/* Entries per page */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tampilkan</span>
          <select 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-1.5"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>data</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearch}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 pl-10 p-2" 
            placeholder="Cari Nama, Hewan, Komoditas..." 
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold w-16 border-r border-gray-200">No</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Nama Peternakan</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Hewan Ternak</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Komoditas</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Alamat</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Pemilik</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Telepon/WA</th>
              <th scope="col" className="px-6 py-4 font-semibold w-48 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.hewan}
                  </td>
                  <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">
                    {item.komoditas}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-xs" title={item.alamat}>
                    {item.alamat}
                  </td>
                  <td className="px-6 py-4 text-gray-800 border-r border-gray-200">
                    {item.pemilik}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.telepon}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Tombol Detail */}
                      <button 
                        onClick={() => handleGoToDetail(item)}
                        title="Lihat Detail"
                        className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 hover:text-orange-800 transition"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Tombol Ubah */}
                      <button 
                        title="Ubah Data"
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Tombol Hapus */}
                      <button 
                        title="Hapus Data"
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Data peternakan tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginasi */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold text-gray-900">{currentItems.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredData.length)}</span> dari <span className="font-semibold text-gray-900">{filteredData.length}</span> data
        </span>

        <div className="inline-flex -space-x-px text-sm">
           <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-bold cursor-default">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 2. TAMPILAN TAMBAH (CREATE VIEW - MODERN)
  // =========================================
  const renderCreateView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header Form */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-white hover:shadow-sm rounded-full transition border border-transparent hover:border-gray-200 text-gray-600">
             <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Tambah Data Peternakan</h2>
      </div>

      {/* Form Input */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Peternakan <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                   <FileText size={18} />
                 </div>
                 <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nama Peternakan" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400">
                   <MapPin size={18} />
                 </div>
                 <textarea rows="4" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium resize-none" placeholder="Alamat Lengkap"></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Pemilik <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                   <User size={18} />
                 </div>
                 <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nama Pemilik" />
              </div>
            </div>

             <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Telepon / WA <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                   <Phone size={18} />
                 </div>
                 <input type="tel" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="08xxxxxxxx" />
              </div>
            </div>

             <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Hewan Ternak <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Contoh: Sapi, Ayam" />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Komoditas <span className="text-red-500">*</span></label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Box size={18} /></div>
                <select className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium appearance-none">
                    <option value="">- Pilih Komoditas -</option>
                    <option value="Telur">Telur</option>
                    <option value="Sarang Burung Walet">Sarang Burung Walet</option>
                    <option value="Ayam">Ayam</option>
                    <option value="Daging Sapi">Daging Sapi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Unggah Foto Peternakan */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Unggah Foto Peternakan</label>
              <input type="file" ref={photoInputRef} onChange={handleFileChange(setPhotoFile, setPhotoPreview)} accept="image/*" className="hidden" />
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

            {/* Unggah Foto Pemilik */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Unggah Foto Pemilik</label>
              <input type="file" ref={ownerPhotoInputRef} onChange={handleFileChange(setOwnerPhotoFile, setOwnerPhotoPreview)} accept="image/*" className="hidden" />
              {!ownerPhotoPreview ? (
                <div onClick={() => ownerPhotoInputRef.current.click()} className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300">
                  <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300"><User size={24} className="text-gray-400 group-hover:text-green-600" /></div>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-green-700 text-center">Upload Foto</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img src={ownerPhotoPreview} alt="Preview" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => {setOwnerPhotoPreview(null); setOwnerPhotoFile(null);}} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Unggah Sertifikat Veteriner */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Unggah Sertifikat Veteriner (PDF)</label>
              <input type="file" ref={certInputRef} onChange={handleFileChange(setCertFile)} accept=".pdf" className="hidden" />
              <div onClick={() => certInputRef.current.click()} className={`group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${certFile ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}>
                <div className={`p-3 rounded-full mb-2 transition-all duration-300 ${certFile ? 'bg-green-100' : 'bg-gray-50 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md'}`}>
                  {certFile ? <FileText size={24} className="text-green-600" /> : <CloudUpload size={24} className="text-gray-400 group-hover:text-green-600" />}
                </div>
                <p className={`text-xs font-semibold text-center ${certFile ? 'text-green-700' : 'text-gray-500 group-hover:text-green-700'}`}>{certFile ? certFile.name : "Upload Sertifikat"}</p>
              </div>
            </div>

            {/* Tombol Simpan & Batal */}
            <div className="flex justify-end pt-4 gap-3">
               <button onClick={handleBack} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"><X size={18} /> Batal</button>
               <button onClick={handleBack} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"><Save size={18} /> Simpan</button>
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
      
      {/* Header Detil */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Detail Peternakan</h2>
          <p className="text-sm text-gray-500">Informasi lengkap profil dan komoditas peternakan.</p>
        </div>
      </div>

      {/* Konten Detil */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* KOLOM KIRI: KARTU PROFIL */}
           <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
                 
                 <div className="w-full aspect-[4/3] mb-6 relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                       <ImageIcon size={64} strokeWidth={1.5} />
                       <span className="text-xs mt-2 font-medium">Foto Peternakan</span>
                    </div>
                 </div>

                 <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedItem?.nama || "-"}</h3>
                    <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                       <MapPin size={14} /> {selectedItem?.alamat ? selectedItem.alamat.split(',')[1] : "Lokasi"}
                    </p>
                 </div>

                 <div className="w-full space-y-3 mt-auto">
                    <button className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"><Pencil size={16} /> Ubah Data</button>
                    <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"><Trash2 size={16} /> Hapus Data</button>
                 </div>
              </div>
           </div>

           {/* KOLOM KANAN: INFORMASI DETAIL */}
           <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Informasi Pemilik</h4>
                 <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-400 flex-shrink-0"><User size={32} /></div>
                    <div className="space-y-1">
                       <p className="text-lg font-bold text-gray-900">{selectedItem?.pemilik || "-"}</p>
                       <div className="flex items-center gap-2 text-gray-600 text-sm"><Phone size={14} /><span className="font-mono font-medium">{selectedItem?.telepon || "-"}</span></div>
                       <p className="text-xs text-gray-400 mt-1">Pemilik Terverifikasi</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Detail Usaha</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><FileText size={14} /> Nama Peternakan</label><p className="text-base font-semibold text-gray-900">{selectedItem?.nama || "-"}</p></div>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Box size={14} /> Hewan Ternak</label><p className="text-base font-semibold text-gray-900">{selectedItem?.hewan || "-"}</p></div>
                    <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Box size={14} /> Komoditas</label><div className="flex flex-wrap gap-2 mt-1">{selectedItem?.komoditas ? selectedItem.komoditas.split(',').map((k, i) => <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">{k.trim()}</span>) : "-"}</div></div>
                    <div className="space-y-1 md:col-span-2"><label className="text-xs font-medium text-gray-500 flex items-center gap-1"><MapPin size={14} /> Alamat Lengkap</label><p className="text-base font-semibold text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedItem?.alamat || "-"}</p></div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Dokumen Pendukung</h4>
                 <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md hover:bg-green-50/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                       <div><p className="text-sm font-bold text-gray-900 mb-0.5">Sertifikat Veteriner</p><p className="text-xs text-gray-500 group-hover:text-green-700 transition-colors">PDF • Dokumen Resmi</p></div>
                    </div>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition-colors" title="Download"><Download size={20} /></button>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Data Peternakan" : view === 'create' ? "Tambah Peternakan" : "Detil Peternakan"}>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateView()}
      {view === 'detail' && renderDetailView()}
    </MainLayout>
  );
}