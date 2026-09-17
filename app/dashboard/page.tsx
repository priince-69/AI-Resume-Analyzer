import { UserButton } from "@clerk/nextjs";
import {
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  TrendingUp,
} from "lucide-react";
import ResumeUpload from "@/src/components/resume/resume-upload";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
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
            <Button variant="secondary" className="w-full justify-start gap-3">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-4 w-4" />
              My Resumes
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="border-t p-4">
            <p className="text-xs text-slate-500">AI Resume Analyzer</p>
            <p className="mt-1 text-xs text-slate-400">Smart career insights</p>
          </div>
        </aside>

        {/* Main Content */}
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
                    Resumes Analyzed
                  </CardTitle>

                  <FileText className="h-4 w-4 text-slate-500" />
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-slate-500">
                    Start your first analysis
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
                  <p className="text-xs text-slate-500">No analysis yet</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Latest Status
                  </CardTitle>

                  <Badge variant="secondary">Ready</Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">Get Started</div>
                  <p className="text-xs text-slate-500">
                    Your analyzer is ready
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Upload CTA */}
            {/* Upload CTA */}
            <Card>
              <CardContent className="space-y-6 p-8">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Analyze your resume
                    </h3>

                    <p className="mt-2 max-w-xl text-sm text-slate-500">
                      Upload your resume and let AI evaluate your skills,
                      experience, keywords, and overall job readiness.
                    </p>
                  </div>
                </div>

                <ResumeUpload />
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Recent Analyses</h3>

                  <p className="text-sm text-slate-500">
                    Your latest resume analysis results
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Avatar className="mb-4 h-12 w-12">
                    <AvatarFallback>
                      <FileText className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <h4 className="font-medium">No resume analyses yet</h4>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Upload your first resume to see your AI analysis results
                    here.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// import ResumeUpload from "@/src/components/resume/resume-upload";
// export default function DashboardPage() {
//   return (
//     <main className="p-8">
//       <h1 className="text-3xl font-bold">
//         AI Resume Analyzer
//       </h1>

//       <div className="mt-8 max-w-2xl">
//         <ResumeUpload />
//       </div>
//     </main>
//   );
// }
