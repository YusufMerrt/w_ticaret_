"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types/database";

const statusOptions = [
    { value: "pending", label: "Sipariş Alındı", color: "bg-yellow-100 text-yellow-700" },
    { value: "preparing", label: "Hazırlanıyor", color: "bg-blue-100 text-blue-700" },
    { value: "shipped", label: "Kargoya Verildi", color: "bg-purple-100 text-purple-700" },
    { value: "delivered", label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
    { value: "cancelled", label: "İptal Edildi", color: "bg-red-100 text-red-700" },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);

    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
                setOrders(data || []);
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const supabase = createClient();
        await supabase.from("orders").update({ status }).eq("id", id);
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: status as Order["status"] } : o))
        );
    };

    const viewDetails = async (id: string) => {
        if (selectedOrder === id) {
            setSelectedOrder(null);
            return;
        }
        const supabase = createClient();
        const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
        setOrderItems(data || []);
        setSelectedOrder(id);
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
            <h1 className="text-2xl font-bold mb-6">Siparişler ({orders.length})</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-400">Henüz sipariş yok</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const statusInfo =
                            statusOptions.find((s) => s.value === order.status) ||
                            statusOptions[0];
                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium">{order.customer_name}</p>
                                            <p className="text-xs text-gray-400">
                                                #{order.id.slice(0, 8).toUpperCase()} •{" "}
                                                {new Date(order.created_at).toLocaleDateString("tr-TR")}
                                            </p>
                                        </div>
                                        <p className="font-bold text-primary">
                                            {Number(order.total_price).toLocaleString("tr-TR")} ₺
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusInfo.color}`}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={() => viewDetails(order.id)}
                                            className="text-xs text-primary font-medium"
                                        >
                                            {selectedOrder === order.id ? "Gizle" : "Detay"}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {selectedOrder === order.id && (
                                    <div className="border-t border-gray-50 p-4 bg-gray-50 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div>
                                                <p className="text-xs text-gray-400">Telefon</p>
                                                <p>{order.customer_phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">E-posta</p>
                                                <p>{order.customer_email}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-400">Adres</p>
                                                <p>
                                                    {order.shipping_address}, {order.shipping_city}{" "}
                                                    {order.shipping_postal_code}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">Ürünler</p>
                                        <div className="space-y-1">
                                            {orderItems.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span>
                                                        {item.product_name} ({item.size}) ×{item.quantity}
                                                    </span>
                                                    <span className="font-medium">
                                                        {(Number(item.price) * item.quantity).toLocaleString(
                                                            "tr-TR"
                                                        )}{" "}
                                                        ₺
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
