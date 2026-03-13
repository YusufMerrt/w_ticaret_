"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/database";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const fetchCategories = async () => {
        const supabase = createClient();
        const { data } = await supabase.from("categories").select("*").order("sort_order");
        setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const slugify = (text: string) =>
        text.toLowerCase()
            .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const addCategory = async () => {
        if (!newName.trim()) return;
        const supabase = createClient();
        const slug = slugify(newName);
        await supabase.from("categories").insert({
            name: newName.trim(),
            slug,
            sort_order: categories.length + 1,
        });
        setNewName("");
        fetchCategories();
    };

    const updateCategory = async (id: string) => {
        if (!editName.trim()) return;
        const supabase = createClient();
        await supabase.from("categories").update({ name: editName.trim(), slug: slugify(editName) }).eq("id", id);
        setEditingId(null);
        fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? İçindeki ürünler de silinecektir.")) return;
        const supabase = createClient();
        await supabase.from("categories").delete().eq("id", id);
        fetchCategories();
    };

    if (loading) return <div className="skeleton h-40 rounded-xl" />;

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Kategoriler</h1>

            {/* Add new */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Yeni kategori adı"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none"
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                />
                <button
                    onClick={addCategory}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    Ekle
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3"
                    >
                        {editingId === cat.id ? (
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && updateCategory(cat.id)}
                                />
                                <button onClick={() => updateCategory(cat.id)} className="text-xs text-primary font-medium px-2">Kaydet</button>
                                <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 px-2">İptal</button>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm font-medium">{cat.name}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                        className="text-xs text-primary font-medium px-2 py-1"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="text-xs text-danger font-medium px-2 py-1"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
