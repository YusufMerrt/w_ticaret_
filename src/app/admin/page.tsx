import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [
        { count: productCount },
        { count: orderCount },
        { data: recentOrders },
        { count: userCount },
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    ]);

    // Calculate revenue
    const { data: allOrders } = await supabase
        .from("orders")
        .select("total_price")
        .neq("status", "cancelled");

    const totalRevenue = allOrders?.reduce(
        (sum, o) => sum + Number(o.total_price),
        0
    ) || 0;

    const stats = [
        { label: "Toplam Ürün", value: productCount || 0, icon: "👗", color: "bg-blue-50 text-blue-600" },
        { label: "Toplam Sipariş", value: orderCount || 0, icon: "📦", color: "bg-purple-50 text-purple-600" },
        { label: "Müşteri Sayısı", value: userCount || 0, icon: "👤", color: "bg-green-50 text-green-600" },
        { label: "Toplam Gelir", value: `${totalRevenue.toLocaleString("tr-TR")} ₺`, icon: "💰", color: "bg-yellow-50 text-yellow-600" },
    ];

    const statusLabels: Record<string, string> = {
        pending: "Bekliyor",
        preparing: "Hazırlanıyor",
        shipped: "Kargoda",
        delivered: "Teslim",
        cancelled: "İptal",
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-gray-100 p-4"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h2 className="font-semibold mb-3">Son Siparişler</h2>
                {!recentOrders || recentOrders.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">
                        Henüz sipariş yok
                    </p>
                ) : (
                    <div className="space-y-2">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {order.customer_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-primary">
                                        {Number(order.total_price).toLocaleString("tr-TR")} ₺
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {statusLabels[order.status] || order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
