export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      prescriptions: {
        Row: {
          address: string;
          created_at: string;
          files: Json;
          id: string;
          note: string | null;
          phone: string;
          preferred_date: string;
          preferred_time_slot: string;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address: string;
          created_at?: string;
          files: Json;
          id?: string;
          note?: string | null;
          phone: string;
          preferred_date: string;
          preferred_time_slot: string;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string;
          created_at?: string;
          files?: Json;
          id?: string;
          note?: string | null;
          phone?: string;
          preferred_date?: string;
          preferred_time_slot?: string;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          dob: string | null;
          email: string | null;
          id: string;
          license: string | null;
          name: string | null;
          phone: string | null;
          registration: string | null;
          updated_at: string | null;
          usertype: string | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          dob?: string | null;
          email?: string | null;
          id: string;
          license?: string | null;
          name?: string | null;
          phone?: string | null;
          registration?: string | null;
          updated_at?: string | null;
          usertype?: string | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          dob?: string | null;
          email?: string | null;
          id?: string;
          license?: string | null;
          name?: string | null;
          phone?: string | null;
          registration?: string | null;
          updated_at?: string | null;
          usertype?: string | null;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          accepted_at: string | null;
          created_at: string;
          delivery_fee: number;
          estimated_delivery: string | null;
          id: string;
          items: Json;
          notes: string | null;
          pharmacy_id: string;
          prescription_id: string;
          rejected_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string;
          delivery_fee: number;
          estimated_delivery?: string | null;
          id?: string;
          items: Json;
          notes?: string | null;
          pharmacy_id: string;
          prescription_id: string;
          rejected_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string;
          delivery_fee?: number;
          estimated_delivery?: string | null;
          id?: string;
          items?: Json;
          notes?: string | null;
          pharmacy_id?: string;
          prescription_id?: string;
          rejected_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_prescription_id_fkey";
            columns: ["prescription_id"];
            isOneToOne: false;
            referencedRelation: "prescriptions";
            referencedColumns: ["id"];
          }
        ];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permission"];
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      custom_access_token_hook: {
        Args: { event: Json };
        Returns: Json;
      };
    };
    Enums: {
      app_permission: "channels.delete" | "messages.delete";
      app_role: "user" | "pharmacy";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_permission: ["channels.delete", "messages.delete"],
      app_role: ["user", "pharmacy"],
    },
  },
} as const;
