"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/store/ProductCard";
import type { Product, ProductImage, Category } from "@/types/database";

type ProductFull = Product & { images: ProductImage[] };

export default function SearchPageWrapper() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}</div></div>}>
            <SearchPage />
        </Suspense>
    );
}

function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category") || "";

    const [products, setProducts] = useState<ProductFull[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedSize, setSelectedSize] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        supabase.from("categories").select("*").order("sort_order").then(({ data }) => {
            setCategories(data || []);
        });
    }, []);

    useEffect(() => {
        const search = async () => {
            setLoading(true);
            const supabase = createClient();
            let q = supabase
                .from("products")
                .select(`*, images:product_images(*)`)
                .eq("is_active", true);

            if (query) {
                q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
            }
            if (selectedCategory) {
                q = q.eq("category_id", selectedCategory);
            }
            q = q.gte("price", priceRange[0]).lte("price", priceRange[1]);
            q = q.order("created_at", { ascending: false }).limit(40);

            const { data } = await q;
            setProducts(data || []);
            setLoading(false);
        };
        search();
    }, [query, selectedCategory, priceRange]);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 animate-fade-in">
            <div className="md:flex md:gap-8">
                {/* Filters sidebar */}
                <div className="md:w-60 flex-shrink-0 mb-6 md:mb-0">
                    <h2 className="font-body text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">
                        Filtreler
                    </h2>

                    {/* Categories */}
                    <div className="mb-5">
                        <p className="font-body text-xs font-medium text-muted mb-2.5">Kategori</p>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory("")}
                                className={`block w-full text-left font-body text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${!selectedCategory ? "bg-accent/10 text-accent font-medium" : "text-primary/60 hover:bg-surface-dark"
                                    }`}
                            >
                                Tümü
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`block w-full text-left font-body text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${selectedCategory === cat.id ? "bg-accent/10 text-accent font-medium" : "text-primary/60 hover:bg-surface-dark"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-5">
                        <p className="font-body text-xs font-medium text-muted mb-2.5">Fiyat Aralığı</p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange[0] || ""}
                                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted outline-none transition-all duration-300"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange[1] || ""}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-surface-warm/60 font-body text-sm text-primary placeholder:text-muted outline-none transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1">
                    {query && (
                        <p className="font-body text-sm text-muted mb-4">
                            &quot;{query}&quot; için <span className="font-semibold text-primary">{products.length}</span> sonuç
                        </p>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-body text-muted text-sm">Sonuç bulunamadı</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 stagger-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
