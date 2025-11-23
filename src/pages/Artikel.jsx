import React, { useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { seedArtikel } from "../data/seedArtikel";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  CloudUpload,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Save,
  X,
} from "lucide-react";

export default function Artikel() {
  // --- STATE GLOBAL ---
  const [view, setView] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  // --- DATA DUMMY ---
  const [dataArtikel] = useState(seedArtikel);

  // --- STATE UNTUK FORM CREATE ---
  const [inputJudul, setInputJudul] = useState("");
  const [inputTanggal, setInputTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );

  // State Gambar
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State Editor (FIX PLACEHOLDER)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true); // Default kosong

  // Refs
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- STATE SEARCH & PAGINASI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- LOGIC FILTERING ---
  const filteredData = dataArtikel.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tanggal.includes(searchTerm)
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
    // Reset Form
    setSelectedItem(null);
    setInputJudul("");
    setInputTanggal(new Date().toISOString().split("T")[0]);
    setSelectedFile(null);
    setPreviewUrl(null);

    // Reset Editor
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setIsEditorEmpty(true); // Set status editor jadi kosong

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

  // --- HANDLER UPLOAD GAMBAR ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // --- HANDLER EDITOR ---
  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  // Fungsi Deteksi Input Editor (Untuk Hide/Show Placeholder)
  const handleEditorInput = (e) => {
    // Cek apakah ada teks di dalam editor
    const content = e.currentTarget.textContent;
    if (content.trim().length > 0) {
      setIsEditorEmpty(false);
    } else {
      // Jika kosong tapi mungkin masih ada tag HTML sisa (misal <br>), cek innerText
      if (e.currentTarget.innerText.trim() === "") {
        setIsEditorEmpty(true);
      }
    }
  };

  // --- HANDLER SIMPAN ---
  const handleSimpan = () => {
    const kontenHTML = editorRef.current.innerHTML;

    const formData = {
      judul: inputJudul,
      tanggal: inputTanggal,
      konten: isEditorEmpty ? "" : kontenHTML,
      gambar: selectedFile ? selectedFile.name : "Tidak ada gambar",
    };

    console.log("DATA DISIMPAN:", formData);
    alert(`Artikel "${inputJudul}" berhasil dipublikasikan!`);
    handleBack();
  };

  // =========================================
  // 1. TAMPILAN DAFTAR ARTIKEL
  // =========================================
  const renderListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Data Artikel</h2>
          <p className="text-sm text-gray-500">
            Kelola berita dan artikel seputar komoditas.
          </p>
        </div>
        <button
          onClick={handleGoToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Plus size={18} /> Tambah Artikel
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
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-96 pl-10 p-2"
            placeholder="Cari Judul Artikel..."
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-16 border-r border-gray-200">
                No
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200">
                Judul
              </th>
              <th className="px-6 py-4 font-semibold border-r border-gray-200 w-40">
                Tanggal
              </th>
              <th className="px-6 py-4 font-semibold w-32 text-center">Aksi</th>
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
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                      <span className="truncate max-w-xs">{item.judul}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                    {item.tanggal}
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
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          Menampilkan{" "}
          <span className="font-semibold text-gray-900">
            {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}
          </span>{" "}
          sampai{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(indexOfLastItem, filteredData.length)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-900">
            {filteredData.length}
          </span>{" "}
          data
        </span>

        <div className="inline-flex -space-x-px text-sm">
          {/* 1. Tombol SKIP KE AWAL (First Page) */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* 2. Tombol SEBELUMNYA (Previous) */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {/* 3. Indikator HALAMAN SAAT INI */}
          <button className="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-gray-300 bg-blue-50 font-bold cursor-default">
            {currentPage}
          </button>

          {/* 4. Tombol SELANJUTNYA (Next) */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>

          {/* 5. Tombol SKIP KE AKHIR (Last Page) */}
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
  // 2. TAMPILAN TAMBAH ARTIKEL (FIXED EDITOR)
  // =========================================
  const renderCreateView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
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
              Buat Artikel Baru
            </h2>
            <p className="text-sm text-gray-500">
              Isi detail artikel di bawah ini untuk mempublikasikan berita.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:border-green-500 transition-colors group">
          <Calendar
            size={18}
            className="text-gray-400 group-hover:text-green-600 transition-colors"
          />
          <input
            type="date"
            value={inputTanggal}
            onChange={(e) => setInputTanggal(e.target.value)}
            className="text-sm font-semibold text-gray-700 bg-transparent outline-none border-none cursor-pointer font-sans"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 bg-gray-50/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={inputJudul}
                onChange={(e) => setInputJudul(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 font-medium"
                placeholder="Contoh: Harga Kopi Robusta Melonjak Naik..."
              />
            </div>

            {/* Editor Modern Fix */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              <div className="bg-white border border-gray-300 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-500 transition-all duration-200 shadow-sm flex flex-col h-[460px]">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap z-10">
                  <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("bold");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("italic");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("underline");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                      title="Underline"
                    >
                      <Underline size={16} />
                    </button>
                  </div>
                  <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm ml-2">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("justifyLeft");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("justifyCenter");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("justifyRight");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm ml-2">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("insertUnorderedList");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                    >
                      <List size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("insertOrderedList");
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition"
                    >
                      <ListOrdered size={16} />
                    </button>
                  </div>
                </div>

                {/* Area Editor (Relative) */}
                <div
                  className="relative flex-1 overflow-hidden cursor-text"
                  onClick={() => editorRef.current.focus()}
                >
                  {/* Placeholder Overlay (Absolute) */}
                  {isEditorEmpty && (
                    <div className="absolute top-6 left-6 text-gray-400 italic pointer-events-none select-none">
                      Mulai tulis isi artikel anda di sini...
                    </div>
                  )}

                  {/* Content Editable (Transparent Background) */}
                  <div
                    ref={editorRef}
                    contentEditable={true}
                    onInput={handleEditorInput} // Deteksi saat mengetik
                    className="absolute inset-0 w-full h-full p-6 outline-none text-base text-gray-800 overflow-y-auto prose max-w-none z-10"
                    style={{ lineHeight: "1.75" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Foto Utama
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!previewUrl ? (
                <div
                  onClick={triggerFileUpload}
                  className="group border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300"
                >
                  <div className="p-4 bg-gray-50 rounded-full mb-3 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                    <CloudUpload
                      size={32}
                      className="text-gray-400 group-hover:text-green-600"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700 text-center">
                    Klik untuk upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    SVG, PNG, JPG (max. 2MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs font-medium p-2 rounded-lg truncate shadow-sm">
                    {selectedFile?.name}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Aksi
              </label>
              <button
                onClick={handleSimpan}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all duration-200"
              >
                <Save size={20} /> Publikasikan
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
  // 3. TAMPILAN DETIL
  // =========================================
  const renderDetailView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-200 rounded-full transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Detil Artikel</h2>
      </div>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {selectedItem?.judul}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {selectedItem?.tanggal}
          </p>
        </div>
        <div className="w-full h-64 md:h-96 border border-gray-300 relative mb-6 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          {selectedItem?.image ? (
            <img
              src={selectedItem.image}
              alt={selectedItem.judul}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon size={40} />
              <span className="text-sm mt-2">Gambar tidak tersedia</span>
            </div>
          )}
        </div>
        <div className="space-y-4 text-justify text-gray-700 leading-relaxed">
          <p>{selectedItem?.konten}</p>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout
      title={
        view === "list"
          ? "Data Artikel"
          : view === "create"
          ? "Tambah Artikel"
          : "Detil Artikel"
      }
    >
      {view === "list" && renderListView()}
      {view === "create" && renderCreateView()}
      {view === "detail" && renderDetailView()}
    </MainLayout>
  );
}
