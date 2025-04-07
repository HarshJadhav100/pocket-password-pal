
import { supabase } from "@/integrations/supabase/client";
import { PasswordData } from "@/components/passwords/PasswordForm";
import { PasswordEntry } from "@/utils/demoData";
import { Tables } from "@/integrations/supabase/types";

type PasswordEntryRow = Tables<"password_entries">;

// Helper function to convert DB row to PasswordEntry
const mapToPasswordEntry = (row: PasswordEntryRow): PasswordEntry => ({
  id: row.id,
  title: row.title,
  username: row.username,
  password: row.password,
  url: row.url || "",
  notes: row.notes || "",
  favorite: Boolean(row.favorite) || false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  category: row.category || "",
  lastUsed: row.last_used || null,
});

// Fetch all passwords for the current user
export const fetchPasswords = async (): Promise<PasswordEntry[]> => {
  const { data, error } = await supabase
    .from("password_entries")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching passwords:", error);
    throw error;
  }
  
  return (data || []).map(mapToPasswordEntry);
};

// Add a new password
export const addPassword = async (passwordData: PasswordData): Promise<PasswordEntry> => {
  const { title, username, password, url, notes } = passwordData;
  
  // Get the current user
  const { data: sessionData } = await supabase.auth.getSession();
  const user_id = sessionData.session?.user.id;
  
  if (!user_id) {
    throw new Error("You must be logged in to add passwords");
  }
  
  const { data, error } = await supabase
    .from("password_entries")
    .insert([
      {
        title,
        username,
        password,
        url,
        notes,
        user_id,
        last_used: new Date().toISOString(),
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding password:", error);
    throw error;
  }
  
  return mapToPasswordEntry(data);
};

// Update an existing password
export const updatePassword = async (id: string, passwordData: PasswordData): Promise<PasswordEntry> => {
  const { title, username, password, url, notes } = passwordData;
  
  const { data, error } = await supabase
    .from("password_entries")
    .update({
      title,
      username,
      password,
      url,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating password:", error);
    throw error;
  }
  
  return mapToPasswordEntry(data);
};

// Delete a password
export const deletePassword = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("password_entries")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
};

// Mark a password as used (updates last_used timestamp)
export const markPasswordAsUsed = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("password_entries")
    .update({
      last_used: new Date().toISOString()
    })
    .eq("id", id);
  
  if (error) {
    console.error("Error marking password as used:", error);
    throw error;
  }
};
