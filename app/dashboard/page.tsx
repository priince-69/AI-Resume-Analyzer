"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";

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

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resumes");
      }

      setResumes(data.resumes || []);
    } catch (error) {
      console.error("FETCH RESUMES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-white md:flex md:flex-col">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-lg font-bold">AI Resume Analyzer</h1>
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
            <p className="text-xs text-slate-500">
              AI Resume Analyzer
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Smart career insights
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div>
              <h2 className="text-lg font-semibold">Dashboard</h2>

              <p className="text-sm text-slate-500">
                Analyze and improve your resume
              </p>
            </div>

            <UserButton />
          </header>

          <div className="space-y-8 p-6 lg:p-8">
            {/* Welcome */}
            <section>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back 👋
              </h2>

              <p className="mt-1 text-slate-500">
                Upload your resume and get AI-powered career insights.
              </p>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>

                  <TrendingUp className="h-4 w-4 text-slate-500" />
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">—</div>

                  <p className="text-xs text-slate-500">
                    AI analysis coming next
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Latest Status
                  </CardTitle>

                  <Badge variant="secondary">
                    {resumes.length > 0 ? "Uploaded" : "Ready"}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {resumes.length > 0 ? "Ready" : "Get Started"}
                  </div>

                  <p className="text-xs text-slate-500">
                    {resumes.length > 0
                      ? "Resume ready for analysis"
                      : "Your analyzer is ready"}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Upload */}
            <Card>
              <CardContent className="space-y-6 p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">
                    Analyze your resume
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Upload your resume and let AI evaluate your skills,
                    experience, keywords, and overall job readiness.
                  </p>
                </div>

                <ResumeUpload onUploadComplete={fetchResumes} />
              </CardContent>
            </Card>

            {/* Recent Resumes */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Recent Resumes
                </h3>

                <p className="text-sm text-slate-500">
                  Your recently uploaded resumes
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  {loading ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Loading resumes...
                    </p>
                  ) : resumes.length === 0 ? (
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
                        Upload your first resume to start your AI analysis.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div
                          key={resume._id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-500" />

                            <div>
                              <p className="font-medium">
                                {resume.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {new Date(
                                  resume.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
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