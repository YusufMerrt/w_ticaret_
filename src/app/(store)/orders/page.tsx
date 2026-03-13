"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types/database";

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Sipariş Alındı", color: "bg-warning/10 text-warning" },
    preparing: { label: "Hazırlanıyor", color: "bg-accent/10 text-accent" },
    shipped: { label: "Kargoya Verildi", color: "bg-accent-muted/10 text-accent-muted" },
    delivered: { label: "Teslim Edildi", color: "bg-success/10 text-success" },
    cancelled: { label: "İptal Edildi", color: "bg-danger/10 text-danger" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login?redirect=/orders");
                return;
            }

            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            setOrders(data || []);
            setLoading(false);
        };
        load();
    }, [router]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-20 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-8 animate-fade-in">
            <h1 className="font-display text-2xl font-semibold text-primary mb-6 tracking-wide">Siparişlerim</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <svg className="w-20 h-20 text-surface-warm mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="font-body text-muted text-sm">Henüz siparişiniz yok</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const status = statusLabels[order.status] || statusLabels.pending;
                        return (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block bg-white rounded-2xl border border-surface-warm/60 p-5 hover:border-accent/30 transition-all duration-300 card-lift"
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="font-body text-xs text-muted">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                    <span className={`font-body text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-display text-base font-semibold text-accent">
                                        {Number(order.total_price).toLocaleString("tr-TR")} ₺
                                    </span>
                                    <span className="font-body text-xs text-muted">
                                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
