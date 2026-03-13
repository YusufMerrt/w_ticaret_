"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { items, total, clearCart, isReady } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });
    const router = useRouter();

    // Pre-fill form from profile if user is logged in
    useEffect(() => {
        const loadProfile = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data: profileData } = await supabase
                    .from("user_profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profileData) {
                    setForm({
                        name: profileData.name || "",
                        email: profileData.email || "",
                        phone: profileData.phone || "",
                        address: profileData.address || "",
                        city: profileData.city || "",
                        postalCode: profileData.postal_code || "",
                    });
                }
            }
        };
        loadProfile();
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (isReady && items.length === 0) {
            router.push("/cart");
        }
    }, [isReady, items.length, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Create order — works for both guests and logged-in users
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user?.id || null,
                customer_name: form.name,
                customer_email: form.email,
                customer_phone: form.phone,
                shipping_address: form.address,
                shipping_city: form.city,
                shipping_postal_code: form.postalCode,
                total_price: total,
                status: "pending",
            })
            .select()
            .single();

        if (orderError || !order) {
            alert("Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
            setSubmitting(false);
            return;
        }

        // Create order items
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price: item.product_discount_price || item.product_price,
        }));

        await supabase.from("order_items").insert(orderItems);

        // Update stock
        for (const item of items) {
            await supabase.rpc("decrement_stock" as never, {
                p_product_id: item.product_id,
                p_size: item.size,
                p_quantity: item.quantity,
            } as never);
        }

        // Clear localStorage cart
        clearCart();

        // If logged in, also clear DB cart and update profile
        if (user) {
            await supabase.from("cart_items").delete().eq("user_id", user.id);
            await supabase
                .from("user_profiles")
                .update({
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    postal_code: form.postalCode,
                })
                .eq("id", user.id);
        }

        router.push(`/orders/${order.id}?success=true`);
    };

    if (!isReady || items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-16 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 animate-fade-in">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-6 tracking-wide">
                Sipariş Oluştur
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="md:grid md:grid-cols-2 md:gap-10">
                    {/* Shipping Info */}
                    <div>
                        <h2 className="font-body text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">
                            Teslimat Bilgileri
                        </h2>
                        <div className="space-y-3 mb-6">
                            <input
                                type="text"
                                required
                                placeholder="Ad Soyad"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                            />
                            <input
                                type="email"
                                required
                                placeholder="E-posta"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                            />
                            <input
                                type="tel"
                                required
                                placeholder="Telefon"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                            />
                            <textarea
                                required
                                placeholder="Adres"
                                rows={3}
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted resize-none transition-all duration-300"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Şehir"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Posta Kodu"
                                    value={form.postalCode}
                                    onChange={(e) =>
                                        setForm({ ...form, postalCode: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-surface-warm/60 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h2 className="font-body text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">
                            Sipariş Özeti
                        </h2>
                        <div className="bg-surface rounded-2xl p-5 mb-5 border border-surface-warm/40">
                            <div className="space-y-3.5 mb-5">
                                {items.map((item) => {
                                    const price =
                                        item.product_discount_price || item.product_price;
                                    return (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="w-12 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
                                                {item.product_image && (
                                                    <Image
                                                        src={item.product_image}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-display text-sm font-medium line-clamp-1 text-primary">
                                                    {item.product_name}
                                                </p>
                                                <p className="font-body text-xs text-muted">
                                                    {item.size} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-body text-sm font-semibold text-primary">
                                                {(price * item.quantity).toLocaleString("tr-TR")} ₺
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <hr className="border-surface-warm/60 mb-3" />
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-body text-muted">Kargo</span>
                                <span className="font-body text-success font-medium">Ücretsiz</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="font-display text-lg font-semibold text-primary">Toplam</span>
                                <span className="font-display text-xl font-semibold text-accent">
                                    {total.toLocaleString("tr-TR")} ₺
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-body font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98]"
                        >
                            {submitting ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
                        </button>

                        <p className="font-body text-xs text-muted text-center mt-4">
                            * iyzico ödeme entegrasyonu yakında eklenecektir.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
