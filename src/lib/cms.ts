import { supabase } from "@/integrations/supabase/client";

export async function getContentSettings() {
  const { data, error } = await supabase
    .from("content_settings")
    .select("*");
  
  if (error) throw error;
  return data;
}

export async function updateContentSetting(type: string, slug: string, imageUrl: string) {
  const { data, error } = await supabase
    .from("content_settings")
    .upsert(
      { type, slug, image_url: imageUrl, updated_at: new Date().toISOString() },
      { onConflict: "type,slug" }
    )
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
