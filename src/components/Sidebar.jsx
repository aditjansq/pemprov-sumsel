import { Home, Box, FileText, Truck, Warehouse, ShoppingBag, Wheat, Store, Beef, Users, LogOut, Server, Map } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoSumsel from '../assets/logo-sumsel.png';



export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path 
    ? "bg-gray-100 text-green-600" 
    : "text-gray-700 hover:bg-gray-100";

  return (
    <div id="application-sidebar" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
      
      <div className="px-6">
        <Link className="flex-none text-xl font-semibold flex items-center gap-3" to="/dashboard" aria-label="Brand">
           <img src={logoSumsel} alt="Logo" className="w-8 h-auto"/>
           <div className="flex flex-col">
              <span className="text-green-600 font-bold leading-none">TELUSUR</span>
              <span className="text-green-600 font-bold leading-none">KOMODITAS</span>
           </div>
        </Link>
      </div>

      <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
        <ul className="space-y-1.5">
          
          <li>
            <Link to="/dashboard" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/dashboard')}`}>
              <Home size={18} />
              Beranda
            </Link>
          </li>

          <li className="pt-4 pb-2">
             <span className="text-xs font-semibold uppercase text-gray-400">Data Master</span>
          </li>

          <li><Link to="/komoditas" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/komoditas')}`}><Box size={18}/>Komoditas</Link></li>
          <li><Link to="/artikel" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/artikel')}`}><FileText size={18}/>Artikel</Link></li>
          <li><Link to="/eksportir" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/eksportir')}`}><Truck size={18}/>Eksportir</Link></li>
          <li><Link to="/gudang" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/gudang')}`}><Warehouse size={18}/>Gudang</Link></li>
          <li><Link to="/pengepul" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/pengepul')}`}><Store size={18}/>Pengepul</Link></li>
          <li><Link to="/petani" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/petani')}`}><Wheat size={18}/>Petani</Link></li> 
          <li><Link to="/umkm" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/umkm')}`}><ShoppingBag size={18}/>UMKM</Link></li>
          <li><Link to="/peternakan" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/peternakan')}`}><Beef size={18}/>Peternakan</Link></li>
          <li><Link to="/pengguna" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/pengguna')}`}><Users size={18}/>Pengguna</Link></li>
          
          <li className="pt-4 pb-2">
             <span className="text-xs font-semibold uppercase text-gray-400">Data Ekspor</span>
          </li>

          <li>
            <Link to="/proses-ekspor" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/proses-ekspor')}`}>
              <Server size={18}/>
              Proses Ekspor
              <span className="ms-auto py-0.5 px-2 rounded-full text-xs font-medium bg-black text-white">
                2
              </span>
            </Link>
          </li> 

          <li>
            <Link to="/proses-coo" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/proses-coo')}`}>
              <Map size={18}/>
              Sertifikat COO
              <span className="ms-auto py-0.5 px-2 rounded-full text-xs font-medium bg-black text-white">
                1
              </span>
            </Link>
          </li>

             <li>
            <Link to="/sertifikat-kesehatan" className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600 ${isActive('/sertifikat-kesehatan')}`}>
              <Map size={18}/>
              Sertifikat Kesehatan
              <span className="ms-auto py-0.5 px-2 rounded-full text-xs font-medium bg-black text-white">
                2
              </span>
            </Link>
          </li>

          <li className="pt-4 pb-2">
             <span className="text-xs font-semibold uppercase text-gray-400">Akun</span>
          </li>
          <li>
            <Link to="/login" className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-gray-600">
              <LogOut size={18} />
              Keluar
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
}