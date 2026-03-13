"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Ürünler", icon: "👗" },
    { href: "/admin/orders", label: "Siparişler", icon: "📦" },
    { href: "/admin/categories", label: "Kategoriler", icon: "📁" },
    { href: "/admin/campaigns", label: "Kampanyalar", icon: "🏷️" },
    { href: "/admin/banners", label: "Banner", icon: "🖼️" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden md:flex md:w-60 bg-white border-r border-gray-100 flex-col">
                <div className="p-4 border-b border-gray-100">
                    <Link href="/admin">
                        <h1 className="text-xl font-bold text-primary">H&G</h1>
                        <p className="text-[9px] tracking-[0.2em] text-primary-light uppercase">
                            Admin Panel
                        </p>
                    </Link>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← Mağazaya Dön
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between px-4 h-12">
                    <Link href="/admin" className="font-bold text-primary">
                        H&G Admin
                    </Link>
                    <Link href="/" className="text-xs text-gray-400">
                        ← Mağaza
                    </Link>
                </div>
                <div className="flex overflow-x-auto hide-scrollbar px-2 pb-2 gap-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 pt-24 md:pt-0 overflow-auto">
                <div className="p-4 md:p-6 max-w-6xl">{children}</div>
            </main>
        </div>
    );
}
