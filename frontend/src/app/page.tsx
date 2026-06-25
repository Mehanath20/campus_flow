"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles, ArrowRight, CheckSquare, BookOpen, Bell,
  PieChart, BrainCircuit, Briefcase, GraduationCap,
  Star, ChevronRight, Zap, Shield, Users, TrendingUp
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Study Buddy",
    desc: "Upload any notes — instantly get AI-generated flashcards, MCQs, mind maps and summaries.",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.18)",
  },
  {
    icon: CheckSquare,
    title: "Smart Assignments",
    desc: "Never miss a deadline. Track every task with live countdowns and smart priority alerts.",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.08)",
    border: "rgba(14,165,233,0.18)",
  },
  {
    icon: PieChart,
    title: "Attendance Tracker",
    desc: "Real-time attendance monitoring. Get instant alerts when you're at risk of shortage.",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.18)",
  },
  {
    icon: BookOpen,
    title: "Academic Vault",
    desc: "One place for all study materials — notes, PDFs, slides uploaded by your faculty.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.18)",
  },
  {
    icon: Briefcase,
    title: "Placement Prep AI",
    desc: "Personalized roadmap for placements. Practice DSA, aptitude and HR rounds with AI guidance.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.18)",
  },
  {
    icon: Bell,
    title: "Instant Notices",
    desc: "Faculty broadcast notices and events directly to your dashboard in real-time.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
  },
];

const stats = [
  { value: "10K+", label: "Students Active", icon: Users },
  { value: "98%", label: "Attendance Accuracy", icon: Shield },
  { value: "3x", label: "Study Efficiency", icon: TrendingUp },
  { value: "50+", label: "AI Features", icon: Zap },
];

const testimonials = [
  { name: "Priya S.", role: "3rd Year CSE", text: "CampusFlow completely changed how I manage my studies. The AI study buddy is insane!", avatar: "P" },
  { name: "Arjun M.", role: "Faculty, ECE", text: "Publishing assignments and tracking attendance has never been this smooth and elegant.", avatar: "A" },
  { name: "Sneha R.", role: "2nd Year IT", text: "I stopped missing deadlines the moment I started using this. The UI is gorgeous too.", avatar: "S" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 30%, #f5f0ff 60%, #eee8ff 100%)" }}>

      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb orb-violet animate-blob w-[600px] h-[600px] -top-40 -right-40" style={{ opacity: 0.35 }} />
        <div className="orb orb-pink animate-blob-delayed w-[400px] h-[400px] top-1/2 -left-32" style={{ opacity: 0.25 }} />
        <div className="orb orb-blue animate-blob-long w-[500px] h-[500px] bottom-0 right-1/4" style={{ opacity: 0.2 }} />
        <div className="orb orb-lavender animate-blob w-64 h-64 top-1/3 left-1/2" style={{ opacity: 0.3 }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.05) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }} />
      </div>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
        style={scrolled ? {
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(167,139,250,0.18)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        } : {}}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black animate-pulse-ring"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
              CF
            </div>
            <span className="text-xl font-black gradient-text">CampusFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Testimonials"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-semibold transition-colors hover:text-violet-600"
                style={{ color: "#7c6fa0" }}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:bg-violet-50"
                style={{ color: "#7c3aed" }}>
                Sign In
              </button>
            </Link>
            <Link href="/login">
              <button className="glass-btn px-5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-1.5">
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-40 pb-24 text-center px-6">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold animate-scale-in"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#7c3aed",
            }}>
            <Sparkles className="w-4 h-4 text-amber-400 animate-float" />
            The AI-Powered Academic Platform for Modern Campuses
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.08] animate-slide-up"
            style={{ color: "#1e1b4b" }}>
            Your entire campus life,{" "}
            <span className="gradient-text">intelligently</span>{" "}
            unified.
          </h1>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100"
            style={{ color: "#7c6fa0", animationFillMode: "both" }}>
            From attendance & assignments to AI study plans and placement prep —
            CampusFlow is the only workspace your college journey needs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-slide-up delay-200"
            style={{ animationFillMode: "both" }}>
            <Link href="/login">
              <button className="glass-btn h-14 px-8 rounded-2xl text-base font-bold flex items-center gap-2 shadow-xl">
                Start for Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="h-14 px-8 rounded-2xl text-base font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  backdropFilter: "blur(12px)",
                  color: "#7c3aed",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.08)"
                }}>
                <GraduationCap className="w-5 h-5" /> Sign In as Student
              </button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 animate-fade-in delay-400"
            style={{ animationFillMode: "both" }}>
            {["No credit card required", "Set up in 2 minutes", "AI-powered features"].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#9580c4" }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)" }}>
                  <svg className="w-2.5 h-2.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual mockup */}
        <div className="max-w-5xl mx-auto mt-16 animate-slide-up delay-300" style={{ animationFillMode: "both" }}>
          <div className="glass-card p-6" style={{ borderRadius: "28px", boxShadow: "0 24px 80px rgba(124,58,237,0.18)" }}>
            {/* Fake dashboard preview */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-7 rounded-xl" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.15)" }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Assignments", val: "5", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
                { label: "Materials", val: "12", color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
                { label: "Notices", val: "3", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
                { label: "Attendance", val: "88%", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-2xl" style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#9580c4" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["AI Study Plan ready ✨", "3 assignments due this week", "Notice: Exam on July 4th"].map((item, i) => (
                <div key={i} className="p-3 rounded-2xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(167,139,250,0.12)", color: "#5b4f8a" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8" style={{ borderRadius: "28px" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(124,58,237,0.1)" }}>
                      <Icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
                    <div className="text-sm font-medium" style={{ color: "#9580c4" }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-semibold"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", color: "#7c3aed" }}>
              Everything you need
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#1e1b4b" }}>
              Built for every role on campus
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7c6fa0" }}>
              Whether you're a student, teacher, or administrator — CampusFlow has a dedicated experience built for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group animate-slide-up"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: "both",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(32px)",
                    WebkitBackdropFilter: "blur(32px)",
                    border: "1px solid rgba(255,255,255,0.30)",
                    boxShadow: "0 8px 32px rgba(124,58,237,0.06), inset 0 1px 0 rgba(255,255,255,0.45)",
                    padding: "28px",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-6px)";
                    el.style.boxShadow = `0 20px 48px ${f.color}28, 0 8px 24px rgba(124,58,237,0.10), inset 0 1px 0 rgba(255,255,255,0.5)`;
                    el.style.border = `1px solid ${f.border}`;
                    el.style.background = `rgba(255,255,255,0.15)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 8px 32px rgba(124,58,237,0.06), inset 0 1px 0 rgba(255,255,255,0.45)";
                    el.style.border = "1px solid rgba(255,255,255,0.30)";
                    el.style.background = "rgba(255,255,255,0.08)";
                  }}
                >
                  {/* Icon bubble */}
                  <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      width: "52px", height: "52px",
                      background: `linear-gradient(135deg, ${f.bg}, rgba(255,255,255,0.4))`,
                      border: `1.5px solid ${f.border}`,
                      backdropFilter: "blur(8px)",
                      boxShadow: `0 4px 16px ${f.color}20`,
                    }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-lg font-extrabold mb-2" style={{ color: "#1e1b4b" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7c6fa0" }}>{f.desc}</p>

                  {/* Bottom accent line */}
                  <div className="mt-5 h-0.5 rounded-full w-10 transition-all duration-300 group-hover:w-20"
                    style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#1e1b4b" }}>
              Up and running in{" "}
              <span className="gradient-text">60 seconds</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Create your account", desc: "Sign up as a student, teacher, or admin in under a minute. No setup required.", icon: GraduationCap },
              { step: "02", title: "Connect your class", desc: "Your teacher publishes assignments, materials & notices — you see them instantly.", icon: Users },
              { step: "03", title: "Let AI do the rest", desc: "Get smart study plans, attendance alerts, and placement prep powered by Gemini AI.", icon: BrainCircuit },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="glass-card p-6 relative overflow-hidden" style={{ borderRadius: "24px" }}>
                  <div className="absolute -top-3 -right-3 text-8xl font-black opacity-[0.04]" style={{ color: "#7c3aed" }}>
                    {s.step}
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
                      style={{ background: "rgba(124,58,237,0.1)" }}>
                      <Icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="text-xs font-black mb-2 tracking-widest" style={{ color: "#a78bfa" }}>STEP {s.step}</div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: "#1e1b4b" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#7c6fa0" }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#1e1b4b" }}>
              Loved by students & faculty
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass-card p-6" style={{ borderRadius: "24px" }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#5b4f8a" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#1e1b4b" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#b09fd4" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center relative overflow-hidden" style={{ borderRadius: "32px" }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb orb-violet w-64 h-64 -top-16 -right-16 animate-blob" style={{ opacity: 0.2 }} />
              <div className="orb orb-pink w-48 h-48 -bottom-12 -left-12 animate-blob-delayed" style={{ opacity: 0.15 }} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", boxShadow: "0 12px 32px rgba(124,58,237,0.4)" }}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#1e1b4b" }}>
                Ready to transform your campus life?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#7c6fa0" }}>
                Join thousands of students already using CampusFlow to study smarter, never miss deadlines, and ace their placements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login">
                  <button className="glass-btn h-14 px-10 rounded-2xl text-base font-bold flex items-center gap-2 shadow-xl mx-auto">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
            CF
          </div>
          <span className="text-base font-black gradient-text">CampusFlow</span>
        </div>
        <p className="text-sm" style={{ color: "#b09fd4" }}>
          © {new Date().getFullYear()} CampusFlow. Built with ❤️ for students everywhere.
        </p>
      </footer>
    </div>
  );
}
