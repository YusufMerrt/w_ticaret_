// TypeScript types for the H&G Butik database schema
// These will be auto-generated from Supabase later, but we define them
// manually first for development.

export interface Category {
    id: string
    name: string
    slug: string
    image_url: string | null
    sort_order: number
    created_at: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    discount_price: number | null
    category_id: string
    is_active: boolean
    created_at: string
    // Joined fields
    category?: Category
    images?: ProductImage[]
    sizes?: ProductSize[]
    reviews?: Review[]
}

export interface ProductImage {
    id: string
    product_id: string
    image_url: string
    sort_order: number
}

export interface ProductSize {
    id: string
    product_id: string
    size: string
    stock: number
}

export interface UserProfile {
    id: string
    email: string
    name: string | null
    phone: string | null
    address: string | null
    city: string | null
    postal_code: string | null
    role: 'customer' | 'admin'
    created_at: string
}

export interface Favorite {
    id: string
    user_id: string
    product_id: string
    created_at: string
    // Joined
    product?: Product
}

export interface CartItem {
    id: string
    user_id: string
    product_id: string
    size: string
    quantity: number
    created_at: string
    // Joined
    product?: Product
}

export interface Order {
    id: string
    user_id: string | null
    customer_name: string
    customer_email: string
    customer_phone: string
    shipping_address: string
    shipping_city: string
    shipping_postal_code: string
    total_price: number
    status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
    created_at: string
    // Joined
    items?: OrderItem[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    product_name: string
    size: string
    quantity: number
    price: number
    // Joined
    product?: Product
}

export interface Review {
    id: string
    product_id: string
    user_id: string | null
    user_name: string
    rating: number
    comment: string | null
    created_at: string
}

export interface Campaign {
    id: string
    name: string
    description: string | null
    discount_percentage: number | null
    discount_amount: number | null
    start_date: string
    end_date: string
    is_active: boolean
    created_at: string
}

export interface Banner {
    id: string
    title: string | null
    subtitle: string | null
    image_url: string
    link_url: string | null
    sort_order: number
    is_active: boolean
    created_at: string
}
