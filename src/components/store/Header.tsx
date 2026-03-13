"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { User } from "@supabase/supabase-js";

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { itemCount } = useCart();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setMenuOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <>
            <header className="sticky top-0 z-50 glass border-b border-accent/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16 md:h-[72px]">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <h1 className="font-display text-2xl md:text-[28px] font-semibold tracking-wide text-primary">
                                H&G
                            </h1>
                            <p className="font-body text-[8px] md:text-[9px] tracking-[0.35em] text-accent uppercase -mt-1 transition-colors group-hover:text-accent-light">
                                BUTİK
                            </p>
                        </Link>

                        {/* Desktop Search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden md:flex flex-1 max-w-lg mx-10"
                        >
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ürün ara..."
                                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-dark/60 border border-surface-warm/80 focus:bg-white outline-none text-sm font-body text-primary placeholder:text-muted transition-all duration-300"
                                />
                                <svg
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="md:hidden p-2.5 hover:bg-surface-dark rounded-full transition-colors duration-200"
                                aria-label="Arama"
                            >
                                <svg
                                    className="w-[18px] h-[18px] text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            {/* Favorites */}
                            <Link
                                href="/favorites"
                                className="hidden md:flex p-2.5 hover:bg-surface-dark rounded-full transition-colors duration-200"
                                aria-label="Favoriler"
                            >
                                <svg
                                    className="w-[18px] h-[18px] text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative p-2.5 hover:bg-surface-dark rounded-full transition-colors duration-200"
                                aria-label="Sepet"
                            >
                                <svg
                                    className="w-[18px] h-[18px] text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="hidden md:flex p-2.5 hover:bg-surface-dark rounded-full transition-colors duration-200"
                                        aria-label="Profil"
                                    >
                                        <svg
                                            className="w-[18px] h-[18px] text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </button>

                                    {menuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-xl shadow-primary/8 border border-surface-warm py-2 z-50 animate-fade-in">
                                                <Link
                                                    href="/orders"
                                                    className="block px-5 py-3 text-sm font-body text-primary hover:bg-surface-dark transition-colors"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Siparişlerim
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="block px-5 py-3 text-sm font-body text-primary hover:bg-surface-dark transition-colors"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Profilim
                                                </Link>
                                                <hr className="my-1.5 border-surface-warm" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-5 py-3 text-sm font-body text-danger hover:bg-red-50/60 transition-colors"
                                                >
                                                    Çıkış Yap
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="hidden md:inline-flex text-sm font-body font-medium text-accent hover:text-accent-muted transition-colors duration-200 px-4 py-2"
                                >
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {searchOpen && (
                    <div className="md:hidden border-t border-surface-warm/60 p-3 animate-fade-in bg-surface/80">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ürün ara..."
                                autoFocus
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-surface-warm focus:border-accent outline-none text-sm font-body"
                            />
                            <svg
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </form>
                    </div>
                )}
            </header>
        </>
    );
}
