"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import type { Order, OrderItem } from "@/types/database";

const statusLabels: Record<string, { label: string; color: string; step: number }> = {
    pending: { label: "Sipariş Alındı", color: "bg-accent", step: 1 },
    preparing: { label: "Hazırlanıyor", color: "bg-accent", step: 2 },
    shipped: { label: "Kargoya Verildi", color: "bg-accent", step: 3 },
    delivered: { label: "Teslim Edildi", color: "bg-success", step: 4 },
    cancelled: { label: "İptal Edildi", color: "bg-danger", step: 0 },
};

export default function OrderDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8"><div className="skeleton h-40 rounded-2xl" /></div>}>
            <OrderDetailPage params={params} />
        </Suspense>
    );
}

function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: orderData } = await supabase
                .from("orders")
                .select("*")
                .eq("id", id)
                .single();

            const { data: itemsData } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", id);

            setOrder(orderData);
            setItems(itemsData || []);
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="skeleton h-40 rounded-2xl" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <p className="font-body text-muted">Sipariş bulunamadı</p>
            </div>
        );
    }

    const status = statusLabels[order.status] || statusLabels.pending;

    return (
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-8 animate-fade-in">
            {/* Success banner */}
            {isSuccess && (
                <div className="bg-success/5 border border-success/15 rounded-2xl p-5 mb-6 animate-smooth-reveal text-center">
                    <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-primary mb-1 tracking-wide">Siparişiniz Alındı!</h2>
                    <p className="font-body text-sm text-muted">Siparişiniz en kısa sürede hazırlanacaktır.</p>
                </div>
            )}

            <h1 className="font-display text-xl md:text-2xl font-semibold text-primary mb-1 tracking-wide">
                Sipariş #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="font-body text-sm text-muted mb-6">
                {new Date(order.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>

            {/* Status Progress */}
            {order.status !== "cancelled" && (
                <div className="bg-white rounded-2xl border border-surface-warm/60 p-5 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-all ${step <= status.step
                                        ? `${status.color} text-white`
                                        : "bg-surface-dark text-muted"
                                        }`}
                                >
                                    {step <= status.step ? "✓" : step}
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-1.5 rounded-full ${step < status.step ? status.color : "bg-surface-dark"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-body text-[10px] text-muted">
                        <span>Alındı</span>
                        <span>Hazırlanıyor</span>
                        <span>Kargoda</span>
                        <span>Teslim</span>
                    </div>
                </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl border border-surface-warm/60 p-5 mb-4">
                <h2 className="font-body text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">Ürünler</h2>
                <div className="space-y-3.5">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <div>
                                <p className="font-display font-medium text-primary">{item.product_name}</p>
                                <p className="font-body text-xs text-muted mt-0.5">
                                    Beden: {item.size} × {item.quantity}
                                </p>
                            </div>
                            <p className="font-body font-semibold text-primary">
                                {(Number(item.price) * item.quantity).toLocaleString("tr-TR")} ₺
                            </p>
                        </div>
                    ))}
                </div>
                <hr className="my-4 border-surface-warm/60" />
                <div className="flex justify-between items-baseline">
                    <span className="font-display text-lg font-semibold text-primary">Toplam</span>
                    <span className="font-display text-xl font-semibold text-accent">
                        {Number(order.total_price).toLocaleString("tr-TR")} ₺
                    </span>
                </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-surface-warm/60 p-5">
                <h2 className="font-body text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">Teslimat Bilgileri</h2>
                <div className="font-body text-sm text-primary/70 space-y-1.5">
                    <p>{order.customer_name}</p>
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_city} {order.shipping_postal_code}</p>
                    <p>{order.customer_phone}</p>
                </div>
            </div>
        </div>
    );
}
