Implement subscription checks, progress tracking per module, video/audio players, and a members library.

### 1. Database Schema
- **Profiles**: Added `is_premium` (already done via migration).
- **Library**: Created `library_items` and `library_item_access` tables (already done).
- **Security Fixes**: Fix search_path on the new trigger function.

### 2. Frontend Components
- **Library Page**: Create `src/routes/_app/estudos/biblioteca.tsx` to display e-books and materials, filtering by `is_advanced` vs subscription status.
- **Lesson Page Enhancement**:
    - Update `src/routes/_app/estudos/$slug/aula/$lessonSlug.tsx` with a robust YouTube player and an audio player for "pontos".
    - Implement lesson completion toggle that updates the `lesson_progress` table.
- **Course Detail Enhancement**:
    - Improve the module list with module-specific progress bars (simulated or derived from lesson progress).
    - Refine the subscription check for "Advanced" content.

### 3. Logic & Data
- Update `src/lib/courses.ts` with:
    - `getLibraryItems()`
    - Improved `checkCourseAccess` to also check `is_premium` if applicable.
    - `markLibraryItemAccessed()`

Technical Details:
- Using `react-player` or standard `iframe` for YouTube.
- Using standard `<audio>` element with custom styling for audio points.
- TanStack Query for data fetching and mutations.
- Tailwind CSS for the library UI.
