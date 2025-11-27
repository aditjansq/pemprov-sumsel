import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "preline/preline";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Halaman
import Dashboard from './pages/Dashboard';
import Komoditas from './pages/Komoditas'; // <--- Pastikan ini mengarah ke file baru di folder pages
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Artikel from './pages/Artikel';
import Eksportir from './pages/Eksportir';

import Gudang from './pages/Gudang';
import Pengepul from './pages/Pengepul';  
import Petani from './pages/Petani';
import Umkm from './pages/Umkm';
import Peternakan from './pages/Peternakan';
import Pengguna from './pages/Pengguna';
import ProsesEkspor from './pages/ProsesEkspor';
import ProsesCoo from './pages/ProsesCoo';
import SertifikatKesehatan from './pages/SertifkatKesehatan';

// NEW 

import ListPengguna from './pages/Pengguna/ListPengguna';
import TambahPengguna from './pages/Pengguna/TambahPengguna';
import EditPengguna from './pages/Pengguna/EditPengguna';
function App() {
  const location = useLocation();

  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/eksportir" element={<Eksportir />} />
      {/* Gunakan komponen Komoditas yang baru */}
      <Route path="/komoditas" element={<Komoditas />} />
      
      {/* Placeholder untuk rute lain */}
    <Route path="/artikel" element={<Artikel />} />
    
      <Route path="/gudang" element={<Gudang/>} />
      <Route path="/pengepul" element={<Pengepul />} />
      <Route path="/umkm" element={<Umkm />} />
      <Route path="/petani" element={<Petani />} />
      <Route path="/peternakan" element={<Peternakan />} />
      <Route path="/pengguna" element={<Pengguna />} />
      <Route path="/proses-ekspor" element={<ProsesEkspor />} />
      <Route path="/proses-coo" element={<ProsesCoo />} />
      <Route path="/sertifikat-kesehatan" element={<SertifikatKesehatan />} />
      <Route path="/login" element={<div>Halaman Login</div>} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}  