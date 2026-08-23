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

  // Log out the current session
  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  // Get current active session user
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user : null;
  }
};