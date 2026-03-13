import { createClient } from "@/lib/supabase/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
    const supabase = await createClient();

    // Fetch categories
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");

    // Fetch products with images
    const { data: products } = await supabase
        .from("products")
        .select(`
      *,
      images:product_images(*),
      sizes:product_sizes(*)
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

    // Fetch banners
    const { data: banners } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

    return (
        <HomeClient
            categories={categories || []}
            products={products || []}
            banners={banners || []}
        />
    );
}
