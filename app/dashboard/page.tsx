import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            AI Resume Analyzer
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome to your dashboard.
          </p>
        </div>

        <UserButton />
      </div>
    </main>
  );
}