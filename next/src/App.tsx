import { Navigate, Route, Routes } from 'react-router-dom';
import { NotesPage } from './app/notes/NotesPage';
import { BunkeiPage } from './app/practice/BunkeiPage';
import { DailyPage } from './app/practice/DailyPage';
import { CustomPage } from './app/practice/CustomPage';
import { PracticePage } from './app/practice/PracticePage';
import { ReviewSessionPage } from './app/practice/ReviewSessionPage';
import { SprintPage } from './app/practice/SprintPage';
import { LessonDetailPage } from './app/problems/LessonDetailPage';
import { NewLessonPage } from './app/problems/NewLessonPage';
import { NewProblemPage } from './app/problems/NewProblemPage';
import { ProblemDetailPage } from './app/problems/ProblemDetailPage';
import { ProblemsPage } from './app/problems/ProblemsPage';
import { SettingsPage } from './app/settings/SettingsPage';
import { TodayPage } from './app/today/TodayPage';
import { AppShell } from './core/layout/AppShell';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<TodayPage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="problems/new" element={<NewProblemPage />} />
        <Route path="problems/lessons/new" element={<NewLessonPage />} />
        <Route path="problems/lessons/:id" element={<LessonDetailPage />} />
        <Route path="problems/:id" element={<ProblemDetailPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="practice/bunkei" element={<BunkeiPage />} />
        <Route path="practice/review" element={<ReviewSessionPage />} />
        <Route path="practice/daily" element={<DailyPage />} />
        <Route path="practice/sprint" element={<SprintPage />} />
        <Route path="practice/custom" element={<CustomPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
