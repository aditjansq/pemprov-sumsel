import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Komoditas() {
  // --- DATA DUMMY ---
  const dataKomoditas = [
    { id: 1, nama: "Kopi", keterangan: "Biji kopi Robusta kualitas ekspor (Grade A)" },
    { id: 2, nama: "Paha Kodok", keterangan: "Frozen, kemasan 1kg, siap olah" },
    { id: 3, nama: "Santan", keterangan: "Santan kelapa murni tanpa pengawet" },
    { id: 4, nama: "Kopi Bubuk", keterangan: "Gilingan halus, aroma kuat, pack 500gr" },
    { id: 5, nama: "Kerupuk", keterangan: "Kerupuk ikan tenggiri asli Palembang" },
    { id: 6, nama: "Pempek", keterangan: "Paket campur (Lenjer, Kapal Selam, Adaan)" },
    { id: 7, nama: "Model", keterangan: "Model ikan gabus, kuah terpisah" },
    { id: 8, nama: "Tekwan", keterangan: "Satu set lengkap dengan jamur dan sedap malam" },
    { id: 9, nama: "Laksan", keterangan: "Kuah santan pedas kemerahan" },
    { id: 10, nama: "Celimpungan", keterangan: "Kuah kari kuning kental" },
    { id: 11, nama: "Burgo", keterangan: "Dibuat dari tepung beras, kuah santan putih" },
  ];

  // --- STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // 1. State untuk Search

  // --- LOGIC SEARCHING & FILTERING ---
  // 2. Filter data sebelum paginasi
  const filteredData = dataKomoditas.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI (Menggunakan filteredData) ---
  // 3. Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 4. Slicing Data dari hasil filter
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle ganti jumlah entries
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle Search Input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 jika sedang mencari
  };

  return (
    <MainLayout title="Data Komoditas">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* HEADER CARD */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Data Komoditas</h2>
            <p className="text-sm text-gray-500">
              Kelola daftar komoditas unggulan di sini.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
            <Plus size={18} /> Tambah Komoditas
          </button>
        </div>

        {/* FILTER & PENCARIAN */}
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

          {/* INPUT PENCARIAN */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm} // Bind value ke state
              onChange={handleSearch} // Panggil fungsi handleSearch
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-96 pl-10 p-2"
              placeholder="Cari Komoditas..."
            />
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            {/* HEADER TABEL */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold w-16 border-r border-gray-200">No</th>
                <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Komoditas</th>
                <th scope="col" className="px-6 py-4 font-semibold border-r border-gray-200">Keterangan</th>
                <th scope="col" className="px-6 py-4 font-semibold w-32 text-center">Aksi</th>
              </tr>
            </thead>

            {/* BODY TABEL */}
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
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                /* TAMPILAN JIKA TIDAK ADA HASIL SEARCH */
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINASI */}
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
    </MainLayout>
  );
}