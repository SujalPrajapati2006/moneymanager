import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "CEO & Co-Founder",
    bio: "10+ years in fintech. Passionate about making financial wellness accessible to everyone.",
    avatar: "AM",
    color: "#7C3AED",
  },
  {
    name: "Priya Sharma",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer. Obsessed with building secure, scalable financial infrastructure.",
    avatar: "PS",
    color: "#059669",
  },
  {
    name: "Rohit Verma",
    role: "Head of Design",
    bio: "Believes great UX is the difference between a tool people use and one they love.",
    avatar: "RV",
    color: "#DC2626",
  },
  {
    name: "Sneha Patel",
    role: "Head of Product",
    bio: "Turns complex financial data into insights that actually help people make better decisions.",
    avatar: "SP",
    color: "#D97706",
  },
];

const values = [
  {
    icon: "🔒",
    title: "Security First",
    desc: "Your financial data is encrypted and protected with bank-level security protocols.",
  },
  {
    icon: "💡",
    title: "Clarity Over Complexity",
    desc: "We strip away the noise so you can focus on what actually matters for your finances.",
  },
  {
    icon: "🌱",
    title: "Grow Together",
    desc: "We build features based on real feedback from real users who trust us with their finances.",
  },
  {
    icon: "⚡",
    title: "Always Improving",
    desc: "Our team ships updates weekly to make your experience smoother and more powerful.",
  },
];

const stats = [
  { number: "2M+", label: "Active Users" },
  { number: "₹500Cr+", label: "Tracked Monthly" },
  { number: "4.9★", label: "App Rating" },
  { number: "99.9%", label: "Uptime" },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 60px", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/home")}>
          <span style={{ fontSize: 28 }}>🐷</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>Money Manager</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["Home", "/home"], ["About us", "/about"], ["Contact us", "/contact"]].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{
              cursor: "pointer", color: path === "/about" ? "#7C3AED" : "#64748b",
              fontWeight: path === "/about" ? 600 : 400, fontSize: 15,
              borderBottom: path === "/about" ? "2px solid #7C3AED" : "none", paddingBottom: 2
            }}>{label}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "9px 22px", borderRadius: 8, border: "1px solid #e2e8f0",
            background: "#fff", color: "#1e293b", fontWeight: 500, cursor: "pointer", fontSize: 14
          }}>Login</button>
          <button onClick={() => navigate("/signup")} style={{
            padding: "9px 22px", borderRadius: 8, border: "none",
            background: "#7C3AED", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14
          }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
        padding: "80px 60px", textAlign: "center", color: "#fff"
      }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.15)",
          borderRadius: 50, padding: "8px 20px", fontSize: 13, fontWeight: 600,
          marginBottom: 20, backdropFilter: "blur(10px)"
        }}>✨ Our Story</div>
        <h1 style={{ fontSize: 52, fontWeight: 800, margin: "0 0 20px", lineHeight: 1.15 }}>
          Built for People Who <br />Care About Their Money
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
          We started Money Manager because we were tired of complex financial apps that made budgeting feel like a chore. There had to be a better way.
        </p>
        <button onClick={() => navigate("/signup")} style={{
          padding: "14px 36px", borderRadius: 50, border: "2px solid rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700,
          fontSize: 16, cursor: "pointer", backdropFilter: "blur(10px)"
        }}>Start Your Journey →</button>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px", background: "#fff" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24, maxWidth: 900, margin: "0 auto"
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#7C3AED" }}>{s.number}</div>
              <div style={{ color: "#64748b", fontSize: 14, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "80px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ color: "#7C3AED", fontWeight: 600, fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Our Mission</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1e293b", margin: "0 0 20px", lineHeight: 1.25 }}>
              Financial Clarity for Every Indian
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
              We believe financial wellness shouldn't be a privilege. Whether you're tracking your first salary or managing a growing business, Money Manager gives you the tools, insights, and confidence to make smart financial decisions.
            </p>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.8 }}>
              Founded in 2023, we've helped over 2 million users take control of their money — and we're just getting started.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {values.map((v) => (
              <div key={v.title} style={{
                background: "#f8fafc", borderRadius: 16, padding: 24,
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14, marginBottom: 8 }}>{v.title}</div>
                <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "80px 60px", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ color: "#7C3AED", fontWeight: 600, fontSize: 13, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>The Team</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#1e293b", margin: 0 }}>People Behind the Product</h2>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24, maxWidth: 1000, margin: "0 auto"
        }}>
          {teamMembers.map((m) => (
            <div key={m.name} style={{
              background: "#f8fafc", borderRadius: 20, padding: 28,
              textAlign: "center", border: "1px solid #e2e8f0",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: m.color, color: "#fff", fontWeight: 800,
                fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px"
              }}>{m.avatar}</div>
              <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 16 }}>{m.name}</div>
              <div style={{ color: m.color, fontSize: 12, fontWeight: 600, margin: "4px 0 12px" }}>{m.role}</div>
              <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{m.bio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 60px", textAlign: "center",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ede9fe 100%)"
      }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1e293b", margin: "0 0 16px" }}>
          Ready to take control?
        </h2>
        <p style={{ color: "#64748b", fontSize: 17, marginBottom: 32 }}>
          Join 2 million+ users who trust Money Manager with their finances.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => navigate("/signup")} style={{
            padding: "14px 36px", borderRadius: 50, border: "none",
            background: "#7C3AED", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer"
          }}>Get Started Free</button>
          <button onClick={() => navigate("/contact")} style={{
            padding: "14px 36px", borderRadius: 50, border: "2px solid #7C3AED",
            background: "transparent", color: "#7C3AED", fontWeight: 700, fontSize: 16, cursor: "pointer"
          }}>Contact Us →</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 60px", background: "#1e293b", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
          © 2024 Money Manager. Made with ❤️ in India.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;