import Header from "@/components/store/Header";
import BottomNav from "@/components/store/BottomNav";
import CartProviderWrapper from "@/components/store/CartProviderWrapper";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProviderWrapper>
            <Header />
            <main className="min-h-screen pb-16 md:pb-0">{children}</main>
            <BottomNav />
        </CartProviderWrapper>
    );
}
