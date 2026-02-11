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
    Loader2,
    MessageCircle,
    ChevronRight,
    Bell,
    Pencil,
    Lock,
    X
} from 'lucide-react';

export default function ProfilUser() {
    const { auth } = usePage().props as any;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, patch, processing, recentlySuccessful, errors, reset } = useForm({
        avatar: null as File | null,
        username: auth.user.username || '',
        email: auth.user.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const submitPhoto = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/avatar', {
            forceFormData: true,
            onSuccess: () => setPreview(null),
        });
    };

    const submitProfileData = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/profile/update', {
            onSuccess: () => {
                setIsEditing(false);
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Head title="Profil Saya - PropertyKu" />

            {/* HEADER / COVER PHOTO */}
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
                    
                    {/* SECTION: USER IDENTITY */}
                    <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-36 h-36 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden border-4 border-white">
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                ) : auth.user.avatar ? (
                                    <img src={`/storage/${auth.user.avatar}`} key={auth.user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                ) : (
                                    <User size={64} className="opacity-40" />
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:bg-[#1a432d] transition-all active:scale-95"
                            >
                                <Camera size={20} />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{auth.user.username}</h1>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                >
                                    {isEditing ? <X size={18} /> : <Pencil size={18} />}
                                </button>
                            </div>
                            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                <Mail size={16} /> {auth.user.email}
                            </p>
                            
                            {data.avatar && (
                                <button onClick={submitPhoto} disabled={processing} className="mt-5 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                    {processing ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Foto Baru'}
                                </button>
                            )}

                            {recentlySuccessful && !isEditing && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100">
                                    <CheckCircle2 size={16} /> Berhasil diperbarui!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION: ACCOUNT DETAILS / EDIT FORM */}
                    <div className="p-10 bg-slate-50/30">
                        {isEditing ? (
                            <form onSubmit={submitProfileData} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase ml-2">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="text" value={data.username} onChange={e => setData('username', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase ml-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase ml-2">Password Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="password" placeholder="••••••••" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase ml-2">Konfirmasi Password</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="password" placeholder="••••••••" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" disabled={processing} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                        {processing ? <Loader2 className="animate-spin" /> : 'Update Profil'}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-300 transition-all">Batal</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Akun</h3>
                                    <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><User size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Username</p>
                                            <p className="font-bold text-slate-700">{auth.user.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Member Sejak</p>
                                            <p className="font-bold text-slate-700">Februari 2026</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-emerald-900 rounded-[2rem] text-white relative overflow-hidden flex flex-col justify-center">
                                    <ShieldCheck className="text-emerald-400/20 absolute -right-4 -bottom-4 rotate-12" size={120} />
                                    <h4 className="font-black text-xl mb-2 relative z-10">Akun Terverifikasi</h4>
                                    <p className="text-emerald-100/70 text-sm leading-relaxed relative z-10">Data profil Anda aman bersama kami. Gunakan foto asli untuk mempermudah transaksi.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION: NOTIFIKASI */}
                    <div className="p-10 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Bell className="text-emerald-600" size={24} /> 
                                    Notifikasi Balasan
                                </h3>
                                <p className="text-slate-400 text-sm font-medium">Pantau interaksi pada ulasan Anda</p>
                            </div>
                            {auth.unread_count > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
                                    {auth.unread_count} Baru
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            {auth.notifications && auth.notifications.length > 0 ? (
                                auth.notifications.map((notif: any) => (
                                    <Link 
                                        key={notif.id}
                                        href={`/products/${notif.data.produk_id}#ulasan-${notif.data.ulasan_id}`}
                                        className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-600 font-bold leading-tight">
                                                <span className="text-emerald-700">@{notif.data.replier_name}</span> membalas ulasan Anda di <span className="text-slate-900 italic">"{notif.data.product_name}"</span>
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-tighter">Baru saja</p>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                    <MessageCircle size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-400 font-bold">Belum ada balasan untuk ulasan Anda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}