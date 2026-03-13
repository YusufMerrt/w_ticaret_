"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-smooth-reveal">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block group">
                        <h1 className="font-display text-4xl font-semibold text-primary tracking-wide">H&G</h1>
                        <p className="font-body text-[10px] tracking-[0.4em] text-accent uppercase mt-0.5 transition-colors group-hover:text-accent-light">
                            BUTİK
                        </p>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-surface-warm/40 p-8 md:p-10">
                    {sent ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg
                                    className="w-8 h-8 text-accent"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h2 className="font-display text-2xl font-semibold text-primary mb-2 tracking-wide">E-posta Gönderildi</h2>
                            <p className="font-body text-muted text-sm mb-7">
                                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                            </p>
                            <Link
                                href="/auth/login"
                                className="font-body text-accent font-semibold hover:text-accent-muted transition-colors text-sm"
                            >
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="font-display text-2xl font-semibold text-center text-primary mb-2 tracking-wide">
                                Şifreni Sıfırla
                            </h2>
                            <p className="font-body text-muted text-sm text-center mb-7">
                                E-posta adresinizi girin, size bir sıfırlama bağlantısı
                                gönderelim.
                            </p>

                            <form onSubmit={handleReset} className="space-y-5">
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl bg-surface border-2 border-surface-warm/60 focus:bg-white outline-none transition-all duration-300 font-body text-sm text-primary placeholder:text-muted"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-danger/5 text-danger font-body text-sm px-4 py-3 rounded-xl border border-danger/10">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-body font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98]"
                                >
                                    {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center mt-8 font-body text-sm text-muted">
                    <Link
                        href="/auth/login"
                        className="text-accent font-semibold hover:text-accent-muted transition-colors duration-200"
                    >
                        ← Giriş sayfasına dön
                    </Link>
                </p>
            </div>
        </div>
    );
}
