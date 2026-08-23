import { supabase } from '../config/supabaseClient';
export const briefsService = {
  async getPublishedBriefs() {
    if (!supabase) {
      console.warn("Supabase client not initialized.");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching published briefs:", err.message);
      return [];
    }
  },

  async createBrief(briefData) {
    if (!supabase) throw new Error("Database connection not available.");

    try {
      const { data, error } = await supabase
        .from('briefs')
        .insert([{
          title: briefData.title,
          body: briefData.content || briefData.body,
          author: briefData.author,
          status: briefData.status || 'pending',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Failed to save brief:", err.message);
      return { success: false, error: err.message };
    }
  }
};