import { supabase } from "@/lib/supabase";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  image_url: string;
  level: string;
  duration: string;
  is_published: boolean;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: string;
  video_url: string;
  order_index: number;
  is_preview: boolean;
}

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Course[];
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, course_lessons(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return data as Course & { course_lessons: Lesson[] };
}

export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .single();

  if (courseError) throw courseError;

  const { data, error } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single();

  if (error) throw error;
  return data as Lesson;
}

export async function checkCourseAccess(courseId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("course_purchases")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .maybeSingle();

  if (error) return false;
  return !!data;
}
