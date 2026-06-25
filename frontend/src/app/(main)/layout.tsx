import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0eeff 0%, #e8e0ff 30%, #f5f0ff 60%, #eee8ff 100%)" }}>

      {/* Ambient background orbs */}
      <div className="orb orb-lavender animate-blob w-[500px] h-[500px] -top-32 -right-32 pointer-events-none z-0" style={{ opacity: 0.3 }} />
      <div className="orb orb-violet animate-blob-long w-[400px] h-[400px] bottom-0 -left-24 pointer-events-none z-0" style={{ opacity: 0.2 }} />
      <div className="orb orb-pink animate-blob-delayed w-72 h-72 top-1/2 left-1/2 pointer-events-none z-0" style={{ opacity: 0.15 }} />

      <Sidebar className="w-64 hidden lg:block fixed h-full z-30" />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative z-10">
        <Header />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
