import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string | null;
          phone: string | null;
          first_name: string | null;
          last_name: string | null;
          address_street: string | null;
          address_city: string | null;
          address_state: string | null;
          address_zip_code: string | null;
          email_notifications: boolean;
          sms_notifications: boolean;
          marketing_emails: boolean;
          member_since: string;
          health_score: number;
          total_orders: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar?: string | null;
          phone?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_zip_code?: string | null;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          marketing_emails?: boolean;
          member_since?: string;
          health_score?: number;
          total_orders?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string | null;
          phone?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_zip_code?: string | null;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          marketing_emails?: boolean;
          member_since?: string;
          health_score?: number;
          total_orders?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          price: number;
          original_price: number | null;
          image: string;
          benefits: string[];
          in_stock: boolean;
          stock_count: number;
          sku: string | null;
          weight: string | null;
          dimensions: string | null;
          shelf_life: string | null;
          tags: string[];
          rating: number;
          review_count: number;
          detailed_description: string | null;
          usage_instructions: string | null;
          warnings: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          price: number;
          original_price?: number | null;
          image: string;
          benefits?: string[];
          in_stock?: boolean;
          stock_count?: number;
          sku?: string | null;
          weight?: string | null;
          dimensions?: string | null;
          shelf_life?: string | null;
          tags?: string[];
          rating?: number;
          review_count?: number;
          detailed_description?: string | null;
          usage_instructions?: string | null;
          warnings?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number;
          original_price?: number | null;
          image?: string;
          benefits?: string[];
          in_stock?: boolean;
          stock_count?: number;
          sku?: string | null;
          weight?: string | null;
          dimensions?: string | null;
          shelf_life?: string | null;
          tags?: string[];
          rating?: number;
          review_count?: number;
          detailed_description?: string | null;
          usage_instructions?: string | null;
          warnings?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          rating: number;
          title: string | null;
          comment: string;
          is_verified: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          user_id: string;
          rating: number;
          title?: string | null;
          comment: string;
          is_verified?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          user_id?: string;
          rating?: number;
          title?: string | null;
          comment?: string;
          is_verified?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total: number;
          tracking_number: string | null;
          order_date: string;
          delivered_date: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          status?: string;
          total: number;
          tracking_number?: string | null;
          order_date?: string;
          delivered_date?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          total?: number;
          tracking_number?: string | null;
          order_date?: string;
          delivered_date?: string | null;
          estimated_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_name: string;
          status: string;
          billing_cycle: string;
          monthly_total: number;
          next_delivery: string | null;
          next_billing: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_name?: string;
          status?: string;
          billing_cycle?: string;
          monthly_total: number;
          next_delivery?: string | null;
          next_billing?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_name?: string;
          status?: string;
          billing_cycle?: string;
          monthly_total?: number;
          next_delivery?: string | null;
          next_billing?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
