"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        href: "/",
        label: "Ana Sayfa",
        icon: (active: boolean) => (
            <svg
                className={`w-5 h-5 transition-colors duration-200 ${active ? "text-accent" : "text-muted"}`}
                fill={active ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 0 : 1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        ),
    },
    {
        href: "/categories",
        label: "Kategoriler",
        icon: (active: boolean) => (
            <svg
                className={`w-5 h-5 transition-colors duration-200 ${active ? "text-accent" : "text-muted"}`}
                fill={active ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 0 : 1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
            </svg>
        ),
    },
    {
        href: "/favorites",
        label: "Favoriler",
        icon: (active: boolean) => (
            <svg
                className={`w-5 h-5 transition-colors duration-200 ${active ? "text-accent" : "text-muted"}`}
                fill={active ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 0 : 1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        ),
    },
    {
        href: "/profile",
        label: "Profil",
        icon: (active: boolean) => (
            <svg
                className={`w-5 h-5 transition-colors duration-200 ${active ? "text-accent" : "text-muted"}`}
                fill={active ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 0 : 1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-accent/8 safe-area-bottom">
            <div className="flex items-center justify-around h-[60px]">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-0.5 w-16 py-1"
                        >
                            {item.icon(isActive)}
                            <span
                                className={`text-[10px] font-body transition-colors duration-200 ${isActive
                                    ? "text-accent font-medium"
                                    : "text-muted"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
