import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { connectDB } from "@/src/lib/db/mongodb";
import { Analysis } from "@/src/lib/db/models/Analysis";
import { ScoreCard } from "@/src/components/analysis/score-card";

interface AnalysisPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisPage({
  params,
}: AnalysisPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const { id } = await params;

  await connectDB();

  const analysis = await Analysis.findOne({
    _id: id,
    userId,
  }).lean();

  if (!analysis) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Resume Analysis
          </h1>

          <p className="mt-2 text-slate-600">
            AI-powered analysis of your resume.
          </p>
        </div>

        {/* Top Stats */}
       <ScoreCard score={analysis.overallScore} />

        {/* Summary */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Summary
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {analysis.summary}
          </p>
        </section>

        {/* Skills */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.skills.map((skill: string) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Strengths
            </h2>

            <ul className="mt-4 space-y-3">
              {analysis.strengths.map(
                (strength: string, index: number) => (
                  <li
                    key={index}
                    className="rounded-lg bg-slate-50 p-3 text-slate-700"
                  >
                    {strength}
                  </li>
                )
              )}
            </ul>
          </section>

          {/* Weaknesses */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Weaknesses
            </h2>

            <ul className="mt-4 space-y-3">
              {analysis.weaknesses.map(
                (weakness: string, index: number) => (
                  <li
                    key={index}
                    className="rounded-lg bg-slate-50 p-3 text-slate-700"
                  >
                    {weakness}
                  </li>
                )
              )}
            </ul>
          </section>
        </div>

        {/* Missing Keywords */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Missing Keywords
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.missingKeywords.map(
              (keyword: string) => (
                <span
                  key={keyword}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {keyword}
                </span>
              )
            )}
          </div>
        </section>

        {/* Suggestions */}
        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Suggestions
          </h2>

          <ul className="mt-4 space-y-3">
            {analysis.suggestions.map(
              (suggestion: string, index: number) => (
                <li
                  key={index}
                  className="rounded-lg bg-slate-50 p-4 text-slate-700"
                >
                  {suggestion}
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}