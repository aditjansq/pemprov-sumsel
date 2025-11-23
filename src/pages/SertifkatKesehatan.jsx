import React, { useState, useRef } from 'react';
import MainLayout from "../layouts/MainLayout";
import QRCode from "react-qr-code";
// Import Data Seed
import { seedSertifikatKesehatan } from "../data/seedSertifikatKesehatan";

import { 
  Search, Eye, ArrowLeft, 
  CheckSquare, Square, AlertCircle, 
  Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  FileText, CloudUpload, Save, X, Download
} from 'lucide-react';

export default function SertifikatKesehatan() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState('list'); // 'list' | 'upload'
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Dari Seed) ---
  const [dataHealth, setDataHealth] = useState(seedSertifikatKesehatan);

  // --- STATE UPLOAD ---
  const [healthFile, setHealthFile] = useState(null);
  const healthInputRef = useRef(null);

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataHealth.filter((item) =>
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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleGoToUpload = (item) => {
    setSelectedItem(item);
    setHealthFile(null);
    setView('upload');
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView('list');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHealthFile(file);
    }
  };

  // Fungsi Toggle Status (Simulasi update data)
  const handleToggleStatus = (id, field) => {
      const updatedData = dataHealth.map(item => {
          if(item.id === id) {
              return { ...item, [field]: !item[field] };
          }
          return item;
      });
      setDataHealth(updatedData);
  };

  // =========================================
  // 1. TAMPILAN DAFTAR (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Banner Peringatan */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 m-6 mb-2 flex items-center gap-3 rounded-r-lg">
         <AlertCircle size={20} className="text-orange-600" />
         <p className="text-sm font-bold text-gray-800">
           Terdapat {dataHealth.filter(item => !item.healthCertCompleted).length} Proses Ekspor yang Belum Mendapatkan Sertifikat Kesehatan
         </p>
      </div>

      {/* Filter & Search */}
      <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          </select>
          <span>data</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearch}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 pl-10 p-2" 
            placeholder="Cari Eksportir, Komoditas..." 
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-t border-gray-200">
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
              <th className="px-6 py-4 font-semibold w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.tanggal}</td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{item.eksportir}</td>
                  <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">{item.komoditas}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.negara}</td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.kontainer}</td>
                  
                  {/* Kolom COO */}
                  <td className="px-6 py-4 border-r border-gray-200 text-center">
                     <button onClick={() => handleToggleStatus(item.id, 'cooCompleted')} title={item.cooCompleted ? "Sudah Selesai" : "Belum Selesai"}>
                        {item.cooCompleted ? 
                            <CheckSquare size={20} className="text-green-600 inline hover:scale-110 transition-transform" /> : 
                            <Square size={20} className="text-gray-300 inline hover:text-gray-500 transition-colors" />
                        }
                     </button>
                  </td>

                  {/* Kolom Sertifikat Kesehatan */}
                  <td className="px-6 py-4 border-r border-gray-200 text-center">
                    {item.healthCertCompleted ? (
                      <button onClick={() => handleToggleStatus(item.id, 'healthCertCompleted')} title="Sudah Selesai">
                         <CheckSquare size={20} className="text-green-600 inline hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleGoToUpload(item)} 
                        className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <Upload size={14} /> Unggah
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                     <button className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1.5 rounded-lg transition" title="Lihat Detail">
                        <Eye size={18} />
                     </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginasi */}
      <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{currentItems.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span> entries
        </span>
        <div className="inline-flex -space-x-px text-sm">
           <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronsLeft size={16}/></button>
           <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
           <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-bold cursor-default">{currentPage}</button>
           <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
           <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronsRight size={16}/></button>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 2. TAMPILAN UPLOAD (TAMBAH SERTIFIKAT KESEHATAN - MODERN UI)
  // =========================================
  const renderUploadView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Header Upload */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Sertifikat Kesehatan</h2>
          <p className="text-sm text-gray-500">Lengkapi dokumen Health Certificate untuk proses ekspor ini.</p>
        </div>
      </div>

      {/* Konten Upload */}
      <div className="p-8 bg-gray-50/30">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: QR Code */}
            <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center h-full">
                  <div className="w-full aspect-square bg-white border-4 border-gray-900 p-4 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                     <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`ID: ${selectedItem?.id}, Eksportir: ${selectedItem?.eksportir}, Komoditas: ${selectedItem?.komoditas}`}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">ID TRANSAKSI: {selectedItem?.id} / {selectedItem?.tanggal}</p>
               </div>
            </div>

            {/* Kolom Kanan: Data & Input Upload */}
            <div className="lg:col-span-2 space-y-6">
               
               {/* Card: Data Pengiriman */}
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Detail Pengiriman</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Tanggal Ekspor</label><p className="text-base font-semibold text-gray-900">{selectedItem?.tanggal}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Eksportir</label><p className="text-base font-bold text-green-700">{selectedItem?.eksportir}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Komoditas</label><span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">{selectedItem?.komoditas}</span></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Gudang Asal</label><p className="text-base font-semibold text-gray-900">{selectedItem?.gudang}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Negara Tujuan</label><p className="text-base font-semibold text-gray-900">{selectedItem?.negara}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Pengepul</label><p className="text-base font-semibold text-gray-900">{selectedItem?.pengepul}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">No. Kontainer</label><p className="text-base font-mono font-semibold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-200 inline-block">{selectedItem?.kontainer}</p></div>
                     <div className="space-y-1"><label className="text-xs font-medium text-gray-500 uppercase">Petani</label><p className="text-base font-semibold text-gray-900">{selectedItem?.petani}</p></div>
                  </div>
               </div>

               {/* Card: Upload Dokumen */}
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">Unggah Dokumen</h4>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Sertifikat Kesehatan (Health Cert)</label>
                        <input type="file" ref={healthInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                        
                        <div 
                           onClick={() => healthInputRef.current.click()} 
                           className={`group border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${healthFile ? 'border-green-500 bg-green-50/20' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/30'}`}
                        >
                           <div className={`p-3 rounded-full mb-2 transition-all duration-300 ${healthFile ? 'bg-green-100' : 'bg-gray-50 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md'}`}>
                              {healthFile ? <FileText size={24} className="text-green-600" /> : <CloudUpload size={24} className="text-gray-400 group-hover:text-green-600" />}
                           </div>
                           <p className={`text-xs font-semibold text-center ${healthFile ? 'text-green-700' : 'text-gray-500 group-hover:text-green-700'}`}>
                              {healthFile ? healthFile.name : "Klik untuk Unggah Sertifikat (.pdf)"}
                           </p>
                        </div>
                     </div>

                     <div className="flex justify-end gap-3 pt-2">
                        <button 
                           onClick={handleBack} 
                           className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200"
                        >
                           <X size={18} /> Batal
                        </button>
                        <button 
                           onClick={() => {
                               // Simulasi Simpan: Update status di list data
                               handleToggleStatus(selectedItem.id, 'healthCertCompleted');
                               handleBack();
                           }} 
                           className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all duration-200"
                        >
                           <Save size={18} /> Simpan
                        </button>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={view === 'list' ? "Sertifikat Kesehatan" : "Tambah Sertifikat Kesehatan"}>
      {view === 'list' && renderListView()}
      {view === 'upload' && renderUploadView()}
    </MainLayout>
  );
}