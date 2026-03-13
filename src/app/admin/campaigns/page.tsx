"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Campaign } from "@/types/database";

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "", description: "", discount_percentage: "", discount_amount: "",
        start_date: "", end_date: "",
    });

    const fetchCampaigns = async () => {
        const supabase = createClient();
        const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
        setCampaigns(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchCampaigns(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        await supabase.from("campaigns").insert({
            name: form.name,
            description: form.description || null,
            discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
            discount_amount: form.discount_amount ? parseFloat(form.discount_amount) : null,
            start_date: new Date(form.start_date).toISOString(),
            end_date: new Date(form.end_date).toISOString(),
            is_active: true,
        });
        setForm({ name: "", description: "", discount_percentage: "", discount_amount: "", start_date: "", end_date: "" });
        setShowForm(false);
        fetchCampaigns();
    };

    const toggleActive = async (id: string, current: boolean) => {
        const supabase = createClient();
        await supabase.from("campaigns").update({ is_active: !current }).eq("id", id);
        setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
    };

    const deleteCampaign = async (id: string) => {
        if (!confirm("Kampanyayı silmek istediğinize emin misiniz?")) return;
        const supabase = createClient();
        await supabase.from("campaigns").delete().eq("id", id);
        fetchCampaigns();
    };

    if (loading) return <div className="skeleton h-40 rounded-xl" />;

    return (
        <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Kampanyalar</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors">
                    {showForm ? "İptal" : "+ Yeni Kampanya"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 mb-6 animate-fade-in space-y-3">
                    <input type="text" required placeholder="Kampanya adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                    <input type="text" placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" step="0.01" placeholder="İndirim (%)" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                        <input type="number" step="0.01" placeholder="İndirim (₺)" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Başlangıç</label>
                            <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Bitiş</label>
                            <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">Kaydet</button>
                </form>
            )}

            {campaigns.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-400 text-sm">Henüz kampanya yok</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {campaigns.map((c) => (
                        <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
                                    <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                                        {c.discount_percentage && <span>%{Number(c.discount_percentage)} indirim</span>}
                                        {c.discount_amount && <span>{Number(c.discount_amount)} ₺ indirim</span>}
                                        <span>{new Date(c.start_date).toLocaleDateString("tr-TR")} - {new Date(c.end_date).toLocaleDateString("tr-TR")}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleActive(c.id, c.is_active)} className={`text-xs font-medium px-2 py-1 rounded-full ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {c.is_active ? "Aktif" : "Pasif"}
                                    </button>
                                    <button onClick={() => deleteCampaign(c.id)} className="text-xs text-danger font-medium px-2 py-1">Sil</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
