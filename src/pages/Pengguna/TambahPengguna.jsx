import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // <--- PERBAIKAN: Import api utility
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  ArrowLeft, User, Lock, Building2, Phone, 
  MapPin, Shield, Save, X, Eye, EyeOff,
} from "lucide-react";

// ... (Bagian Komponen Bantuan InputField & SelectField TETAP SAMA, tidak perlu diubah) ...
// Copy-paste saja komponen InputField dan SelectField dari kodemu sebelumnya ke sini.

const InputField = ({ label, name, type = "text", placeholder, onChange, error, icon: Icon, isTextArea = false, rows = 3, onTogglePassword, showPassword, ...props }) => {
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const baseClasses = "w-full pl-11 px-4 py-3 rounded-xl border bg-white outline-none transition font-medium";
  const errorClasses = "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";
  const defaultClasses = "border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10";
  const finalClasses = `${baseClasses} ${error ? errorClasses : defaultClasses}`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className={`absolute left-0 flex items-center pl-4 pointer-events-none text-gray-400 z-10 ${isTextArea ? "top-3.5" : "inset-y-0"}`}>
          {Icon && <Icon size={18} />}
        </div>
        {isTextArea ? (
          <textarea name={name} onChange={onChange} rows={rows} className={`${finalClasses} resize-none pt-3.5`} placeholder={placeholder} {...props}></textarea>
        ) : (
          <input type={inputType} name={name} onChange={onChange} className={`${finalClasses} ${isPassword ? "pr-11" : ""}`} placeholder={placeholder} {...props} />
        )}
        {isPassword && (
          <button type="button" onClick={onTogglePassword} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

const SelectField = ({ label, name, options, onChange, error, placeholder, icon: Icon, customStyles, hint }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 z-10">
        <Icon size={18} />
      </div>
      <Select isMulti name={name} options={options} onChange={onChange} styles={customStyles} placeholder={placeholder} className={`w-full ${error ? "react-select-error" : ""}`} classNamePrefix="react-select" />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);


// --- KOMPONEN UTAMA ---
export default function TambahPengguna() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const optionsHakAkses = [
    { value: "Proses Ekspor", label: "Proses Ekspor" },
    { value: "COO", label: "COO" },
    { value: "Sertifikat Kesehatan", label: "Sertifikat Kesehatan" },
    { value: "Eksportir", label: "Eksportir" },
    { value: "Gudang", label: "Gudang" },
    { value: "Pelaku Hulu", label: "Pelaku Hulu" },
    { value: "UMKM", label: "UMKM" },
    { value: "Peternakan", label: "Peternakan" },
    { value: "Admin", label: "Admin" },
  ];

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    alamat: "",
    telepon_wa: "",
    email: "",
    instansi: "",
    nama_pengguna: "",
    kata_sandi: "",
    konfirmasi_kata_sandi: "",
    hak_akses: "",
    created_by: "Admin",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (selectedOptions) => {
    const values = selectedOptions?.map((opt) => opt.value).join(", ") || "";
    setFormData({ ...formData, hak_akses: values });
  };

  const validate = () => {
    // ... (Validasi TETAP SAMA, tidak perlu diubah) ...
    const newErrors = {};
    if (!formData.nama_lengkap || formData.nama_lengkap.trim().length < 3) newErrors.nama_lengkap = "Nama lengkap minimal 3 karakter.";
    if (!formData.email) newErrors.email = "Email wajib diisi.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Format email tidak valid.";
    if (!formData.alamat || formData.alamat.trim().length < 5) newErrors.alamat = "Alamat minimal 5 karakter.";
    if (!formData.telepon_wa) newErrors.telepon_wa = "Telepon / WA wajib diisi.";
    else if (!/^[0-9]+$/.test(formData.telepon_wa)) newErrors.telepon_wa = "Telepon / WA hanya boleh berisi angka.";
    else if (formData.telepon_wa.length < 10) newErrors.telepon_wa = "Telepon / WA minimal 10 digit.";
    if (!formData.nama_pengguna || formData.nama_pengguna.trim().length < 4) newErrors.nama_pengguna = "Nama pengguna minimal 4 karakter.";
    if (!formData.kata_sandi || formData.kata_sandi.length < 6) newErrors.kata_sandi = "Kata sandi minimal 6 karakter.";
    if (!formData.konfirmasi_kata_sandi) newErrors.konfirmasi_kata_sandi = "Konfirmasi kata sandi wajib diisi.";
    else if (formData.kata_sandi !== formData.konfirmasi_kata_sandi) newErrors.konfirmasi_kata_sandi = "Kata sandi dan konfirmasi tidak cocok.";
    if (!formData.hak_akses) newErrors.hak_akses = "Minimal pilih satu hak akses.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      // ✅ PERBAIKAN: Gunakan api.post dan endpoint relatif
      await api.post("/register", formData);
      
      toast.success("Data pengguna berhasil ditambahkan!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/pengguna");
      }, 3000); 

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data!", {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      paddingLeft: "40px",
      borderRadius: "0.75rem",
      minHeight: "48px",
      paddingTop: "6px",
      paddingBottom: "6px",
      borderColor: state.isFocused ? "#22c55e" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(34, 197, 94, 0.1)" : "none",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    menu: (base) => ({ ...base, zIndex: 20 }),
  };

  // --- RENDER (SAMA PERSIS DENGAN KODEMU) ---
  return (
    <MainLayout title="Tambah Pengguna">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* ... (Header Form sama) ... */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10">
          <button onClick={() => navigate("/pengguna")} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Tambah Data Pengguna</h2>
            <p className="text-sm text-gray-500">Lengkapi form di bawah untuk menambahkan pengguna baru.</p>
          </div>
        </div>

        {/* ... (Isi Form sama persis) ... */}
        <div className="p-8 bg-gray-50/30">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <InputField label="Nama Lengkap" name="nama_lengkap" onChange={handleChange} error={errors.nama_lengkap} icon={User} placeholder="Masukkan Nama Lengkap" />
              <InputField label="Email (Wajib)" name="email" type="email" onChange={handleChange} error={errors.email} icon={User} placeholder="contoh@email.com" />
              <InputField label="Alamat" name="alamat" onChange={handleChange} error={errors.alamat} icon={MapPin} placeholder="Masukkan Alamat Lengkap" isTextArea rows={3} />
              <div className="pt-4">
                <InputField label="Telepon / WA" name="telepon_wa" type="tel" onChange={handleChange} error={errors.telepon_wa} icon={Phone} placeholder="08xxxxxxxx" />
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <InputField label="Nama Pengguna" name="nama_pengguna" onChange={handleChange} error={errors.nama_pengguna} icon={User} placeholder="Masukkan Username" />
              <InputField label="Kata Sandi" name="kata_sandi" type="password" onChange={handleChange} error={errors.kata_sandi} icon={Lock} placeholder="Masukkan Kata Sandi" onTogglePassword={() => setShowPassword((prev) => !prev)} showPassword={showPassword} />
              <InputField label="Konfirmasi Kata Sandi" name="konfirmasi_kata_sandi" type="password" onChange={handleChange} error={errors.konfirmasi_kata_sandi} icon={Lock} placeholder="Ulangi Kata Sandi" onTogglePassword={() => setShowPasswordConfirm((prev) => !prev)} showPassword={showPasswordConfirm} />
              <SelectField label="Hak Akses" name="hak_akses" options={optionsHakAkses} onChange={handleSelectChange} error={errors.hak_akses} icon={Shield} customStyles={customStyles} placeholder="Pilih Hak Akses (Bisa Banyak)" hint="Anda dapat memilih lebih dari satu hak akses." />
              <InputField label="Instansi" name="instansi" onChange={handleChange} icon={Building2} placeholder="Nama Instansi" />

              <div className="flex justify-end pt-4 mt-auto gap-3">
                <button onClick={() => navigate("/pengguna")} disabled={isLoading} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm disabled:opacity-50">
                  <X size={18} /> Batal
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-sm disabled:opacity-70">
                  {isLoading ? ("Menyimpan...") : (<><Save size={18} /> Simpan</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}