import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <nav className="p-6 flex justify-between items-center relative z-20">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Campus Flow
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-indigo-600">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="relative pt-20 pb-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        </div>
        <div className="absolute top-40 left-0 -translate-x-1/3">
          <div className="w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8 border border-indigo-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>The intelligent operating system for students</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            Manage your academic life with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">superpowers.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Campus Flow brings your timetable, tasks, academic repository, and placement prep into one beautiful, intelligent workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:scale-105">
                Join Campus Flow <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white shadow-sm hover:bg-gray-50 border-gray-200">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {[
              { title: "Smart Dashboard", desc: "Your schedule, tasks, and attendance, intelligently organized.", icon: "🎯" },
              { title: "Academic Vault", desc: "Store and search notes, PDFs, and past papers instantly.", icon: "📚" },
              { title: "Placement Prep", desc: "Track your progress and get AI-driven recommendations.", icon: "🚀" }
            ].map((feature, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl border border-white/50 shadow-xl shadow-indigo-50/50 hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
