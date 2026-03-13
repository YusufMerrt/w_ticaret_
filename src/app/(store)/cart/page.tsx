"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, total, updateQuantity, removeItem, isReady } = useCart();
    const router = useRouter();

    if (!isReady) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-24 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
                <svg
                    className="w-20 h-20 text-surface-warm mx-auto mb-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
                <h2 className="font-display text-xl font-semibold text-primary mb-2 tracking-wide">
                    Sepetiniz Boş
                </h2>
                <p className="font-body text-sm text-muted mb-8">
                    Sepetinize henüz ürün eklemediniz
                </p>
                <Link
                    href="/"
                    className="inline-flex bg-primary hover:bg-primary-dark text-white font-body font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                    Alışverişe Başla
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-8 animate-fade-in">
            <h1 className="font-display text-2xl font-semibold text-primary mb-6 tracking-wide">
                Sepetim <span className="font-body text-base font-normal text-muted">({items.length} ürün)</span>
            </h1>

            <div className="space-y-3 mb-6">
                {items.map((item) => {
                    const price = item.product_discount_price || item.product_price;
                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-surface-warm/60 p-4 flex gap-4 animate-fade-in"
                        >
                            {/* Image */}
                            <Link
                                href={`/product/${item.product_slug}`}
                                className="flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-surface-dark relative"
                            >
                                {item.product_image ? (
                                    <Image
                                        src={item.product_image}
                                        alt={item.product_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-surface-warm">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/product/${item.product_slug}`}
                                    className="font-display text-[15px] font-medium text-primary line-clamp-1 hover:text-accent transition-colors duration-200"
                                >
                                    {item.product_name}
                                </Link>
                                <p className="font-body text-xs text-muted mt-0.5">
                                    Beden: {item.size}
                                </p>
                                <p className="font-body text-sm font-semibold text-accent mt-1.5">
                                    {price.toLocaleString("tr-TR")} ₺
                                </p>

                                <div className="flex items-center justify-between mt-2.5">
                                    {/* Quantity */}
                                    <div className="inline-flex items-center border-2 border-surface-warm rounded-lg overflow-hidden">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                            className="w-7 h-7 flex items-center justify-center text-xs font-body hover:bg-surface-dark transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-7 h-7 flex items-center justify-center text-xs font-body font-semibold border-x-2 border-surface-warm">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                            className="w-7 h-7 flex items-center justify-center text-xs font-body hover:bg-surface-dark transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-muted hover:text-danger transition-colors duration-200 p-1.5"
                                        aria-label="Sil"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-surface-warm/60 p-5 sticky bottom-16 md:bottom-4 shadow-lg shadow-primary/5">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="font-body text-sm text-muted">Ara Toplam</span>
                    <span className="font-body text-sm font-medium text-primary">
                        {total.toLocaleString("tr-TR")} ₺
                    </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-sm text-muted">Kargo</span>
                    <span className="font-body text-sm font-medium text-success">Ücretsiz</span>
                </div>
                <hr className="border-surface-warm/60 mb-3" />
                <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-lg font-semibold text-primary">Toplam</span>
                    <span className="font-display text-xl font-semibold text-accent">
                        {total.toLocaleString("tr-TR")} ₺
                    </span>
                </div>
                <Link
                    href="/checkout"
                    className="block w-full bg-primary hover:bg-primary-dark text-white font-body font-semibold py-3.5 rounded-xl text-center transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                    Ödemeye Geç
                </Link>
            </div>
        </div>
    );
}
