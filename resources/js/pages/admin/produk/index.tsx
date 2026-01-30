import React from 'react';

// Mendefinisikan struktur data produk
interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    created_at: string;
}

interface Props {
    products: Product[];
}

export default function Index({ products }: Props) {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Tambah Produk
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Harga</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Stok</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                                        <button className="text-red-600 hover:underline text-sm">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    Belum ada data produk.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}