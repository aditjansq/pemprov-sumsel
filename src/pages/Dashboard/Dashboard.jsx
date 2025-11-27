import MainLayout from "../../layouts/MainLayout";
import { Users, Home, Truck, Warehouse, ShoppingBag, Wheat, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  // Data dummy statistik (Kartu Atas)
  const stats = [
    { title: "Eksportir", count: 23, icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Gudang", count: 60, icon: Warehouse, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Pengepul", count: 112, icon: Home, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Petani", count: 521, icon: Wheat, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "UMKM", count: 123, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Peternakan", count: 18, icon: Users, color: "text-red-600", bg: "bg-red-100" },
  ];

  // Data Dummy untuk Persentase Ekspor
  const chartData = [
    { label: "Kopi", value: 65, color: "#16a34a" }, // Hijau
    { label: "Paha Kodok", value: 35, color: "#cbd5e1" } // Abu-abu
  ];

  return (
    <MainLayout title="Beranda">
      <div className="space-y-8">
        
        {/* === BANNER SELAMAT DATANG === */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-xl">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, Adit! 👋</h2>
            <p className="text-green-100 text-lg max-w-2xl">
              Sistem Informasi Ketertelusuran Komoditas Unggulan Provinsi Sumatera Selatan.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>

        {/* === GRID KARTU STATISTIK === */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistik Data Master</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{item.title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{item.count}</h3>
                  </div>
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon size={24} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md font-medium">
                  <ArrowUpRight size={12} />
                  <span>Update Terbaru</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === PERSENTASE EKSPOR (Full Width Sesuai Wireframe) === */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-8 text-lg">Persentase Ekspor Komoditas</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
              
              {/* 1. BAGIAN DIAGRAM DONUT (Kiri) */}
              <div className="relative w-64 h-64 rounded-full shadow-inner flex-shrink-0"
                    style={{
                      background: `conic-gradient(${chartData[0].color} 0% 65%, ${chartData[1].color} 65% 100%)`
                    }}
              >
                {/* Lubang Donut */}
                <div className="absolute inset-10 bg-white rounded-full flex items-center justify-center flex-col shadow-sm border border-gray-50">
                  <span className="text-4xl font-extrabold text-gray-800">65%</span>
                  <span className="text-sm text-gray-400 uppercase font-bold tracking-widest mt-1">Dominasi</span>
                </div>
              </div>

              {/* 2. BAGIAN KETERANGAN / LEGEND (Kanan) */}
              <div className="flex flex-col gap-6 w-full max-w-xs">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition cursor-default">
                    <div className="flex items-center gap-4">
                      {/* Lingkaran Indikator Warna */}
                      <div 
                        className="w-5 h-5 rounded-full ring-4 ring-white shadow-sm" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-semibold text-gray-700 text-lg">{item.label}</span>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{item.value}%</span>
                  </div>
                ))}
              </div>

            </div>
        </div>

      </div>
    </MainLayout>
  );
}