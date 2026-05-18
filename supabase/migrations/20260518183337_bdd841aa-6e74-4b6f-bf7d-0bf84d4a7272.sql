
-- 1. Restrict profiles.is_premium so users cannot self-elevate
CREATE OR REPLACE FUNCTION public.prevent_profile_premium_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Você não tem permissão para alterar o status premium.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_premium_self_update ON public.profiles;
CREATE TRIGGER profiles_prevent_premium_self_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_premium_self_update();

-- 2. Remove user write access on assinaturas (payments must come from webhook with service role)
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.assinaturas;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.assinaturas;

-- Allow user to request cancellation via SECURITY DEFINER RPC
CREATE OR REPLACE FUNCTION public.request_subscription_cancellation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Não autenticado.';
  END IF;
  UPDATE public.assinaturas
  SET cancelamento_solicitado = true, updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.request_subscription_cancellation() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_subscription_cancellation() TO authenticated;

-- 3. Lesson progress: require a completed purchase (or preview lesson)
DROP POLICY IF EXISTS "Users can update their own progress" ON public.lesson_progress;
CREATE POLICY "Users can insert their own progress"
ON public.lesson_progress
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM public.course_purchases cp
      WHERE cp.course_id = lesson_progress.course_id
        AND cp.user_id = auth.uid()
        AND cp.status = 'completed'
    )
    OR EXISTS (
      SELECT 1 FROM public.course_lessons cl
      WHERE cl.id = lesson_progress.lesson_id AND cl.is_preview = true
    )
  )
);

DROP POLICY IF EXISTS "Users can edit their own progress" ON public.lesson_progress;
CREATE POLICY "Users can edit their own progress"
ON public.lesson_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM public.course_purchases cp
      WHERE cp.course_id = lesson_progress.course_id
        AND cp.user_id = auth.uid()
        AND cp.status = 'completed'
    )
    OR EXISTS (
      SELECT 1 FROM public.course_lessons cl
      WHERE cl.id = lesson_progress.lesson_id AND cl.is_preview = true
    )
  )
);
