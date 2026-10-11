// "use client";

// import { useEffect, useState } from "react";
// import { UserButton } from "@clerk/nextjs";
// import {
//   FileText,
//   LayoutDashboard,
//   Settings,
//   TrendingUp,
//   Sparkles,
//   Loader2,
//   ExternalLink,
//   BarChart3,
//   Target,
//   ArrowRight,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import ResumeUpload from "@/src/components/resume/resume-upload";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// type Resume = {
//   _id: string;
//   name: string;
//   url: string;
//   createdAt: string;
// };

// type AnalysisResponse = {
//   success: boolean;
//   message?: string;
//   analysis?: {
//     _id: string;
//   };
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [analyzingId, setAnalyzingId] = useState<string | null>(null);

//   // --------------------------------------------------
//   // Fetch resumes
//   // --------------------------------------------------

//   const fetchResumes = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch("/api/resumes", {
//         method: "GET",
//         cache: "no-store",
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.message || "Failed to fetch resumes");
//       }

//       setResumes(data.resumes ?? []);
//     } catch (error) {
//       console.error("FETCH RESUMES ERROR:", error);
//       setResumes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Analyze resume
//   // --------------------------------------------------

//   const handleAnalyze = async (resumeId: string) => {
//     try {
//       setAnalyzingId(resumeId);

//       const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       const contentType = response.headers.get("content-type") || "";

//       let data: AnalysisResponse;

//       if (contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         await response.text();

//         throw new Error(
//           response.status === 404
//             ? "Analysis API route not found. Restart the Next.js server."
//             : `Server returned an unexpected response (${response.status})`,
//         );
//       }

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Failed to analyze resume");
//       }

//       if (!data.analysis?._id) {
//         throw new Error("Analysis completed but analysis ID was not returned");
//       }

//       console.log("RESUME ANALYSIS SUCCESS:", data);

//       router.push(`/dashboard/analysis/${data.analysis._id}`);
//     } catch (error) {
//       console.error("RESUME ANALYSIS ERROR:", error);

//       const message =
//         error instanceof Error ? error.message : "Failed to analyze resume";

//       alert(message);
//     } finally {
//       setAnalyzingId(null);
//     }
//   };

//   // --------------------------------------------------
//   // Client mount
//   // --------------------------------------------------

//   useEffect(() => {
//     const loadResumes = async () => {
//       await fetchResumes();
//     };

//     loadResumes();
//   }, []);

//   // --------------------------------------------------
//   // Format date
//   // --------------------------------------------------

//   const formatDate = (date: string) => {
//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "Unknown date";
//     }

//     return new Intl.DateTimeFormat("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }).format(parsedDate);
//   };

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="flex min-h-screen">
//         {/* =====================================================
//             SIDEBAR
//         ===================================================== */}

//         <aside className="hidden w-64 border-r bg-white md:flex md:flex-col">
//           <div className="flex h-16 items-center px-6">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
//                 <Sparkles className="h-4 w-4 text-white" />
//               </div>

//               <h1 className="text-lg font-bold">AI Resume</h1>
//             </div>
//           </div>

//           <Separator />

//           <nav className="flex-1 space-y-2 p-4">
//             <Button variant="secondary" className="w-full justify-start gap-3">
//               <LayoutDashboard className="h-4 w-4" />
//               Dashboard
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-3"
//               onClick={() => router.push("/dashboard")}
//             >
//               <FileText className="h-4 w-4" />
//               My Resumes
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-3"
//               onClick={() => router.push("/dashboard/job-match")}
//             >
//               <Target className="h-4 w-4" />
//               Job Match
//             </Button>

//             <Button variant="ghost" className="w-full justify-start gap-3">
//               <Settings className="h-4 w-4" />
//               Settings
//             </Button>
//           </nav>

//           <div className="border-t p-4">
//             <p className="text-xs font-medium text-slate-600">
//               AI Resume Analyzer
//             </p>

//             <p className="mt-1 text-xs text-slate-400">Smart career insights</p>
//           </div>
//         </aside>

//         {/* =====================================================
//             MAIN CONTENT
//         ===================================================== */}

//         <main className="flex-1">
//           {/* Header */}

//           <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">
//             <div>
//               <h2 className="text-lg font-semibold">Dashboard</h2>

//               <p className="hidden text-sm text-slate-500 sm:block">
//                 Analyze and improve your resume
//               </p>
//             </div>

//             <div className="flex h-9 w-9 items-center justify-center">
//               <UserButton />
//             </div>
//           </header>

//           <div className="space-y-8 p-4 sm:p-6 lg:p-8">
//             [ accordion]
//             {/* =================================================
//                 WELCOME
//             ================================================= */}
//             <section>
//               <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
//                     Welcome back 👋
//                   </h2>

//                   <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
//                     Upload your resume and get AI-powered insights to improve
//                     your chances of landing your next job.
//                   </p>
//                 </div>

//                 <div className="hidden items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs text-slate-600 sm:flex">
//                   <Sparkles className="h-3.5 w-3.5" />
//                   AI-powered analysis
//                 </div>
//               </div>
//             </section>
//             {/* =================================================
//                 STATS
//             ================================================= */}
//             <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {/* Resume count */}

//               <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Resumes Uploaded
//                   </CardTitle>

//                   <FileText className="h-4 w-4 text-slate-500" />
//                 </CardHeader>

//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {loading ? "..." : resumes.length}
//                   </div>

//                   <p className="text-xs text-slate-500">
//                     Total resumes in your account
//                   </p>
//                 </CardContent>
//               </Card>

//               {/* Average score */}

//               <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Average Score
//                   </CardTitle>

//                   <TrendingUp className="h-4 w-4 text-slate-500" />
//                 </CardHeader>

//                 <CardContent>
//                   <div className="text-2xl font-bold">—</div>

//                   <p className="text-xs text-slate-500">
//                     Available after analysis
//                   </p>
//                 </CardContent>
//               </Card>

//               {/* Status */}

//               <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">
//                     Latest Status
//                   </CardTitle>

//                   <Badge variant="secondary">
//                     {resumes.length > 0 ? "Ready" : "Get Started"}
//                   </Badge>
//                 </CardHeader>

//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {resumes.length > 0 ? "Ready" : "Start"}
//                   </div>

//                   <p className="text-xs text-slate-500">
//                     {resumes.length > 0
//                       ? "Resume ready for analysis"
//                       : "Upload a resume to begin"}
//                   </p>
//                 </CardContent>
//               </Card>
//             </section>
//             {/* =================================================
//                 RESUME UPLOAD
//             ================================================= */}
//             <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
//               <CardContent className="space-y-6 p-6 sm:p-8">
//                 <div className="mx-auto max-w-2xl text-center">
//                   <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
//                     <Sparkles className="h-5 w-5 text-white" />
//                   </div>

//                   <h3 className="text-xl font-semibold sm:text-2xl">
//                     Analyze your resume
//                   </h3>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     Upload your resume and let AI evaluate your skills,
//                     experience, keywords, strengths, weaknesses, and overall job
//                     readiness.
//                   </p>
//                 </div>

//                 <ResumeUpload onUploadComplete={fetchResumes} />
//               </CardContent>
//             </Card>
//             {/* =================================================
//                 JOB MATCH
//             ================================================= */}
//             <section>
//               <Card className="group overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
//                 <CardContent className="p-6 sm:p-8">
//                   <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//                     <div className="flex items-start gap-4">
//                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
//                         <Target className="h-5 w-5 text-white" />
//                       </div>

//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="text-xl font-semibold">
//                             Match Your Resume to a Job
//                           </h3>

//                           <Badge variant="secondary">AI</Badge>
//                         </div>

//                         <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                           Compare your resume with any job description and
//                           discover your match score, missing skills, keywords,
//                           and improvement suggestions.
//                         </p>
//                       </div>
//                     </div>

//                     <Button
//                       className="w-full gap-2 md:w-auto"
//                       onClick={() => router.push("/dashboard/job-match")}
//                     >
//                       Match My Resume
//                       <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </section>
//             {/* =================================================
//                 RECENT RESUMES
//             ================================================= */}
//             <section>
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold">Recent Resumes</h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Analyze your uploaded resumes and view AI-generated insights.
//                 </p>
//               </div>

//               <Card>
//                 <CardContent className="p-4 sm:p-6">
//                   {/* Loading */}

//                   {loading ? (
//                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                       <Loader2 className="mb-3 h-6 w-6 animate-spin text-slate-400" />

//                       <p className="text-sm text-slate-500">
//                         Loading your resumes...
//                       </p>
//                     </div>
//                   ) : resumes.length === 0 ? (
//                     /* Empty State */

//                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                       <Avatar className="mb-4 h-12 w-12">
//                         <AvatarFallback>
//                           <FileText className="h-5 w-5" />
//                         </AvatarFallback>
//                       </Avatar>

//                       <h4 className="font-medium">No resumes uploaded yet</h4>

//                       <p className="mt-1 max-w-sm text-sm text-slate-500">
//                         Upload your first resume above to start your AI-powered
//                         analysis.
//                       </p>
//                     </div>
//                   ) : (
//                     /* Resume List */

//                     <div className="space-y-3">
//                       {resumes.map((resume) => {
//                         const isAnalyzing = analyzingId === resume._id;

//                         return (
//                           <div
//                             key={resume._id}
//                             className="flex flex-col gap-4 rounded-xl border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
//                           >
//                             {/* Resume info */}

//                             <div className="flex min-w-0 items-center gap-3">
//                               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
//                                 <FileText className="h-5 w-5 text-slate-600" />
//                               </div>

//                               <div className="min-w-0">
//                                 <p className="truncate font-medium">
//                                   {resume.name}
//                                 </p>

//                                 <p className="mt-1 text-xs text-slate-500">
//                                   Uploaded {formatDate(resume.createdAt)}
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Actions */}

//                             <div className="flex w-full gap-2 sm:w-auto">
//                               <a
//                                 href={resume.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
//                               >
//                                 <ExternalLink className="h-4 w-4" />
//                                 View
//                               </a>

//                               <Button
//                                 size="sm"
//                                 className="flex-1 gap-2 sm:flex-none"
//                                 disabled={isAnalyzing}
//                                 onClick={() => handleAnalyze(resume._id)}
//                               >
//                                 {isAnalyzing ? (
//                                   <>
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                     Analyzing...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <BarChart3 className="h-4 w-4" />
//                                     Analyze
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


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
  Target,
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ResumeUpload from "@/src/components/resume/resume-upload";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        throw new Error(data?.message || "Failed to fetch resumes");
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

      const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";

      let data: AnalysisResponse;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        await response.text();

        throw new Error(
          response.status === 404
            ? "Analysis API route not found. Restart the Next.js server."
            : `Server returned an unexpected response (${response.status})`,
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      if (!data.analysis?._id) {
        throw new Error("Analysis completed but analysis ID was not returned");
      }

      router.push(`/dashboard/analysis/${data.analysis._id}`);
    } catch (error) {
      console.error("RESUME ANALYSIS ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to analyze resume";

      alert(message);
    } finally {
      setAnalyzingId(null);
    }
  };

  // --------------------------------------------------
  // Client mount
  // --------------------------------------------------

  useEffect(() => {
    const loadResumes = async () => {
      await fetchResumes();
    };

    loadResumes();
  }, []);

  // --------------------------------------------------
  // Format date
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
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <div className="flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col shadow-xs sticky top-0 h-screen">
          <div className="flex h-16 items-center px-6 gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                AI Resume Analyzer
              </h1>
              <p className="text-[10px] text-slate-400">Recruiter Grade</p>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <nav className="flex-1 space-y-1.5 p-4">
            <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100">
              <LayoutDashboard className="h-4 w-4 text-indigo-600" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => router.push("/dashboard")}
            >
              <FileText className="h-4 w-4 text-slate-500" />
              My Resumes
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => router.push("/dashboard/job-match")}
            >
              <Target className="h-4 w-4 text-slate-500" />
              Job Match
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Settings
            </Button>
          </nav>

          <div className="p-4 border-t border-slate-100 m-4 bg-slate-50 rounded-2xl">
            <p className="text-xs font-semibold text-slate-700">
              System Operational
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">Gemini Engine Online</p>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dashboard Overview</h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Manage your resumes and leverage advanced AI career insights
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Ready
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-slate-200 shadow-xs">
                <UserButton />
              </div>
            </div>
          </header>

          <div className="space-y-8 p-6 sm:p-8 max-w-7xl w-full mx-auto">
            
            {/* =================================================
                WELCOME BANNER
            ================================================= */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-indigo-200 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" /> AI-Powered Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back 👋</h2>
                <p className="text-indigo-200 text-sm max-w-xl">
                  Upload your resume and get AI-powered insights to improve your chances of landing your next dream role.
                </p>
              </div>
            </div>

            {/* =================================================
                STATS
            ================================================= */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-2xl border-slate-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Resumes Uploaded
                  </CardTitle>
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">
                    {loading ? "..." : resumes.length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Total resumes in your account
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Average ATS Score
                  </CardTitle>
                  <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">—</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Available after full analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Latest Status
                  </CardTitle>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2 mt-0.5">
                    {resumes.length > 0 ? "Ready" : "Get Started"}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {resumes.length > 0
                      ? "Resume ready for AI evaluation"
                      : "Upload a resume to begin"}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* =================================================
                RESUME UPLOAD CARD
            ================================================= */}
            <Card className="rounded-3xl border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="space-y-6 p-6 sm:p-10">
                <div className="mx-auto max-w-2xl text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
                    <Sparkles className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Analyze your resume with AI
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500">
                    Upload your resume and let advanced AI evaluate your skills, experience, keywords, strengths, weaknesses, and overall job readiness instantly.
                  </p>
                </div>

                <div className="bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl p-6">
                  <ResumeUpload onUploadComplete={fetchResumes} />
                </div>
              </CardContent>
            </Card>

            {/* =================================================
                JOB MATCH SECTION
            ================================================= */}
            <section>
              <Card className="group rounded-3xl border-slate-200/80 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-xs transition-transform duration-300 group-hover:scale-105">
                        <Briefcase className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            Match Your Resume to a Job Description
                          </h3>
                          <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-extrabold rounded-full">AI</span>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-500 max-w-2xl">
                          Compare your resume directly with target roles to discover exact match scores, missing skills, keywords, and actionable tips.
                        </p>
                      </div>
                    </div>

                    <Button
                      className="w-full gap-2 md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 shadow-md transition-all"
                      onClick={() => router.push("/dashboard/job-match")}
                    >
                      Match My Resume
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* =================================================
                RECENT RESUMES LIST
            ================================================= */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Resumes</h3>
                  <p className="text-xs text-slate-500">
                    View uploaded documents and launch AI analysis reports.
                  </p>
                </div>
              </div>

              <Card className="rounded-3xl border-slate-200/80 bg-white shadow-xs">
                <CardContent className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Loader2 className="mb-3 h-6 w-6 animate-spin text-indigo-600" />
                      <p className="text-sm text-slate-500 font-medium">Loading your resumes...</p>
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Avatar className="mb-4 h-12 w-12 bg-slate-100 text-slate-600">
                        <AvatarFallback>
                          <FileText className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-slate-900">No resumes uploaded yet</h4>
                      <p className="mt-1 max-w-sm text-xs text-slate-500">
                        Upload your first PDF or DOCX resume above to start your AI-powered evaluation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resumes.map((resume) => {
                        const isAnalyzing = analyzingId === resume._id;

                        return (
                          <div
                            key={resume._id}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-300 hover:bg-white hover:border-slate-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex min-w-0 items-center gap-3.5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-100 text-indigo-600">
                                <FileText className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-sm text-slate-900">
                                  {resume.name}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400">
                                  Uploaded on {formatDate(resume.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex w-full gap-2.5 sm:w-auto">
                              <a
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                View File
                              </a>

                              <Button
                                size="sm"
                                className="flex-1 gap-2 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 shadow-sm shadow-indigo-200"
                                disabled={isAnalyzing}
                                onClick={() => handleAnalyze(resume._id)}
                              >
                                {isAnalyzing ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    Run Analysis
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