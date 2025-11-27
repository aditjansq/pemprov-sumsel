import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// LAYOUTS
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// PAGES
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ListPengguna from './pages/Pengguna/ListPengguna';
import TambahPengguna from './pages/Pengguna/TambahPengguna';
import EditPengguna from './pages/Pengguna/EditPengguna';
import { Import } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pengguna" element={<ListPengguna />} />
          <Route path="/pengguna/tambah" element={<TambahPengguna />} />
          <Route path="/pengguna/edit/:id" element={<EditPengguna />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;