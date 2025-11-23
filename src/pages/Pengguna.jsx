import React, { useState } from 'react';
import MainLayout from "../layouts/MainLayout";
// 1. Import Data Seed
import { seedPengguna } from "../data/seedPengguna";

import { 
  Plus, Search, Pencil, Trash2, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowLeft, User, Lock, Building2, Phone, MapPin, Shield, Save, X
} from 'lucide-react';

export default function Pengguna() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); // 'list' | 'create'

  // --- DATA DUMMY (Dari Seed) ---
  const [dataPengguna] = useState(seedPengguna);

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataPengguna.filter((item) =>
    item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instansi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS ---
  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleItemsPerPageChange = (e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); };

  const handleGoToCreate = () => { setView('create'); };
  const handleBack = () => { setView('list'); };

  // =========================================
  // 1. TAMPILAN DAFTAR (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header Card */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data Pengguna</h2>
          <p className="text-sm text-gray-500">Kelola akun pengguna dan hak akses aplikasi.</p>
        </div>
        
        <button 
          onClick={handleGoToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Plus size={18} />
          Tambah Pengguna
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
            placeholder="Cari Nama, Username, Instansi..." 
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          
          {/* HEADER TABEL (GRAY STYLE) */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold w-12 border-r border-gray-200">No</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Nama Lengkap</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Nama Pengguna</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Alamat</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Telepon/WA</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Instansi</th>
              <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Hak Akses</th>
              <th scope="col" className="px-6 py-4 font-semibold w-32 text-center">Aksi</th>
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
                    {item.namaLengkap}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-xs" title={item.alamat}>
                    {item.alamat}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.telepon}
                  </td>
                  <td className="px-6 py-4 text-gray-800 border-r border-gray-200">
                    {item.instansi}
                  </td>
                  <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100 block w-fit">
                      {item.hakAkses}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
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
                  Data pengguna tidak ditemukan.
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
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Data Pengguna</h2>
          <p className="text-sm text-gray-500">Lengkapi form di bawah untuk menambahkan pengguna baru.</p>
        </div>
      </div>

      {/* Form Input */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* --- Kolom Kiri --- */}
          <div className="space-y-6">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><User size={18} /></div>
                  <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Masukkan Nama Lengkap"/>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Alamat</label>
              <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400"><MapPin size={18} /></div>
                  <textarea rows="3" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium resize-none" placeholder="Masukkan Alamat Lengkap"></textarea>
              </div>
            </div>

            {/* Telepon / WA */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Telepon / WA</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Phone size={18} /></div>
                  <input type="tel" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="08xxxxxxxx"/>
              </div>
            </div>

            {/* Nama Pengguna */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Pengguna</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><User size={18} /></div>
                  <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Masukkan Username"/>
              </div>
            </div>

            {/* Kata Sandi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Kata Sandi</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Lock size={18} /></div>
                  <input type="password" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Masukkan Password"/>
              </div>
            </div>

          </div>

          {/* --- Kolom Kanan --- */}
          <div className="space-y-6 flex flex-col">
            
            {/* Instansi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Instansi</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Building2 size={18} /></div>
                  <input type="text" className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium" placeholder="Nama Instansi"/>
              </div>
            </div>

            {/* Hak Akses Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Hak Akses</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400"><Shield size={18} /></div>
                <select className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition font-medium appearance-none">
                    <option value="">- Pilih Hak Akses -</option>
                    <option value="Ekspor">Ekspor</option>
                    <option value="Ekspor (COO)">Ekspor (COO)</option>
                    <option value="Ekspor (Sertifikat Kesehatan)">Ekspor (Sertifikat Kesehatan)</option>
                    <option value="Eksportir">Eksportir</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Pengepul">Pengepul</option>
                    <option value="Petani">Petani</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Peternakan">Peternakan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Tombol Simpan & Batal (Posisi di bawah) */}
            <div className="flex justify-end pt-4 mt-auto gap-3">
               <button 
                 onClick={handleBack}
                 className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
               >
                 <X size={18} />
                 Batal
               </button>
               <button 
                 onClick={handleBack}
                 className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
               >
                 <Save size={18} />
                 Simpan
               </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Data Pengguna" : "Tambah Pengguna"}>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateView()}
    </MainLayout>
  );
}