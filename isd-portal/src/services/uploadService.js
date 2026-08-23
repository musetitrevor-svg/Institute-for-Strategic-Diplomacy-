import { supabase } from '../config/supabaseClient';

export const uploadService = {
  async uploadFile(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('brief-attachments')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('brief-attachments')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrlData.publicUrl };
    } catch (err) {
      console.error("File upload failed:", err.message);
      return { success: false, error: err.message };
    }
  }
};