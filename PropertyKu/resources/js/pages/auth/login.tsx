import { useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',    
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">
            {/* Sisi Kiri: Form Login */}
            <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col p-8 md:p-16">
                
                {/* Logo Section */}
                <div className="flex items-center gap-2 mb-10 md:mb-16">
                    <div className="flex items-center">
                        <span className="text-[#4F7942] font-bold text-4xl">PK</span>
                        <span className="ml-2 text-2xl font-bold text-[#4F7942]">PropertyKu</span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        
                        {/* Header Card dengan Gradient (Sign In) */}
                        <div className="bg-gradient-to-r from-[#D9D1B0] to-[#6B8E6B] py-6 shadow-md">
                            <h2 className="text-center text-3xl font-bold text-white tracking-wide">
                                Sign In
                            </h2>
                        </div>

                        {/* Form Body */}
                        <div className="p-8 md:p-10 space-y-5">
                            <form onSubmit={submit} className="space-y-5">
                                
                                {/* Input Email */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Masukkan Email"
                                        // Tambah text-gray-900 agar tulisan yang diketik terlihat jelas
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                                </div>

                                {/* Input Password */}
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Masukkan Password"
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
                                </div>

                                {/* Tombol Login */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#F2EDE4] text-[#2D4F2D] font-extrabold py-3 rounded-lg shadow-md hover:bg-[#E5DFD3] active:scale-95 transition-all border border-[#D9D1B0] text-xl uppercase tracking-wider"
                                >
                                    {processing ? 'Loading...' : 'Login'}
                                </button>
                            </form>

                            {/* Link Daftar */}
                            <div className="text-center pt-2">
                                <p className="text-gray-700 font-medium">
                                    Belum punya akun?{' '}
                                    <Link href="/register" className="text-blue-700 hover:underline font-bold ml-1">
                                        Daftar sekarang
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Dekorasi Hijau Tua (Dibuat Ramping) */}
            <div className="hidden md:block md:w-[30%] lg:w-[25%] bg-[#2D4F2D] shadow-inner">
                {/* Bagian ini sekarang lebih ramping (hanya 25-30% lebar layar) */}
            </div>
        </div>
    );
}