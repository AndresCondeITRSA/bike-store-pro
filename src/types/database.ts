export type UserRole = "client" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      bikes: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: "mountain" | "road" | "urban" | "electric";
          in_stock: boolean;
          stock: number;
          frame: string;
          wheels: string;
          gears: string;
          brakes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: "mountain" | "road" | "urban" | "electric";
          in_stock?: boolean;
          stock?: number;
          frame: string;
          wheels: string;
          gears: string;
          brakes: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: "mountain" | "road" | "urban" | "electric";
          in_stock?: boolean;
          stock?: number;
          frame?: string;
          wheels?: string;
          gears?: string;
          brakes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "confirmed" | "shipped" | "delivered";
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered";
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered";
          total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          bike_id: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          bike_id: string;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          bike_id?: string;
          quantity?: number;
          price?: number;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          bike_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bike_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bike_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
