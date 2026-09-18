 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  XCircle,
  Lightbulb,
  Search,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

type Resume = {
  _id: string;
  name: string;
};

type JobMatchResult = {
  matchScore?: number;
  overallScore?: number;
  score?: number;

  summary?: string;

  matchingSkills?: string[];
  matchedSkills?: string[];

  missingSkills?: string[];

  matchingKeywords?: string[];
  matchedKeywords?: string[];

  missingKeywords?: string[];

  suggestions?: string[];

  strengths?: string[];

  weaknesses?: string[];
};

export default function JobMatchPage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load resumes
  // --------------------------------------------------

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      setError("");

      const response = await fetch("/api/resumes", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load resumes");
      }

      const resumeList = data?.resumes ?? [];

      setResumes(resumeList);

      if (resumeList.length > 0) {
        setSelectedResume(resumeList[0]._id);
      }
    } catch (error) {
      console.error("FETCH JOB MATCH RESUMES ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load resumes"
      );
    } finally {
      setLoadingResumes(false);
    }
  };

  // IMPORTANT: useEffect, NOT useState
  useEffect(() => {
    fetchResumes();
  }, []);

  // --------------------------------------------------
  // Analyze job match
  // --------------------------------------------------

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!selectedResume) {
      setError("Please select a resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Please enter a more detailed job description."
      );
      return;
    }

    try {
      setAnalyzing(true);

      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobDescription: jobDescription.trim(),
        }),
      });

      const data = await response.json();

      console.log("JOB MATCH RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || "Failed to analyze job match"
        );
      }

      // Your API returns the result inside data.jobMatch
      const analysis =
        data?.jobMatch ??
        data?.result ??
        data?.analysis ??
        data?.data;

      if (!analysis) {
        throw new Error(
          "Analysis completed but no result was returned."
        );
      }

      console.log("JOB MATCH ANALYSIS:", analysis);

      setResult(analysis);

      // Scroll to result
      setTimeout(() => {
        document
          .getElementById("job-match-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error("JOB MATCH ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the job."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const score =
    result?.matchScore ??
    result?.overallScore ??
    result?.score ??
    0;

  const matchingSkills =
    result?.matchingSkills ??
    result?.matchedSkills ??
    [];

  const matchingKeywords =
    result?.matchingKeywords ??
    result?.matchedKeywords ??
    [];

  const missingSkills =
    result?.missingSkills ??
    [];

  const missingKeywords =
    result?.missingKeywords ??
    [];

  const suggestions =
    result?.suggestions ??
    [];

  const strengths =
    result?.strengths ??
    [];

  const weaknesses =
    result?.weaknesses ??
    [];

  const getScoreLabel = (value: number) => {
    if (value >= 85) return "Excellent Match";
    if (value >= 70) return "Strong Match";
    if (value >= 50) return "Moderate Match";
    return "Needs Improvement";
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}

      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <span className="hidden font-semibold sm:block">
              AI Resume Analyzer
            </span>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Hero */}

        <section className="mb-10 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
            <Target className="h-6 w-6 text-white" />
          </div>

          <Badge variant="secondary" className="mb-3">
            AI-Powered Job Matching
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Match Your Resume to a Job
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Compare your resume against a real job description
            and discover how well your experience matches the role.
          </p>

        </section>

        {/* Input Section */}

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardContent className="space-y-8 p-5 sm:p-8">

            {/* Resume Selection */}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-slate-600" />

                <label
                  htmlFor="resume"
                  className="text-sm font-semibold"
                >
                  Select Resume
                </label>
              </div>

              {loadingResumes ? (
                <div className="flex h-11 items-center gap-2 rounded-lg border px-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-lg border border-dashed p-5 text-center">

                  <FileTextFallback />

                  <p className="mt-2 text-sm font-medium">
                    No resumes available
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Upload a resume from your dashboard first.
                  </p>

                  <Button
                    className="mt-4"
                    onClick={() => router.push("/dashboard")}
                  >
                    Upload Resume
                  </Button>

                </div>
              ) : (
                <select
                  id="resume"
                  value={selectedResume}
                  onChange={(event) =>
                    setSelectedResume(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  {resumes.map((resume) => (
                    <option
                      key={resume._id}
                      value={resume._id}
                    >
                      {resume.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job Description */}

            <div>

              <div className="mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-600" />

                <label
                  htmlFor="job-description"
                  className="text-sm font-semibold"
                >
                  Job Description
                </label>
              </div>

              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(event.target.value)
                }
                placeholder="Paste the complete job description here..."
                className="min-h-[220px] resize-y"
                disabled={analyzing}
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>
                  Include responsibilities, requirements, and qualifications.
                </span>

                <span>
                  {jobDescription.length} characters
                </span>
              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <p>{error}</p>
              </div>
            )}

            {/* Button */}

            <Button
              className="h-11 w-full gap-2 sm:w-auto"
              disabled={
                analyzing ||
                loadingResumes ||
                resumes.length === 0
              }
              onClick={handleAnalyze}
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Job Match...
                </>
              ) : (
                <>
                  Analyze Job Match
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* RESULTS */}
        {/* ================================================== */}

        {result && (
          <section
            id="job-match-results"
            className="mt-8 space-y-6"
          >

            {/* Success Message */}

            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 className="h-5 w-5" />

              <span>
                Job match analysis completed successfully.
              </span>
            </div>

            {/* Score */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">

                <div className="flex flex-col items-center text-center">

                  <p className="text-sm font-medium text-slate-500">
                    Resume Job Match Score
                  </p>

                  <div className="relative mt-5 flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-slate-100">

                    <div className="text-center">

                      <div className="text-4xl font-bold text-slate-900">
                        {score}
                      </div>

                      <div className="text-xs text-slate-500">
                        / 100
                      </div>

                    </div>

                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    {getScoreLabel(score)}
                  </h2>

                  {result.summary && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      {result.summary}
                    </p>
                  )}

                </div>

              </CardContent>
            </Card>

            {/* Strengths + Weaknesses */}

            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="grid gap-6 lg:grid-cols-2">

                {/* Strengths */}

                {strengths.length > 0 && (
                  <Card className="border-slate-200">
                    <CardContent className="p-6">

                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />

                        <h2 className="font-semibold">
                          Strengths
                        </h2>
                      </div>

                      <div className="mt-5 space-y-3">
                        {strengths.map((strength, index) => (
                          <div
                            key={index}
                            className="rounded-lg border bg-slate-50 p-3 text-sm"
                          >
                            {strength}
                          </div>
                        ))}
                      </div>

                    </CardContent>
                  </Card>
                )}

                {/* Weaknesses */}

                {weaknesses.length > 0 && (
                  <Card className="border-slate-200">
                    <CardContent className="p-6">

                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />

                        <h2 className="font-semibold">
                          Weaknesses
                        </h2>
                      </div>

                      <div className="mt-5 space-y-3">
                        {weaknesses.map((weakness, index) => (
                          <div
                            key={index}
                            className="rounded-lg border bg-red-50 p-3 text-sm text-red-700"
                          >
                            {weakness}
                          </div>
                        ))}
                      </div>

                    </CardContent>
                  </Card>
                )}

              </div>
            )}

            {/* Matching + Missing Skills */}

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Matching Skills */}

              <Card className="border-slate-200">
                <CardContent className="p-6">

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <h2 className="font-semibold">
                      Matching Skills
                    </h2>
                  </div>

                  {matchingSkills.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {matchingSkills.map((skill, index) => (
                        <Badge
                          key={`${skill}-${index}`}
                          variant="secondary"
                          className="px-3 py-1.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      No matching skills were identified.
                    </p>
                  )}

                </CardContent>
              </Card>

              {/* Missing Skills */}

              <Card className="border-slate-200">
                <CardContent className="p-6">

                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />

                    <h2 className="font-semibold">
                      Missing Skills
                    </h2>
                  </div>

                  {missingSkills.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {missingSkills.map((skill, index) => (
                        <Badge
                          key={`${skill}-${index}`}
                          variant="outline"
                          className="border-red-200 bg-red-50 px-3 py-1.5 text-red-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      No major missing skills identified.
                    </p>
                  )}

                </CardContent>
              </Card>

            </div>

            {/* Keywords */}

            <Card className="border-slate-200">
              <CardContent className="p-6 sm:p-8">

                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-slate-600" />

                  <h2 className="font-semibold">
                    Matching Keywords
                  </h2>
                </div>

                {matchingKeywords.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {matchingKeywords.map((keyword, index) => (
                      <Badge
                        key={`${keyword}-${index}`}
                        variant="secondary"
                        className="px-3 py-1.5"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    No matching keywords were identified.
                  </p>
                )}

                {missingKeywords.length > 0 && (
                  <div className="mt-8 border-t pt-6">

                    <h3 className="text-sm font-semibold">
                      Recommended Keywords
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {missingKeywords.map((keyword, index) => (
                        <Badge
                          key={`${keyword}-${index}`}
                          variant="outline"
                          className="px-3 py-1.5"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                  </div>
                )}

              </CardContent>
            </Card>

            {/* Suggestions */}

            <Card className="border-slate-200">
              <CardContent className="p-6 sm:p-8">

                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />

                  <h2 className="font-semibold">
                    Improvement Suggestions
                  </h2>
                </div>

                {suggestions.length > 0 ? (
                  <div className="mt-5 space-y-3">

                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg border bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {suggestion}
                        </p>
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    No additional suggestions were provided.
                  </p>
                )}

              </CardContent>
            </Card>

            {/* Analyze Again */}

            <div className="flex justify-center pt-2 pb-8">

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setResult(null);
                  setError("");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <Target className="h-4 w-4" />
                Analyze Another Job
              </Button>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

// --------------------------------------------------
// Small fallback icon
// --------------------------------------------------

function FileTextFallback() {
  return (
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
      <BriefcaseBusiness className="h-5 w-5 text-slate-500" />
    </div>
  );
}