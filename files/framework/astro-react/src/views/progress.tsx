import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Button } from '../components/button';
import { exportProgress, getCompletedLessons, importProgress, resetProgress } from '../lib/curriculum-progress';

import './views.css';
import './progress.css';

type LessonEntry = {
  slug: string;
  href: string;
  section: string;
};

type SectionStat = {
  title: string;
  completed: number;
  total: number;
};

type ProgressProps = {
  lessons: LessonEntry[];
};

export function Progress({ lessons }: ProgressProps) {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [ready, setReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompletedSlugs(getCompletedLessons());
    setReady(true);
  }, []);

  const completedSet = useMemo(() => new Set(completedSlugs), [completedSlugs]);
  const totalCount = lessons.length;
  const completedCount = lessons.filter((lesson) => completedSet.has(lesson.slug)).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = totalCount > 0 && completedCount === totalCount;

  const sections = useMemo(() => {
    const stats: SectionStat[] = [];
    const indexBySection = new Map<string, number>();

    for (const lesson of lessons) {
      let index = indexBySection.get(lesson.section);
      if (index === undefined) {
        index = stats.length;
        indexBySection.set(lesson.section, index);
        stats.push({ title: lesson.section, completed: 0, total: 0 });
      }

      stats[index].total += 1;
      if (completedSet.has(lesson.slug)) {
        stats[index].completed += 1;
      }
    }

    return stats;
  }, [lessons, completedSet]);

  const nextLesson = lessons.find((lesson) => !completedSet.has(lesson.slug));

  function handleExport() {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'progress.json';
    link.click();

    URL.revokeObjectURL(url);
    setFeedback('Progress exported.');
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Reset all progress? This clears every completed lesson on this device and cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    resetProgress();
    setCompletedSlugs([]);
    setFeedback('Progress reset.');
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const addedCount = importProgress(text);
      setCompletedSlugs(getCompletedLessons());
      setFeedback(
        addedCount > 0
          ? `Imported ${addedCount} newly completed lesson${addedCount === 1 ? '' : 's'}.`
          : 'No new completed lessons found in that file.',
      );
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not import that file.');
    }
  }

  return (
    <main id="main-content" className="main" tabIndex={-1}>
      <header className="page-heading">
        <h1 className="page-label">Progress</h1>
        <hr className="page-label-divider" />
      </header>

      <section className={ready ? 'progress-stats' : 'progress-stats loading'}>
        <div className="progress-headline">
          <span className="progress-percent">{percent}%</span>
          <span className="progress-percent-label">Complete</span>
        </div>

        <progress
          className="progress-bar"
          value={completedCount}
          max={totalCount || 1}
          aria-label="Lesson completion"
        >
          {percent}%
        </progress>

        <p className="progress-lesson-count">
          Lessons: {completedCount} / {totalCount}
        </p>

        {sections.length > 0 ? (
          <ul className="progress-section-list">
            {sections.map((section) => (
              <li key={section.title} className="progress-section-row">
                <span>{section.title}</span>
                <span>{section.total > 0 ? Math.round((section.completed / section.total) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        ) : null}

        {allComplete ? <p className="progress-complete-message">You have completed every lesson. Nice work!</p> : null}

        <div className="progress-actions">
          <div className="progress-actions-primary">
            {nextLesson ? (
              <Button variant="primary" href={nextLesson.href}>
                Continue learning
              </Button>
            ) : null}
          </div>

          <div className="progress-actions-data">
            <Button variant="secondary" onClick={handleExport}>
              Export progress
            </Button>

            <Button variant="secondary" onClick={handleImportClick}>
              Import progress
            </Button>

            <Button variant="danger" onClick={handleReset}>
              Reset progress
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="progress-file-input"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <p aria-live="polite" className="progress-feedback">
          {feedback}
        </p>
      </section>
    </main>
  );
}
