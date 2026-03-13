"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import { useCart } from "@/context/CartContext";
import type {
    Product,
    ProductImage,
    ProductSize,
    Category,
    Review,
} from "@/types/database";

interface Props {
    product: Product & {
        images: ProductImage[];
        sizes: ProductSize[];
        category: Category;
        reviews: Review[];
    };
    similarProducts: (Product & { images: ProductImage[] })[];
}

export default function ProductDetailClient({
    product,
    similarProducts,
}: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { addItem } = useCart();

    const hasDiscount =
        product.discount_price && product.discount_price < product.price;
    const displayPrice = hasDiscount ? product.discount_price! : product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.discount_price! / product.price) * 100)
        : 0;

    const avgRating =
        product.reviews.length > 0
            ? (
                product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                product.reviews.length
            ).toFixed(1)
            : null;

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError("Lütfen beden seçin");
            return;
        }

        setError("");

        addItem({
            product_id: product.id,
            size: selectedSize,
            quantity,
            product_name: product.name,
            product_slug: product.slug,
            product_price: product.price,
            product_discount_price: product.discount_price,
            product_image: product.images?.[0]?.image_url || null,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="md:grid md:grid-cols-2 md:gap-10 lg:gap-14 md:p-6 lg:p-8">
                {/* Image Gallery */}
                <div>
                    <div className="relative aspect-[3/4] md:rounded-2xl overflow-hidden bg-surface-dark">
                        {product.images.length > 0 ? (
                            <Image
                                src={product.images[selectedImage]?.image_url}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-surface-warm">
                                <svg
                                    className="w-20 h-20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                        {hasDiscount && (
                            <div className="absolute top-3 left-3 bg-primary text-white text-sm font-body font-semibold px-4 py-1.5 rounded-full tracking-wide">
                                %{discountPercent} İndirim
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-2.5 p-3 md:p-0 md:mt-4 overflow-x-auto hide-scrollbar">
                            {product.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx
                                        ? "border-accent shadow-md shadow-accent/10"
                                        : "border-transparent opacity-50 hover:opacity-90"
                                        }`}
                                >
                                    <Image
                                        src={img.image_url}
                                        alt=""
                                        width={80}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-0 md:py-4">
                    {/* Category */}
                    <p className="font-body text-[11px] text-accent font-semibold uppercase tracking-[0.2em] mb-3">
                        {product.category?.name}
                    </p>

                    {/* Name */}
                    <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-4 leading-tight tracking-wide">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {avgRating && (
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(Number(avgRating))
                                            ? "text-accent fill-accent"
                                            : "text-surface-warm fill-surface-warm"
                                            }`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="font-body text-sm text-muted">
                                {avgRating} ({product.reviews.length} yorum)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="font-display text-3xl font-semibold text-accent tracking-wide">
                            {displayPrice.toLocaleString("tr-TR")} ₺
                        </span>
                        {hasDiscount && (
                            <span className="font-body text-lg text-muted line-through">
                                {product.price.toLocaleString("tr-TR")} ₺
                            </span>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-surface-warm via-accent/20 to-surface-warm mb-6" />

                    {/* Description */}
                    {product.description && (
                        <p className="font-body text-sm text-primary/70 leading-relaxed mb-6">
                            {product.description}
                        </p>
                    )}

                    {/* Size Selection */}
                    <div className="mb-6">
                        <p className="font-body text-sm font-semibold text-primary mb-3 tracking-wide">Beden</p>
                        <div className="flex flex-wrap gap-2.5">
                            {product.sizes.map((sizeOption) => {
                                const outOfStock = sizeOption.stock === 0;
                                return (
                                    <button
                                        key={sizeOption.id}
                                        disabled={outOfStock}
                                        onClick={() => setSelectedSize(sizeOption.size)}
                                        className={`min-w-[52px] h-11 px-4 rounded-xl text-sm font-body font-medium border-2 transition-all duration-300 ${selectedSize === sizeOption.size
                                            ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                                            : outOfStock
                                                ? "bg-surface-dark text-muted/40 border-surface-dark cursor-not-allowed"
                                                : "bg-white text-primary border-surface-warm hover:border-accent/50"
                                            }`}
                                    >
                                        {sizeOption.size}
                                        {outOfStock && (
                                            <span className="block text-[9px] -mt-0.5 font-normal">Tükendi</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {error && (
                            <p className="font-body text-danger text-xs mt-2">{error}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="mb-8">
                        <p className="font-body text-sm font-semibold text-primary mb-3 tracking-wide">Adet</p>
                        <div className="inline-flex items-center border-2 border-surface-warm rounded-xl overflow-hidden">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-11 h-11 flex items-center justify-center font-body hover:bg-surface-dark transition-colors duration-200"
                            >
                                −
                            </button>
                            <span className="w-12 h-11 flex items-center justify-center font-body text-sm font-semibold border-x-2 border-surface-warm">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-11 h-11 flex items-center justify-center font-body hover:bg-surface-dark transition-colors duration-200"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className={`w-full py-4 rounded-xl font-body font-semibold text-white tracking-wide transition-all duration-400 ${added
                            ? "bg-success shadow-lg shadow-success/20"
                            : "bg-primary hover:bg-primary-dark shadow-lg shadow-primary/15 hover:shadow-primary/25 active:scale-[0.98]"
                            }`}
                    >
                        {added ? "✓ Sepete Eklendi" : "Sepete Ekle"}
                    </button>

                    {/* Free Shipping */}
                    <div className="mt-5 flex items-center gap-2.5 font-body text-sm text-muted">
                        <svg
                            className="w-4 h-4 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                        </svg>
                        Ücretsiz Kargo
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
                <section className="px-4 py-8 md:px-8 border-t border-surface-warm/60">
                    <h2 className="font-display text-xl md:text-2xl font-semibold text-primary mb-6 tracking-wide">
                        Yorumlar ({product.reviews.length})
                    </h2>
                    <div className="space-y-4">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="bg-surface rounded-2xl p-5 border border-surface-warm/40">
                                <div className="flex items-center justify-between mb-2.5">
                                    <div>
                                        <p className="font-body text-sm font-semibold text-primary">{review.user_name}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${star <= review.rating
                                                        ? "text-accent fill-accent"
                                                        : "text-surface-warm fill-surface-warm"
                                                        }`}
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="font-body text-xs text-muted">
                                        {new Date(review.created_at).toLocaleDateString("tr-TR")}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="font-body text-sm text-primary/70 leading-relaxed">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="px-4 py-8 md:px-8 border-t border-surface-warm/60">
                    <h2 className="font-display text-xl md:text-2xl font-semibold text-primary mb-6 tracking-wide">
                        Benzer Ürünler
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {similarProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
