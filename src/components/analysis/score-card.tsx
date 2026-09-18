interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const percentage = Math.min(Math.max(score, 0), 100);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        Overall Score
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-bold text-slate-900">
          {score}
        </span>

        <span className="mb-1 text-lg text-slate-500">
          /100
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Resume quality score based on AI analysis.
      </p>
    </div>
  );
}