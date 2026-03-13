import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
        .from("products")
        .select("name, description, price")
        .eq("slug", slug)
        .single();

    if (!product) return { title: "Ürün Bulunamadı" };

    return {
        title: product.name,
        description:
            product.description ||
            `${product.name} - ${product.price.toLocaleString("tr-TR")} ₺`,
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select(
            `
      *,
      images:product_images(*),
      sizes:product_sizes(*),
      category:categories(*),
      reviews(*)
    `
        )
        .eq("slug", slug)
        .single();

    if (!product) notFound();

    // Fetch similar products
    const { data: similarProducts } = await supabase
        .from("products")
        .select(`*, images:product_images(*)`)
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .eq("is_active", true)
        .limit(4);

    return (
        <ProductDetailClient
            product={product}
            similarProducts={similarProducts || []}
        />
    );
}
