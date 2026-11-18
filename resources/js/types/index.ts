export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role?: string;
  role_label?: string;
  permissions?: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  menus_count?: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  category?: Category;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string | null;
  image_url: string;
  subcategory: string | null;
  cook_time: number;
  is_available: boolean;
}

export interface CartAddon {
  name: string;
  price: number;
}

export interface CartItem {
  key: string;
  menu_id: number;
  menu: MenuItem;
  quantity: number;
  spice_level: 'Tidak Pedas' | 'Sedang' | 'Pedas';
  addons: CartAddon[];
  unit_price: number;
  subtotal: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  menu_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  spice_level?: string | null;
  addons?: CartAddon[] | null;
}

export interface Order {
  id: number;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total_price: number;
  payment_method: 'qris' | 'transfer';
  delivery_type: 'dine-in' | 'delivery';
  address: string | null;
  city: string | null;
  phone: string;
  notes: string | null;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface PageProps {
  [key: string]: unknown;
  auth: {
    user: User | null;
  };
  cartCount: number;
  deliveryType: 'dine-in' | 'delivery';
  flash: {
    success: string | null;
    error: string | null;
  };
  errors: Record<string, string>;
}
