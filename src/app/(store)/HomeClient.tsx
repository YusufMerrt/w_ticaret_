"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/store/ProductCard";
import type { Category, Product, ProductImage, Banner } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface HomeClientProps {
    categories: Category[];
    products: (Product & { images: ProductImage[] })[];
    banners: Banner[];
}

export default function HomeClient({
    categories,
    products: initialProducts,
    banners,
}: HomeClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState(initialProducts);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [currentBanner, setCurrentBanner] = useState(0);

    // Auto-rotate banners
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    // Load favorites
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return;
            supabase
                .from("favorites")
                .select("product_id")
                .eq("user_id", data.user.id)
                .then(({ data: favs }) => {
                    if (favs) {
                        setFavoriteIds(new Set(favs.map((f) => f.product_id)));
                    }
                });
        });
    }, []);

    // Filter by category
    useEffect(() => {
        if (!selectedCategory) {
            setProducts(initialProducts);
            return;
        }
        const supabase = createClient();
        supabase
            .from("products")
            .select(`*, images:product_images(*), sizes:product_sizes(*)`)
            .eq("is_active", true)
            .eq("category_id", selectedCategory)
            .order("created_at", { ascending: false })
            .limit(20)
            .then(({ data }) => {
                if (data) setProducts(data);
            });
    }, [selectedCategory, initialProducts]);

    const handleFavoriteToggle = async (productId: string) => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = "/auth/login";
            return;
        }

        const newFavs = new Set(favoriteIds);
        if (newFavs.has(productId)) {
            newFavs.delete(productId);
            await supabase
                .from("favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", productId);
        } else {
            newFavs.add(productId);
            await supabase
                .from("favorites")
                .insert({ user_id: user.id, product_id: productId });
        }
        setFavoriteIds(newFavs);
    };

    return (
        <div>
            {/* Banner */}
            {banners.length > 0 && (
                <div className="relative w-full aspect-[16/7] md:aspect-[16/5] bg-surface-dark overflow-hidden">
                    {banners.map((banner, idx) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBanner ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Image
                                src={banner.image_url}
                                alt={banner.title || "Banner"}
                                fill
                                className="object-cover"
                                priority={idx === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                            {(banner.title || banner.subtitle) && (
                                <div className="absolute inset-0 flex items-end">
                                    <div className="p-5 md:p-10 text-white max-w-2xl">
                                        {banner.title && (
                                            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold mb-2 leading-tight tracking-wide">
                                                {banner.title}
                                            </h2>
                                        )}
                                        {banner.subtitle && (
                                            <p className="font-body text-sm md:text-base text-white/80 leading-relaxed">
                                                {banner.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Dots */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentBanner(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBanner
                                        ? "bg-white w-8"
                                        : "bg-white/40 w-1.5 hover:bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Welcome banner if no banners */}
            {banners.length === 0 && (
                <div className="relative bg-primary text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary opacity-90" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(184, 134, 11, 0.15) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 50%, rgba(201, 169, 110, 0.1) 0%, transparent 50%)`
                    }} />
                    <div className="relative px-4 py-12 md:py-20 text-center max-w-3xl mx-auto">
                        <h2 className="font-display text-4xl md:text-6xl font-semibold mb-3 tracking-wide">
                            H&G Butik
                        </h2>
                        <p className="font-body text-sm md:text-base text-white/70 mb-6 tracking-wide">
                            Şık ve modern tesettür giyim koleksiyonu
                        </p>
                        <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-body border border-white/10">
                            <svg className="w-4 h-4 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Ücretsiz Kargo
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-10">
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary tracking-wide">
                        Koleksiyonu Keşfet
                    </h2>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-accent to-accent-light mx-auto mt-3" />
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2 justify-center flex-wrap">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${!selectedCategory
                                ? "bg-primary text-white shadow-md shadow-primary/15"
                                : "bg-surface-dark text-primary/60 hover:bg-surface-warm hover:text-primary"
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${selectedCategory === cat.id
                                    ? "bg-primary text-white shadow-md shadow-primary/15"
                                    : "bg-surface-dark text-primary/60 hover:bg-surface-warm hover:text-primary"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isFavorite={favoriteIds.has(product.id)}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fade-in">
                        <svg
                            className="w-16 h-16 text-surface-warm mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                        <p className="font-body text-muted text-sm">Henüz ürün eklenmemiş</p>
                    </div>
                )}
            </div>
        </div>
    );
}
