import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase
        .from("categories")
        .select("*, products:products(count)")
        .order("sort_order");

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-primary tracking-wide">
                    Kategoriler
                </h1>
                <div className="w-12 h-[2px] bg-gradient-to-r from-accent to-accent-light mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-grid">
                {categories?.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/search?category=${cat.id}`}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-surface-dark to-surface-warm border border-surface-warm/60 hover:border-accent/30 transition-all duration-400 card-lift"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <h2 className="font-display text-lg md:text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 tracking-wide">
                                {cat.name}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
