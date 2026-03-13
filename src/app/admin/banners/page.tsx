"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import type { Banner } from "@/types/database";

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: "", subtitle: "", link_url: "" });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const fetchBanners = async () => {
        const supabase = createClient();
        const { data } = await supabase.from("banners").select("*").order("sort_order");
        setBanners(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);

        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("banners")
            .upload(path, file);

        if (uploadError) {
            alert("Yükleme hatası: " + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);

        await supabase.from("banners").insert({
            title: form.title || null,
            subtitle: form.subtitle || null,
            image_url: urlData.publicUrl,
            link_url: form.link_url || null,
            sort_order: banners.length,
            is_active: true,
        });

        setForm({ title: "", subtitle: "", link_url: "" });
        setFile(null);
        setPreview("");
        setUploading(false);
        fetchBanners();
    };

    const deleteBanner = async (id: string) => {
        if (!confirm("Banner'ı silmek istediğinize emin misiniz?")) return;
        const supabase = createClient();
        await supabase.from("banners").delete().eq("id", id);
        fetchBanners();
    };

    const toggleActive = async (id: string, current: boolean) => {
        const supabase = createClient();
        await supabase.from("banners").update({ is_active: !current }).eq("id", id);
        setBanners((prev) => prev.map((b) => b.id === id ? { ...b, is_active: !current } : b));
    };

    if (loading) return <div className="skeleton h-40 rounded-xl" />;

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Banner Yönetimi</h1>

            {/* Upload form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 mb-6 space-y-3">
                <div>
                    {preview ? (
                        <div className="relative aspect-[16/7] rounded-xl overflow-hidden mb-2">
                            <img src={preview} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => { setFile(null); setPreview(""); }} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">✕</button>
                        </div>
                    ) : (
                        <label className="block aspect-[16/7] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary transition-colors mb-2">
                            <div className="text-center">
                                <span className="text-3xl text-gray-300 block mb-1">🖼️</span>
                                <span className="text-sm text-gray-400">Banner fotoğrafı seçin</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    )}
                </div>
                <input type="text" placeholder="Başlık (opsiyonel)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                <input type="text" placeholder="Alt başlık (opsiyonel)" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                <button type="submit" disabled={!file || uploading} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors">
                    {uploading ? "Yükleniyor..." : "Banner Ekle"}
                </button>
            </form>

            {/* List */}
            <div className="space-y-3">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="relative aspect-[16/5]">
                            <Image src={banner.image_url} alt={banner.title || ""} fill className="object-cover" />
                        </div>
                        <div className="p-3 flex items-center justify-between">
                            <div>
                                {banner.title && <p className="text-sm font-medium">{banner.title}</p>}
                                {banner.subtitle && <p className="text-xs text-gray-400">{banner.subtitle}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleActive(banner.id, banner.is_active)} className={`text-xs font-medium px-2 py-1 rounded-full ${banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {banner.is_active ? "Aktif" : "Pasif"}
                                </button>
                                <button onClick={() => deleteBanner(banner.id)} className="text-xs text-danger font-medium px-2 py-1">Sil</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
