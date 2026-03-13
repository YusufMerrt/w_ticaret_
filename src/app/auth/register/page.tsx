"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center px-4">
                <div className="w-full max-w-md animate-smooth-reveal">
                    <div className="text-center mb-10">
                        <h1 className="font-display text-4xl font-semibold text-primary tracking-wide">H&G</h1>
                        <p className="font-body text-[10px] tracking-[0.4em] text-accent uppercase mt-0.5">
                            BUTİK
                        </p>
                    </div>
                    <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-surface-warm/40 p-8 md:p-10 text-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg
                                className="w-8 h-8 text-success"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-primary mb-2 tracking-wide">Kayıt Başarılı!</h2>
                        <p className="font-body text-muted text-sm mb-7">
                            E-posta adresinize bir onay bağlantısı gönderdik. Lütfen
                            e-postanızı kontrol edin.
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block bg-primary hover:bg-primary-dark text-white font-body font-semibold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-primary/10"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8">
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
                    <h2 className="font-display text-2xl font-semibold text-center text-primary mb-7 tracking-wide">Kayıt Ol</h2>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block font-body text-sm font-medium text-primary/70 mb-2">
                                Ad Soyad
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 rounded-xl bg-surface border-2 border-surface-warm/60 focus:bg-white outline-none transition-all duration-300 font-body text-sm text-primary placeholder:text-muted"
                                placeholder="Adınız Soyadınız"
                            />
                        </div>

                        <div>
                            <label className="block font-body text-sm font-medium text-primary/70 mb-2">
                                E-posta
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 rounded-xl bg-surface border-2 border-surface-warm/60 focus:bg-white outline-none transition-all duration-300 font-body text-sm text-primary placeholder:text-muted"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div>
                            <label className="block font-body text-sm font-medium text-primary/70 mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3.5 rounded-xl bg-surface border-2 border-surface-warm/60 focus:bg-white outline-none transition-all duration-300 font-body text-sm text-primary placeholder:text-muted"
                                placeholder="En az 6 karakter"
                            />
                        </div>

                        <div>
                            <label className="block font-body text-sm font-medium text-primary/70 mb-2">
                                Şifre Tekrar
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3.5 rounded-xl bg-surface border-2 border-surface-warm/60 focus:bg-white outline-none transition-all duration-300 font-body text-sm text-primary placeholder:text-muted"
                                placeholder="Şifrenizi tekrar girin"
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
                            className="w-full bg-primary hover:bg-primary-dark text-white font-body font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Kayıt yapılıyor...
                                </span>
                            ) : (
                                "Kayıt Ol"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 font-body text-sm text-muted">
                    Zaten hesabın var mı?{" "}
                    <Link
                        href="/auth/login"
                        className="text-accent font-semibold hover:text-accent-muted transition-colors duration-200"
                    >
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
}
