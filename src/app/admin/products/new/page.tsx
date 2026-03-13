"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database";

interface SizeStock {
    size: string;
    stock: number;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        category_id: "",
    });
    const [sizes, setSizes] = useState<SizeStock[]>([
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
    ]);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("categories")
            .select("*")
            .order("sort_order")
            .then(({ data }) => {
                if (data) {
                    setCategories(data);
                    if (data.length > 0) setForm((f) => ({ ...f, category_id: data[0].id }));
                }
            });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const addSize = () => {
        setSizes([...sizes, { size: "", stock: 0 }]);
    };

    const removeSize = (idx: number) => {
        setSizes(sizes.filter((_, i) => i !== idx));
    };

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();
        const slug = slugify(form.name) + "-" + Date.now().toString(36);

        // Insert product
        const { data: product, error } = await supabase
            .from("products")
            .insert({
                name: form.name,
                slug,
                description: form.description || null,
                price: parseFloat(form.price),
                discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
                category_id: form.category_id,
                is_active: true,
            })
            .select()
            .single();

        if (error || !product) {
            alert("Ürün eklenirken hata oluştu: " + (error?.message || ""));
            setSaving(false);
            return;
        }

        // Insert sizes
        const validSizes = sizes.filter((s) => s.size.trim());
        if (validSizes.length > 0) {
            await supabase.from("product_sizes").insert(
                validSizes.map((s) => ({
                    product_id: product.id,
                    size: s.size.toUpperCase(),
                    stock: s.stock,
                }))
            );
        }

        // Upload images
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const ext = file.name.split(".").pop();
            const path = `${product.id}/${i}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(path, file);

            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(path);

                await supabase.from("product_images").insert({
                    product_id: product.id,
                    image_url: urlData.publicUrl,
                    sort_order: i,
                });
            }
        }

        router.push("/admin/products");
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ürün Adı *
                    </label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
                        placeholder="Ürün adı"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                    </label>
                    <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm resize-none"
                        placeholder="Ürün açıklaması"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori *
                    </label>
                    <select
                        required
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-white"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fiyat (₺) *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            İndirimli Fiyat (₺)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.discount_price}
                            onChange={(e) =>
                                setForm({ ...form, discount_price: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm"
                            placeholder="Boş bırakılabilir"
                        />
                    </div>
                </div>

                {/* Sizes */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                            Beden & Stok
                        </label>
                        <button
                            type="button"
                            onClick={addSize}
                            className="text-xs text-primary font-medium"
                        >
                            + Beden Ekle
                        </button>
                    </div>
                    <div className="space-y-2">
                        {sizes.map((s, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={s.size}
                                    onChange={(e) => {
                                        const newSizes = [...sizes];
                                        newSizes[idx].size = e.target.value;
                                        setSizes(newSizes);
                                    }}
                                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                                    placeholder="Beden"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={s.stock}
                                    onChange={(e) => {
                                        const newSizes = [...sizes];
                                        newSizes[idx].stock = parseInt(e.target.value) || 0;
                                        setSizes(newSizes);
                                    }}
                                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                                    placeholder="Stok"
                                />
                                <span className="text-xs text-gray-400">adet</span>
                                {sizes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSize(idx)}
                                        className="text-gray-400 hover:text-danger p-1"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fotoğraflar
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {previews.map((src, idx) => (
                            <div
                                key={idx}
                                className="relative w-20 h-24 rounded-lg overflow-hidden border border-gray-200"
                            >
                                <img
                                    src={src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <label className="w-20 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <span className="text-2xl text-gray-300">+</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}
