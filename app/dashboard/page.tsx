"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Sparkles,
  Loader2,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ResumeUpload from "@/src/components/resume/resume-upload";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Resume = {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
};

type AnalysisResponse = {
  success: boolean;
  message?: string;
  analysis?: {
    _id: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // --------------------------------------------------
  // Fetch resumes
  // --------------------------------------------------

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/resumes", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch resumes"
        );
      }

      setResumes(data.resumes ?? []);
    } catch (error) {
      console.error("FETCH RESUMES ERROR:", error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Analyze resume
  // --------------------------------------------------

  const handleAnalyze = async (resumeId: string) => {
  try {
    setAnalyzingId(resumeId);

    const response = await fetch(
      `/api/resumes/${resumeId}/analyze`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const contentType = response.headers.get("content-type") || "";

    let data: AnalysisResponse;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();

      throw new Error(
        response.status === 404
          ? "Analysis API route not found. Restart the Next.js server."
          : `Server returned an unexpected response (${response.status})`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to analyze resume"
      );
    }

    if (!data.analysis?._id) {
      throw new Error(
        "Analysis completed but analysis ID was not returned"
      );
    }

    console.log("RESUME ANALYSIS SUCCESS:", data);

    router.push(
      `/dashboard/analysis/${data.analysis._id}`
    );
  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to analyze resume";

    alert(message);
  } finally {
    setAnalyzingId(null);
  }
};

  // --------------------------------------------------
  // Client mount
  // --------------------------------------------------

  useEffect(() => {
    setMounted(true);
    fetchResumes();
  }, []);

  // --------------------------------------------------
  // Format date safely
  // --------------------------------------------------

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="hidden w-64 border-r bg-white md:flex md:flex-col">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                <Sparkles className="h-4 w-4 text-white" />
              </div>

              <h1 className="text-lg font-bold">
                AI Resume
              </h1>
            </div>
          </div>

          <Separator />

          <nav className="flex-1 space-y-2 p-4">

            <Button
              variant="secondary"
              className="w-full justify-start gap-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => router.push("/dashboard")}
            >
              <FileText className="h-4 w-4" />
              My Resumes
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>

          </nav>

          <div className="border-t p-4">
            <p className="text-xs font-medium text-slate-600">
              AI Resume Analyzer
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Smart career insights
            </p>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="flex-1">

          {/* Header */}

          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">

            <div>
              <h2 className="text-lg font-semibold">
                Dashboard
              </h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Analyze and improve your resume
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center">
              {mounted ? (
                <UserButton />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-200" />
              )}
            </div>

          </header>

          <div className="space-y-8 p-4 sm:p-6 lg:p-8">

            {/* =================================================
                WELCOME
            ================================================= */}

            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back 👋
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                    Upload your resume and get AI-powered
                    insights to improve your chances of landing
                    your next job.
                  </p>
                </div>

                <div className="hidden items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs text-slate-600 sm:flex">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-powered analysis
                </div>

              </div>
            </section>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Resume count */}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resumes Uploaded
                  </CardTitle>

                  <FileText className="h-4 w-4 text-slate-500" />
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : resumes.length}
                  </div>

                  <p className="text-xs text-slate-500">
                    Total resumes in your account
                  </p>
                </CardContent>
              </Card>

              {/* Average score */}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>

                  <TrendingUp className="h-4 w-4 text-slate-500" />
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    —
                  </div>

                  <p className="text-xs text-slate-500">
                    Available after analysis
                  </p>
                </CardContent>
              </Card>

              {/* Status */}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Latest Status
                  </CardTitle>

                  <Badge variant="secondary">
                    {resumes.length > 0
                      ? "Ready"
                      : "Get Started"}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {resumes.length > 0
                      ? "Ready"
                      : "Start"}
                  </div>

                  <p className="text-xs text-slate-500">
                    {resumes.length > 0
                      ? "Resume ready for analysis"
                      : "Upload a resume to begin"}
                  </p>
                </CardContent>
              </Card>

            </section>

            {/* =================================================
                RESUME UPLOAD
            ================================================= */}

            <Card className="overflow-hidden">
              <CardContent className="space-y-6 p-6 sm:p-8">

                <div className="mx-auto max-w-2xl text-center">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold sm:text-2xl">
                    Analyze your resume
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Upload your resume and let AI evaluate
                    your skills, experience, keywords, strengths,
                    weaknesses, and overall job readiness.
                  </p>

                </div>

                <ResumeUpload
                  onUploadComplete={fetchResumes}
                />

              </CardContent>
            </Card>

            {/* =================================================
                RECENT RESUMES
            ================================================= */}

            <section>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Recent Resumes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Analyze your uploaded resumes and view
                  AI-generated insights.
                </p>
              </div>

              <Card>
                <CardContent className="p-4 sm:p-6">

                  {/* Loading */}

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">

                      <Loader2 className="mb-3 h-6 w-6 animate-spin text-slate-400" />

                      <p className="text-sm text-slate-500">
                        Loading your resumes...
                      </p>

                    </div>

                  ) : resumes.length === 0 ? (

                    /* Empty State */

                    <div className="flex flex-col items-center justify-center py-12 text-center">

                      <Avatar className="mb-4 h-12 w-12">
                        <AvatarFallback>
                          <FileText className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <h4 className="font-medium">
                        No resumes uploaded yet
                      </h4>

                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Upload your first resume above to
                        start your AI-powered analysis.
                      </p>

                    </div>

                  ) : (

                    /* Resume List */

                    <div className="space-y-3">

                      {resumes.map((resume) => {
                        const isAnalyzing =
                          analyzingId === resume._id;

                        return (
                          <div
                            key={resume._id}
                            className="flex flex-col gap-4 rounded-xl border bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                          >

                            {/* Resume info */}

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                <FileText className="h-5 w-5 text-slate-600" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-medium">
                                  {resume.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  Uploaded{" "}
                                  {formatDate(resume.createdAt)}
                                </p>

                              </div>

                            </div>

                            {/* Actions */}

                            <div className="flex w-full gap-2 sm:w-auto">

                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-2 sm:flex-none"
                                asChild
                              >
                                <a
                                  href={resume.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View
                                </a>
                              </Button>

                              <Button
                                size="sm"
                                className="flex-1 gap-2 sm:flex-none"
                                disabled={isAnalyzing}
                                onClick={() =>
                                  handleAnalyze(resume._id)
                                }
                              >
                                {isAnalyzing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <BarChart3 className="h-4 w-4" />
                                    Analyze
                                  </>
                                )}
                              </Button>

                            </div>

                          </div>
                        );
                      })}

                    </div>
                  )}

                </CardContent>
              </Card>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}