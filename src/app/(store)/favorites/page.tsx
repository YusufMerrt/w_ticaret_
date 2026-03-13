"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import type { Product, ProductImage } from "@/types/database";

type ProductFull = Product & { images: ProductImage[] };

export default function FavoritesPage() {
    const [products, setProducts] = useState<ProductFull[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth/login?redirect=/favorites");
                return;
            }

            const { data: favs } = await supabase
                .from("favorites")
                .select(`product_id, product:products(*, images:product_images(*))`)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (favs) {
                const prods = favs.map((f: any) => f.product).filter(Boolean);
                setProducts(prods);
                setFavoriteIds(new Set(favs.map((f) => f.product_id)));
            }
            setLoading(false);
        };
        load();
    }, [router]);

    const handleFavoriteToggle = async (productId: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newFavs = new Set(favoriteIds);
        if (newFavs.has(productId)) {
            newFavs.delete(productId);
            await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        }
        setFavoriteIds(newFavs);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 animate-fade-in">
            <h1 className="font-display text-2xl font-semibold text-primary mb-6 tracking-wide">
                Favorilerim
            </h1>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <svg className="w-20 h-20 text-surface-warm mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="font-body text-muted text-sm">Henüz favori ürün eklemediniz</p>
                </div>
            ) : (
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
            )}
        </div>
    );
}
