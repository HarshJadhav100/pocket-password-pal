import { supabase } from '@/integrations/supabase/client';

// Define PasswordEntry type if not imported from supabase types
export interface PasswordEntry {
  id: string;
  user_id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

// Function to fetch all passwords for the current user
export const fetchPasswords = async (): Promise<PasswordEntry[]> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) throw new Error('No authenticated user found');
  
  const { data, error } = await supabase
    .from('password_entries')
    .select('*')
    .eq('user_id', session.session.user.id);

  if (error) throw error;
  return data || [];
};

// Function to create a new password entry
export const createPassword = async (passwordData: Omit<PasswordEntry, 'id' | 'user_id'>): Promise<PasswordEntry> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) throw new Error('No authenticated user found');
  
  // Ensure url is null if undefined to match database schema expectations
  const dataToInsert = {
    ...passwordData,
    url: passwordData.url || null,
    user_id: session.session.user.id
  };
  
  const { data, error } = await supabase
    .from('password_entries')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Function to update an existing password
export const updatePassword = async (id: string, passwordData: Partial<Omit<PasswordEntry, 'id' | 'user_id'>>): Promise<PasswordEntry> => {
  const { data, error } = await supabase
    .from('password_entries')
    .update(passwordData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Function to delete a password
export const deletePassword = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('password_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Alias functions to match the interface expected by PasswordVault.tsx
export const addPassword = createPassword;
