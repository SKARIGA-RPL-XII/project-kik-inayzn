import React, { useState, useRef } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { 
    User, 
    Mail, 
    Calendar, 
    ShieldCheck, 
    ArrowLeft,
    Camera,
    CheckCircle2,
    Loader2
} from 'lucide-react';

export default function ProfilUser() {
    // Ambil data auth dari props Inertia
    const { auth } = usePage().props as any;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            // URL.createObjectURL membuat link sementara untuk ditampilkan di browser
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const submitPhoto = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/avatar', {
            forceFormData: true,
            // onSuccess memastikan preview dihapus setelah server berhasil menyimpan
            onSuccess: () => {
                setPreview(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Head title="Profil Saya - PropertyKu" />

            <div className="bg-[#1a432d] h-64 w-full relative">
                <div className="max-w-4xl mx-auto px-8 pt-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-emerald-100/70 hover:text-white transition-all font-bold text-sm group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-8 -mt-32 pb-20 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                    
                    <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center gap-8">
                        {/* FOTO PROFIL SECTION */}
                        <div className="relative group">
                            <div className="w-36 h-36 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden border-4 border-white">
                                {preview ? (
                                    /* 1. Prioritas pertama: Tampilkan preview foto yang baru dipilih */
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                ) : auth.user.avatar ? (
                                    /* 2. Prioritas kedua: Tampilkan foto dari database jika ada */
                                    <img 
                                        src={`/storage/${auth.user.avatar}`} 
                                        key={auth.user.avatar} // Key memaksa React refresh image jika path berubah
                                        className="w-full h-full object-cover" 
                                        alt="Avatar" 
                                    />
                                ) : (
                                    /* 3. Prioritas terakhir: Icon default user */
                                    <User size={64} className="opacity-40" />
                                )}
                            </div>
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:bg-[#1a432d] transition-all active:scale-95 group"
                            >
                                <Camera size={20} />
                            </button>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{auth.user.username}</h1>
                            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                <Mail size={16} /> {auth.user.email}
                            </p>
                            
                            {data.avatar && (
                                <button 
                                    onClick={submitPhoto}
                                    disabled={processing}
                                    className="mt-5 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                >
                                    {processing ? (
                                        <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </button>
                            )}

                            {recentlySuccessful && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100 animate-bounce">
                                    <CheckCircle2 size={16} /> Berhasil diperbarui!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Akun</h3>
                            
                            <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Username</p>
                                    <p className="font-bold text-slate-700">{auth.user.username || 'n/a'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Member Sejak</p>
                                    <p className="font-bold text-slate-700">Februari 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="p-8 bg-emerald-900 rounded-[2rem] text-white relative overflow-hidden group">
                                <ShieldCheck className="text-emerald-400/20 absolute -right-4 -bottom-4 rotate-12 transition-transform group-hover:scale-110" size={120} />
                                <div className="relative z-10">
                                    <h4 className="font-black text-xl mb-2">Akun Terverifikasi</h4>
                                    <p className="text-emerald-100/70 text-sm leading-relaxed">
                                        Data profil Anda aman bersama kami. Gunakan foto asli untuk mempermudah proses transaksi properti.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}