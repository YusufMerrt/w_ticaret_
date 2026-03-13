"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product, ProductImage } from "@/types/database";

interface ProductCardProps {
    product: Product & { images: ProductImage[] };
    isFavorite?: boolean;
    onFavoriteToggle?: (productId: string) => void;
}

export default function ProductCard({
    product,
    isFavorite = false,
    onFavoriteToggle,
}: ProductCardProps) {
    const [favorite, setFavorite] = useState(isFavorite);
    const [imageLoaded, setImageLoaded] = useState(false);

    const hasDiscount =
        product.discount_price && product.discount_price < product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.discount_price! / product.price) * 100)
        : 0;
    const displayPrice = hasDiscount ? product.discount_price! : product.price;
    const mainImage = product.images?.[0]?.image_url;

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorite(!favorite);
        onFavoriteToggle?.(product.id);
    };

    return (
        <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-dark mb-3 card-lift">
                {/* Image */}
                {mainImage ? (
                    <>
                        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onLoad={() => setImageLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-surface-warm">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-2.5 left-2.5 bg-primary text-white text-[10px] font-body font-semibold px-2.5 py-1 rounded-full tracking-wide">
                        %{discountPercent}
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-200"
                    aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                >
                    <svg
                        className={`w-[15px] h-[15px] transition-all duration-300 ${favorite ? "text-danger fill-danger scale-110" : "text-muted"
                            }`}
                        viewBox="0 0 24 24"
                        fill={favorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="px-1">
                <h3 className="font-display text-[15px] md:text-base font-medium text-primary line-clamp-2 mb-1.5 leading-snug group-hover:text-accent transition-colors duration-300">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-semibold text-accent">
                        {displayPrice.toLocaleString("tr-TR")} ₺
                    </span>
                    {hasDiscount && (
                        <span className="font-body text-xs text-muted line-through">
                            {product.price.toLocaleString("tr-TR")} ₺
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
