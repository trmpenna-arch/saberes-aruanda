import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";


export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const location = useLocation();
  const isLessonPage = location.pathname.includes('/aula/');

  return (
    <div className="min-h-screen">
      {!isLessonPage && <SiteHeader />}
      <main className={`mx-auto max-w-xl px-5 pt-6 pb-28 ${isLessonPage ? 'pt-0' : ''}`}>
        <Outlet />
      </main>
      {!isLessonPage && <BottomNav />}
    </div>
  );
}
