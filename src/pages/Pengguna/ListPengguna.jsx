import React, { useState, useEffect } from 'react';
import MainLayout from "../../layouts/MainLayout"; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, Search, Pencil, Trash2, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { toast } from 'react-toastify';

// Modal Headless UI
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ListPengguna() {
  const navigate = useNavigate();

  // --- DATA & STATE ---
  const [dataPengguna, setDataPengguna] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL HAPUS ---
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // --- 1. AMBIL DATA DARI BACKEND SAAT LOAD ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pengguna');
      setDataPengguna(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setLoading(false);
    }
  };

  // --- LOGIC FILTERING ---
  const filteredData = dataPengguna.filter((item) =>
    (item.nama_lengkap?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.nama_pengguna?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.instansi?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PAGINASI ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
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

  // BUKA MODAL HAPUS
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  // KONFIRMASI HAPUS (CALL API DELETE)
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      setDeleting(true);
      setLoading(true);

      const response = await axios.delete(`http://localhost:5000/api/pengguna/${selectedUser.id}`);

      toast.success(response.data.message || `Pengguna ID ${selectedUser.id} berhasil dihapus.`, { autoClose: 3000 });
      
      setOpenDeleteModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna.", { autoClose: 5000 });
      setLoading(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (deleting) return; // jangan bisa ditutup saat proses hapus
    setOpenDeleteModal(false);
    setSelectedUser(null);
  };

  // --- RENDER ---
  return (
    <MainLayout title="Data Pengguna">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Card */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Data Pengguna</h2>
            <p className="text-sm text-gray-500">Kelola akun pengguna dan hak akses aplikasi.</p>
          </div>
          
          <button 
            onClick={() => navigate('/pengguna/tambah')} 
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
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold w-[50px] border-r border-gray-200">No</th>
                <th className="px-6 py-4 font-semibold border-r border-gray-200">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold border-r border-gray-200">Instansi</th>
                <th className="px-6 py-4 font-semibold border-r border-gray-200">Hak Akses</th>
                <th className="px-6 py-4 font-semibold w-[150px] border-r border-gray-200">Nama Pengguna</th>
                <th className="px-6 py-4 font-semibold w-[150px] border-r border-gray-200">Telepon/WA</th>
                <th className="px-6 py-4 font-semibold w-[200px] border-r border-gray-200">Email</th>
                <th className="px-6 py-4 font-semibold border-r border-gray-200">Alamat</th>
                <th className="px-6 py-4 font-semibold w-[100px] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center">Memuat data...</td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{item.nama_lengkap}</td>
                    <td className="px-6 py-4 text-gray-800 border-r border-gray-200">{item.instansi || '-'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium border-r border-gray-200">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100 block w-fit capitalize">
                        {item.hak_akses || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-[150px]">
                      {item.nama_pengguna}
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-[120px]">
                      {item.telepon_wa || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-r border-gray-200 truncate max-w-[200px]">
                      {item.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 border-r border-gray-200">
                      {item.alamat || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/pengguna/edit/${item.id}`)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteDialog(item)} 
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
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
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1} 
              className="flex items-center justify-center px-3 h-8 ms-0 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 font-bold">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages} 
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS - HEADLESS UI */}
      <Dialog open={openDeleteModal} onClose={handleCloseModal} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Hapus Pengguna
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah kamu yakin ingin menghapus pengguna{" "}
                        <span className="font-semibold text-gray-800">
                          {selectedUser?.nama_lengkap || `dengan ID ${selectedUser?.id}`}
                        </span>
                        ? Semua data terkait pengguna ini akan dihapus dan tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 disabled:opacity-60 sm:ml-3 sm:w-auto"
                >
                  {deleting ? "Menghapus..." : "Hapus"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={handleCloseModal}
                  disabled={deleting}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-60"
                >
                  Batal
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </MainLayout>
  );
}
