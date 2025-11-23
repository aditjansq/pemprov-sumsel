import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children, title }) {
  return (
    // Ubah bg-white menjadi bg-gray-50 agar ada kontras dengan kartu dashboard
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      
      <Header title={title} />
      <Sidebar />

      {/* Container Konten Utama */}
      <div className="w-full pt-6 px-4 sm:px-6 md:px-8 lg:ps-72 pb-10">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      
    </div>
  );
}