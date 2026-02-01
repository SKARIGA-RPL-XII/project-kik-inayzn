import { useForm, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Login() {
    // 1. Inisialisasi field 'email' agar sesuai dengan AuthController
    const { data, setData, post, processing, errors } = useForm({
        email: '', 
        password: '',
    });

    const slides = [
        {
            title: "Temukan Hunian",
            highlight: "Impian Anda",
            desc: "Cari hunian terbaik di lokasi strategis dengan harga yang kompetitif."
        },
        {
            title: "Kelola Aset",
            highlight: "Lebih Mudah",
            desc: "Pantau dan atur semua properti Anda dalam satu platform yang terintegrasi."
        },
        {
            title: "Investasi",
            highlight: "Masa Depan",
            desc: "Mulai langkah cerdas dengan investasi hunian yang aman dan terpercaya."
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirim data ke route /login yang ada di AuthController
        post('/login');
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden font-sans">
            {/* Sisi Kiri: Form Section */}
            <div className="flex-[3] flex flex-col p-6 md:p-12 relative">
                <div className="mb-8 self-start">
                    {/* Pastikan file gambar ini ada di public/images/logo.png */}
                    <img src="/images/logo.png" alt="Logo" className="h-14 w-auto object-contain" />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-[#E2DCC8] via-[#A8B8A0] to-[#7B947B] py-8 text-center">
                            <h2 className="text-4xl font-semibold text-white tracking-wide">Sign In</h2>
                        </div>

                        <div className="p-10 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {/* INPUT EMAIL */}
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Masukkan Email"
                                            className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6B] outline-none text-lg font-medium transition-all"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        {/* Menampilkan error email dari controller */}
                                        {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>}
                                    </div>

                                    {/* INPUT PASSWORD */}
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Masukkan Password"
                                            className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6B] outline-none text-lg font-medium transition-all"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#F5F1E9] text-[#2D4F2D] font-bold py-4 rounded-xl shadow-md hover:bg-[#EDE7D9] active:scale-[0.98] transition-all border border-[#E0D8C3] text-2xl cursor-pointer"
                                >
                                    {processing ? 'Memproses...' : 'Login'}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <p className="text-gray-700 font-bold text-lg">
                                    Belum punya akun?{' '}
                                    <Link href="/register" className="text-[#4A69FF] hover:underline ml-1">
                                        Daftar sekarang
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Slider Kalimat Otomatis (Tanpa Kata Property) */}
            <div className="hidden lg:flex flex-1 bg-[#1B331B] items-center justify-center p-12 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#A8B8A0] rounded-full blur-[100px]"></div>
                </div>

                <div key={currentSlide} className="max-w-md text-center z-10 animate-fade-in-up">
                    <h3 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                        {slides[currentSlide].title} <br/> 
                        <span className="text-[#A8B8A0]">{slides[currentSlide].highlight}</span>
                    </h3>
                    <div className="h-1.5 w-24 bg-[#A8B8A0] mx-auto mb-8 rounded-full"></div>
                    <p className="text-gray-300 text-xl leading-relaxed font-light min-h-[80px]">
                        {slides[currentSlide].desc}
                    </p>
                    <div className="mt-16 flex justify-center gap-4">
                        {slides.map((_, index) => (
                            <div 
                                key={index}
                                className={`h-2 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-8 bg-[#A8B8A0]' : 'w-2 bg-white/20'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}