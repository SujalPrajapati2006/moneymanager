import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const contactOptions = [
  { icon: "📧", title: "Email Support", value: "support@moneymanager.in", sub: "Reply within 24 hours" },
  { icon: "💬", title: "Live Chat", value: "Available in app", sub: "Mon–Sat, 9am–6pm IST" },
  { icon: "📞", title: "Phone", value: "+91 98765 43210", sub: "Mon–Fri, 10am–5pm IST" },
  { icon: "🏢", title: "Office", value: "Bengaluru, Karnataka", sub: "India" },
];

const faqs = [
  { q: "Is my financial data safe?", a: "Absolutely. We use AES-256 encryption and never share your data with third parties." },
  { q: "Can I export my transactions?", a: "Yes! You can export your data as CSV or PDF from the Filters section." },
  { q: "Is Money Manager free?", a: "Our core features are completely free. We offer a Pro plan for advanced analytics and multi-account tracking." },
  { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login screen. You'll receive a reset link within 2 minutes." },
];

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 60px", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <span style={{ fontSize: 28 }}>🐷</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>Money Manager</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["Home", "/home"], ["About us", "/about"], ["Contact us", "/contact"]].map(([label, path]) => (
            <span
              key={label}
              onClick={() => navigate(path)}
              style={{
                cursor: "pointer",
                color: path === "/contact" ? "#7C3AED" : "#64748b",
                fontWeight: path === "/contact" ? 600 : 400,
                fontSize: 15,
                borderBottom: path === "/contact" ? "2px solid #7C3AED" : "none",
                paddingBottom: 2,
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "9px 22px", borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fff", color: "#1e293b", fontWeight: 500, cursor: "pointer", fontSize: 14,
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "9px 22px", borderRadius: 8, border: "none",
              background: "#7C3AED", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        padding: "70px 60px", textAlign: "center", color: "#fff",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.15)",
          borderRadius: 50, padding: "8px 20px", fontSize: 13, fontWeight: 600,
          marginBottom: 20,
        }}>
          💬 We're here to help
        </div>
        <h1 style={{ fontSize: 50, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          Have a question, suggestion, or just want to say hello? Our team is ready to help.
        </p>
      </section>

      {/* Contact Cards */}
      <section style={{ padding: "60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 60 }}>
          {contactOptions.map((c) => (
            <div key={c.title} style={{
              background: "#fff", borderRadius: 16, padding: 28, textAlign: "center",
              border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15, marginBottom: 6 }}>{c.title}</div>
              <div style={{ color: "#059669", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{c.value}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + FAQ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

          {/* Contact Form */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 40,
            border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
              Send us a Message
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
              We typically reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="john@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Subject</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Select a topic...</option>
                  <option value="general">General Inquiry</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="technical">Technical Support</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Report a Bug</option>
                </select>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  style={{ ...inputStyle, height: 120, resize: "vertical" }}
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  width: "100%", padding: "14px", borderRadius: 10, border: "none",
                  background: sending ? "#a78bfa" : "#7C3AED", color: "#fff",
                  fontWeight: 700, fontSize: 16, cursor: sending ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {sending ? "Sending..." : "Send Message ✉️"}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
              Frequently Asked
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
              Quick answers to common questions.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden",
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", padding: "18px 20px", background: "none", border: "none",
                      textAlign: "left", cursor: "pointer", display: "flex",
                      justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{faq.q}</span>
                    <span style={{
                      fontSize: 18, color: "#7C3AED", fontWeight: 700,
                      display: "inline-block",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 20px 18px", color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div style={{
              marginTop: 28, background: "linear-gradient(135deg, #ede9fe, #f0fdf4)",
              borderRadius: 16, padding: 24, border: "1px solid #e2e8f0",
            }}>
              <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: 12, fontSize: 15 }}>Follow Us</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["🐦 Twitter", "#1DA1F2"], ["💼 LinkedIn", "#0A66C2"], ["📸 Instagram", "#E1306C"]].map(([label, color]) => (
                  <button key={label} style={{
                    padding: "8px 16px", borderRadius: 8, border: `1px solid ${color}`,
                    background: "transparent", color: color, fontWeight: 600,
                    fontSize: 12, cursor: "pointer",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px 60px", background: "#1e293b", textAlign: "center", marginTop: 20 }}>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
          © 2024 Money Manager. Made with ❤️ in India.
        </p>
      </footer>

    </div>
  );
};

export default ContactUs;