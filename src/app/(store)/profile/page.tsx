"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserProfile } from "@/types/database";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", postal_code: "" });
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/auth/login?redirect=/profile"); return; }

            const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
            if (data) {
                setProfile(data);
                setForm({ name: data.name || "", phone: data.phone || "", address: data.address || "", city: data.city || "", postal_code: data.postal_code || "" });
            }
            setLoading(false);
        };
        load();
    }, [router]);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        const supabase = createClient();
        await supabase.from("user_profiles").update(form).eq("id", profile.id);
        setProfile({ ...profile, ...form });
        setEditing(false);
        setSaving(false);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) return <div className="max-w-md mx-auto px-4 py-8"><div className="skeleton h-48 rounded-2xl" /></div>;

    return (
        <div className="max-w-md mx-auto px-4 py-4 md:py-8 animate-fade-in">
            <h1 className="font-display text-2xl font-semibold text-primary mb-6 tracking-wide">Profilim</h1>

            <div className="bg-white rounded-2xl border border-surface-warm/60 p-5 mb-4">
                <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-13 h-13 rounded-full bg-accent/10 flex items-center justify-center text-accent font-display font-semibold text-xl">
                        {(profile?.name || profile?.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-display text-base font-semibold text-primary">{profile?.name || "İsimsiz"}</p>
                        <p className="font-body text-sm text-muted">{profile?.email}</p>
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-3">
                        <input type="text" placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted focus:bg-white outline-none transition-all duration-300" />
                        <input type="tel" placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted focus:bg-white outline-none transition-all duration-300" />
                        <textarea placeholder="Adres" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted focus:bg-white outline-none resize-none transition-all duration-300" />
                        <div className="grid grid-cols-2 gap-2.5">
                            <input type="text" placeholder="Şehir" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted focus:bg-white outline-none transition-all duration-300" />
                            <input type="text" placeholder="Posta Kodu" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted focus:bg-white outline-none transition-all duration-300" />
                        </div>
                        <div className="flex gap-2.5 pt-1">
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white font-body font-semibold py-3 rounded-xl text-sm disabled:opacity-50 shadow-lg shadow-primary/10 transition-all duration-300 hover:bg-primary-dark">
                                {saving ? "Kaydediliyor..." : "Kaydet"}
                            </button>
                            <button onClick={() => setEditing(false)} className="px-5 py-3 rounded-xl font-body text-sm text-muted hover:bg-surface-dark transition-colors duration-200">
                                İptal
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="w-full font-body text-sm text-accent font-semibold py-2.5 rounded-xl hover:bg-accent/5 transition-colors duration-200">
                        Profili Düzenle
                    </button>
                )}
            </div>

            <div className="space-y-2.5 mb-6">
                <Link href="/orders" className="flex items-center justify-between bg-white rounded-2xl border border-surface-warm/60 p-4.5 hover:border-accent/30 transition-all duration-300">
                    <span className="font-body text-sm font-medium text-primary">Siparişlerim</span>
                    <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/favorites" className="flex items-center justify-between bg-white rounded-2xl border border-surface-warm/60 p-4.5 hover:border-accent/30 transition-all duration-300">
                    <span className="font-body text-sm font-medium text-primary">Favorilerim</span>
                    <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
            </div>

            <button onClick={handleLogout} className="w-full font-body text-sm text-danger font-semibold py-3.5 rounded-2xl border-2 border-danger/20 hover:bg-danger/5 transition-all duration-300">
                Çıkış Yap
            </button>
        </div>
    );
}
