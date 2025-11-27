import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPengguna from './pages/Pengguna/ListPengguna';
import TambahPengguna from './pages/Pengguna/TambahPengguna';
import EditPengguna from './pages/Pengguna/EditPengguna';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pengguna" element={<ListPengguna />} />
        <Route path="/pengguna/tambah" element={<TambahPengguna />} />
        <Route path="/pengguna/edit/:id" element={<EditPengguna />} />
        
        {/* Tambahkan route lain seperti Dashboard dll */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;