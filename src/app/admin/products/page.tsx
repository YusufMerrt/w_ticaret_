"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductImage, Category } from "@/types/database";

type ProductFull = Product & { images: ProductImage[]; category: Category };

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductFull[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("products")
            .select(`*, images:product_images(*), category:categories(*)`)
            .order("created_at", { ascending: false });
        setProducts((data as ProductFull[]) || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
        const supabase = createClient();
        await supabase.from("products").delete().eq("id", id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const toggleActive = async (id: string, isActive: boolean) => {
        const supabase = createClient();
        await supabase.from("products").update({ is_active: !isActive }).eq("id", id);
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, is_active: !isActive } : p))
        );
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Ürünler ({products.length})</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                    + Yeni Ürün
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-400 mb-3">Henüz ürün eklenmemiş</p>
                    <Link
                        href="/admin/products/new"
                        className="text-primary font-medium text-sm"
                    >
                        İlk ürünü ekleyin →
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="text-left px-4 py-3">Ürün</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Kategori</th>
                                    <th className="text-left px-4 py-3">Fiyat</th>
                                    <th className="text-center px-4 py-3 hidden md:table-cell">Durum</th>
                                    <th className="text-right px-4 py-3">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0].image_url}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>
                                                    )}
                                                </div>
                                                <span className="font-medium line-clamp-1">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                                            {product.category?.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="font-medium">{Number(product.price).toLocaleString("tr-TR")} ₺</span>
                                                {product.discount_price && (
                                                    <span className="block text-xs text-danger">
                                                        {Number(product.discount_price).toLocaleString("tr-TR")} ₺
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center hidden md:table-cell">
                                            <button
                                                onClick={() => toggleActive(product.id, product.is_active)}
                                                className={`text-xs font-medium px-2 py-1 rounded-full ${product.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {product.is_active ? "Aktif" : "Pasif"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="text-xs text-primary hover:text-primary-dark font-medium px-2 py-1"
                                                >
                                                    Düzenle
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-xs text-danger hover:text-red-800 font-medium px-2 py-1"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
