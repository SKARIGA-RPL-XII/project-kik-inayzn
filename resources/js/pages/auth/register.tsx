import { useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2D4F2D] p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header Card (Sign Up) */}
                <div className="bg-[#1B331B] py-5">
                    <h2 className="text-center text-3xl font-bold text-white tracking-wider">
                        Sign Up
                    </h2>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-5">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Input Username */}
                        <div>
                            <label className="block text-[#1B331B] font-bold mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="Masukkan Username"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] text-gray-900 placeholder:text-gray-400"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.username}</p>}
                        </div>

                        {/* Input Email */}
                        <div>
                            <label className="block text-[#1B331B] font-bold mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Masukkan Email"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] text-gray-900 placeholder:text-gray-400"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                        </div>

                        {/* Input Password */}
                        <div>
                            <label className="block text-[#1B331B] font-bold mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan Password"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] text-gray-900 placeholder:text-gray-400"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
                        </div>

                        {/* Input Password Confirmation */}
                        <div>
                            <label className="block text-[#1B331B] font-bold mb-1">Password confirmation</label>
                            <input
                                type="password"
                                placeholder="Masukkan Password"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] text-gray-900 placeholder:text-gray-400"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                            />
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password_confirmation}</p>}
                        </div>

                        {/* Tombol Register */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#F2EDE4] text-[#2D4F2D] font-bold py-3 rounded-lg shadow-md hover:bg-[#E5DFD3] active:scale-95 transition-all border border-[#D9D1B0] text-lg"
                            >
                                {processing ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-gray-600 font-medium text-sm">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-blue-700 hover:underline font-bold ml-1">
                                Login sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}