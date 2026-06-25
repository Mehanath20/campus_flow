export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0eeff 0%, #e4dcff 30%, #f5f0ff 70%, #ede0ff 100%)" }}>

      {/* Animated ambient orbs */}
      <div className="orb orb-violet animate-blob w-96 h-96 -top-20 -left-20" />
      <div className="orb orb-pink animate-blob-delayed w-80 h-80 top-1/3 -right-16" />
      <div className="orb orb-blue animate-blob-long w-72 h-72 bottom-0 left-1/3" />
      <div className="orb orb-lavender animate-blob w-64 h-64 top-10 right-1/3" />

      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124,58,237,0.06) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-12 left-16 w-16 h-16 rounded-2xl rotate-12 animate-float glass-card opacity-60" />
      <div className="absolute bottom-20 right-20 w-12 h-12 rounded-xl -rotate-6 animate-float-delayed glass-card opacity-50" />
      <div className="absolute top-1/2 left-8 w-8 h-8 rounded-full animate-float glass-card opacity-40" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        {children}
      </div>
    </div>
  );
}
