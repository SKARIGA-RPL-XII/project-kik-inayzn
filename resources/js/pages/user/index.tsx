import React from 'react';

// Interface untuk menghindari 'any'
interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: User[];
}

export default function UserIndex({ users }: Props) {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Pengguna</h1>
                <div className="text-sm text-gray-500">Total: {users.length} User</div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">ID</th>
                            <th className="px-6 py-4 font-semibold">Username</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold text-center">Role</th>
                            <th className="px-6 py-4 font-semibold text-right">Terdaftar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-400">#{user.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' 
                                            ? 'bg-red-100 text-red-700' 
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                    Belum ada data user dalam database SQLite.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}