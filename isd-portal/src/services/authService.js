import { supabase } from '../config/supabaseClient';

export const authService = {
  // Log in a desk head or administrator
  async signIn(email, password) {
    if (!supabase) throw new Error("Auth service unavailable.");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Authentication failed:", err.message);
      return { success: false, error: err.message };
    }
  },

  // Log out the current session and thoroughly wipe local storage
  async signOut() {
    if (!supabase) return;
    
    await supabase.auth.signOut();

    // Clear all Supabase auth keys from localStorage to prevent token bleeding
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });

    // Force a full reload to reset the application memory state
    window.location.href = '/';
  },

  // Get current active session user
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user : null;
  }
};