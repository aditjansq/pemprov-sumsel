import React, { useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
// 1. Import Data Seed
import { seedGudang } from "../data/seedGudang";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Upload,
  Save,
  X,
  Building2,
  MapPin,
  Phone,
  User,
  Box,
  ImageIcon,
} from "lucide-react";

export default function Gudang() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY (Diambil dari file eksternal) ---
  const [dataGudang] = useState(seedGudang);

  // --- STATE FORM CREATE (Upload Preview) ---
  const [warehousePhoto, setWarehousePhoto] = useState(null);
  const [warehousePreview, setWarehousePreview] = useState(null);
  const warehouseInputRef = useRef(null);

  const [ownerPhoto, setOwnerPhoto] = useState(null);
  const [ownerPreview, setOwnerPreview] = useState(null);
  const ownerInputRef = useRef(null);

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataGudang.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleGoToCreate = () => {
    setSelectedItem(null);
    setWarehousePhoto(null);
    setWarehousePreview(null);
    setOwnerPhoto(null);
    setOwnerPreview(null);
    setView("create");
  };

  const handleGoToDetail = (item) => {
    setSelectedItem(item);
    setView("detail");
  };
  const handleBack = () => {
    setSelectedItem(null);
    setView("list");
  };

  // Handler Upload Foto Gudang
  const handleWarehousePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWarehousePhoto(file);
      setWarehousePreview(URL.createObjectURL(file));
    }
  };

  // Handler Upload Foto Pemilik
  const handleOwnerPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOwnerPhoto(file);
      setOwnerPreview(URL.createObjectURL(file));
    }
  };

  // =========================================
  // 1. TAMPILAN DAFTAR GUDANG (LIST VIEW)
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data Gudang</h2>
          <p className="text-sm text-gray-500">
            Kelola data gudang penyimpanan komoditas.
          </p>
        </div>
        <button
          onClick={handleGoToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Gudang
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Tampilkan</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
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
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 pl-10 p-2"
            placeholder="Cari Nama, Pemilik, Komoditas..."
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-12 border-r border-gray-200">
                No
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Nama
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Komoditas
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Alamat
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Pemilik
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Telepon/WA
              </th>
              <th className="px-6 py-4 font-semibold w-40 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-medium border-r border-gray-200">
                    {item.komoditas}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-xs"
                    title={item.alamat}
                  >
                    {item.alamat}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.pemilik}
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.telepon}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleGoToDetail(item)}
                        title="Lihat Detail"
                        className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 hover:text-orange-800 transition"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Ubah Data"
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"
                      >
                        <Pencil size={18} />
                      </button>
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
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Data gudang tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Showing {currentItems.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
          {Math.min(indexOfLastItem, filteredData.length)} of{" "}
          {filteredData.length}
        </span>
        <div className="inline-flex -space-x-px text-sm">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 font-bold">
            {currentPage}
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 2. TAMPILAN TAMBAH GUDANG (MODERN UI)
  // =========================================
  const renderCreateView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Modern */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Tambah Data Gudang
          </h2>
          <p className="text-sm text-gray-500">
            Lengkapi form di bawah untuk mendaftarkan gudang baru.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI (Inputs) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nama Gudang */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Gudang <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Building2 size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium"
                  placeholder="Contoh: Gudang Sriwijaya"
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-4 pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <textarea
                  rows="3"
                  className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium resize-none"
                  placeholder="Masukkan Alamat Lengkap"
                ></textarea>
              </div>
            </div>

            {/* Pemilik */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Pemilik <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium"
                  placeholder="Masukkan Nama Pemilik"
                />
              </div>
            </div>

            {/* Telepon */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Telepon / WA <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium"
                  placeholder="08xxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Select & Uploads) */}
          <div className="space-y-6">
            {/* Komoditas */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Komoditas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Box size={18} />
                </div>
                <select className="w-full pl-11 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium appearance-none">
                  <option>- Pilih Komoditas -</option>
                  <option>Kopi</option>
                  <option>Paha Kodok</option>
                  <option>Santan</option>
                  <option>Kopi Bubuk</option>
                  <option>Pempek</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Upload Foto Gudang */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Foto Gudang
              </label>
              <input
                type="file"
                ref={warehouseInputRef}
                onChange={handleWarehousePhotoChange}
                accept="image/*"
                className="hidden"
              />

              {!warehousePreview ? (
                <div
                  onClick={() => warehouseInputRef.current.click()}
                  className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300"
                >
                  <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                    <ImageIcon
                      size={24}
                      className="text-gray-400 group-hover:text-green-600"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-green-700 text-center">
                    Upload Foto
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img
                    src={warehousePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        setWarehousePreview(null);
                        setWarehousePhoto(null);
                      }}
                      className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Foto Pemilik */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Foto Pemilik
              </label>
              <input
                type="file"
                ref={ownerInputRef}
                onChange={handleOwnerPhotoChange}
                accept="image/*"
                className="hidden"
              />

              {!ownerPreview ? (
                <div
                  onClick={() => ownerInputRef.current.click()}
                  className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300"
                >
                  <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                    <User
                      size={24}
                      className="text-gray-400 group-hover:text-green-600"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 group-hover:text-green-700 text-center">
                    Upload Foto
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img
                    src={ownerPreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        setOwnerPreview(null);
                        setOwnerPhoto(null);
                      }}
                      className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Aksi
              </label>
              <button
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all duration-200"
              >
                <Save size={20} /> Simpan Data
              </button>
              <button
                onClick={handleBack}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-200"
              >
                <X size={20} /> Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 3. TAMPILAN DETIL GUDANG (MODERN UI)
  // =========================================
  const renderDetailView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* --- Header Modern --- */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Detail Gudang
          </h2>
          <p className="text-sm text-gray-500">
            Informasi lengkap lokasi, pemilik, dan komoditas gudang.
          </p>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI: FOTO UTAMA & AKSI */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
              {/* Foto Gudang Besar */}
              <div className="w-full aspect-square mb-6 relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group">
                {/* Placeholder jika tidak ada gambar */}
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={64} strokeWidth={1.5} />
                  <span className="text-xs mt-2 font-medium">Foto Gudang</span>
                </div>

                {/* Badge Status (Opsional) */}
                <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Aktif
                </div>
              </div>

              {/* Nama Gudang Utama */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedItem?.nama || "-"}
                </h3>
                <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                  <MapPin size={14} />{" "}
                  {selectedItem?.alamat
                    ? selectedItem.alamat.split(",")[1]
                    : "Lokasi"}
                </p>
              </div>

              {/* Tombol Aksi Cepat */}
              <div className="w-full space-y-3 mt-auto">
                <button className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <Pencil size={16} /> Ubah Data
                </button>
                <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Hapus Gudang
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: DETAIL INFORMASI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card: Informasi Pemilik */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">
                Informasi Pemilik
              </h4>
              <div className="flex items-start gap-5">
                {/* Avatar Pemilik */}
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-gray-400 flex-shrink-0">
                  <User size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedItem?.pemilik || "-"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone size={14} />
                    <span className="font-mono font-medium">
                      {selectedItem?.telepon || "-"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Pemilik Terverifikasi
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Detail Operasional */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 border-b border-gray-100 pb-3">
                Detail Operasional
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Data */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Building2 size={14} /> Nama Gudang
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedItem?.nama || "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Box size={14} /> Komoditas Utama
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedItem?.komoditas ? (
                      selectedItem.komoditas.split(",").map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800"
                        >
                          {item.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-900">-</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> Alamat Lengkap
                  </label>
                  <p className="text-base font-semibold text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {selectedItem?.alamat || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout
      title={
        view === "list"
          ? "Data Gudang"
          : view === "create"
          ? "Tambah Gudang"
          : "Detil Gudang"
      }
    >
      {view === "list" && renderListView()}
      {view === "create" && renderCreateView()}
      {view === "detail" && renderDetailView()}
    </MainLayout>
  );
}
