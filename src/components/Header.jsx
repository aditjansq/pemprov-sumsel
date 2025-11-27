import { Search, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { useEffect, useState, useRef } from 'react';

export default function Header({ title }) {
  const location = useLocation();
  const navigate = useNavigate(); // Untuk handle logout
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // 1. STATE UNTUK MENAMPUNG DATA USER
  const [currentUser, setCurrentUser] = useState({
    nama_lengkap: 'Pengguna', // Default jika loading/error
    email: '',
    initial: 'U'
  });

  // 2. USE EFFECT: AMBIL DATA DARI LOCAL STORAGE SAAT COMPONENT DIMUAT
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser({
          nama_lengkap: parsedUser.nama_lengkap || parsedUser.nama_pengguna || 'Pengguna',
          email: parsedUser.email || '-',
          // Ambil huruf pertama untuk avatar
          initial: parsedUser.nama_lengkap ? parsedUser.nama_lengkap.charAt(0).toUpperCase() : 'U'
        });
      } catch (error) {
        console.error("Gagal memproses data user", error);
      }
    }
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Hapus data sesi
    setIsOpen(false);
    navigate('/login'); // Lempar ke halaman login
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b border-gray-200 text-sm py-2.5 sm:py-4 lg:ps-64">
      <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
        
        <div className="me-5 lg:me-0 lg:hidden">
          <button type="button" className="text-gray-500 hover:text-gray-600">
            <span className="sr-only">Toggle Navigation</span>
            <svg className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>

        <div className="w-full flex items-center justify-between ms-auto md:justify-between sm:gap-x-3 sm:order-3">
          
          {/* Judul Halaman */}
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          <div className="flex flex-row items-center justify-end gap-3">
            <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
              <Search size={18} />
            </button>
            
            {/* Profil Dropdown */}
            <div className="relative inline-flex" ref={dropdownRef}>
              
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                type="button" 
                className="inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              >
                 {/* 3. TAMPILKAN INISIAL NAMA */}
                 <div className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm ring-2 ring-white">
                    <span className="font-bold text-sm">{currentUser.initial}</span>
                 </div>

                 {/* 4. TAMPILKAN NAMA LENGKAP */}
                 <span className="hidden sm:block font-medium text-gray-600 text-xs">
                    {currentUser.nama_lengkap}
                 </span>
                 
                 <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Isi Menu Dropdown */}
              {isOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[15rem] bg-white shadow-lg rounded-xl p-2 border border-gray-100 animate-in fade-in zoom-in-95 duration-100 z-50">
                  
                  {/* Info User */}
                  <div className="py-3 px-4 bg-gray-50 rounded-t-lg mb-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Masuk sebagai</p>
                    {/* 5. TAMPILKAN EMAIL DINAMIS */}
                    <p className="text-sm font-bold text-gray-800 truncate">{currentUser.email}</p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-x-3.5 py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={16} />
                      Profil Saya
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Tombol Logout Modifikasi */}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-3.5 py-2.5 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Keluar Aplikasi
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}