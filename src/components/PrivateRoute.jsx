import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRoute = () => {
  // 1. Ambil data user dari LocalStorage
  const user = localStorage.getItem('user');

  // 2. Cek apakah user ada?
  if (!user) {
    // Opsional: Kasih alert memberitahu harus login
    Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Silakan login terlebih dahulu.',
        timer: 1500,
        showConfirmButton: false
    });

    // 3. Jika tidak ada, REDIRECT ke halaman Login
    return <Navigate to="/login" replace />;
  }

  // 4. Jika ada, IZINKAN masuk (render halaman tujuan / Outlet)
  return <Outlet />;
};

export default PrivateRoute;