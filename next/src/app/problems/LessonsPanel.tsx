import { useLiveQuery } from 'dexie-react-hooks';
import { GraduationCap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/core/ui/Button';
import { EmptyState } from '@/core/ui/EmptyState';
import { Skeleton } from '@/core/ui/Spinner';
import { listLessons } from '@/data/repo';
import { LessonCard } from '@/features/lesson/LessonCard';

export function LessonsPanel() {
  const lessons = useLiveQuery(() => listLessons(), []);
  const navigate = useNavigate();

  if (!lessons) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          単元を選ぶと、AIが講義と確認クイズを3〜4パートで作ります。
        </p>
        <Button onClick={() => navigate('/problems/lessons/new')}>
          <Plus size={16} />
          新しい授業
        </Button>
      </div>

      {lessons.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="まだ授業がありません"
          description="「二次関数の最大・最小」のような単元名を入れるだけで、基礎から確認クイズまでをAIが組み立てます。"
          action={
            <Button onClick={() => navigate('/problems/lessons/new')}>
              <Plus size={16} />
              最初の授業を作る
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
