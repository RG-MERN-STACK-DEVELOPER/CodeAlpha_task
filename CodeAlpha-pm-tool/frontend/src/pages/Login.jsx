import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  Logo: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),

  Check: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4 4L19 7" />
    </svg>
  ),

  Users: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  Chart: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h17" />
      <path d="M7 15l3-4 3 2 5-7" />
      <path d="M18 6h2v2" />
    </svg>
  ),

  Shield: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l8 3v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),

  Lock: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),

  Mail: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),

  Eye: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),

  EyeOff: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a17.4 17.4 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 8 10 8c1.7 0 3.2-.4 4.5-1" />
    </svg>
  ),

  Rocket: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4c2.5-2.5 6-2 6-2s.5 3.5-2 6l-7.5 7.5-4-4L14 4z" />
      <path d="M9 15l-4 4" />
      <path d="M5 19l-2 2" />
      <path d="M14 8l2 2" />
      <path d="M6.5 12.5l-3 .5-1 3 4.5-1.5" />
      <circle cx="15.5" cy="6.5" r="1" />
    </svg>
  ),

  Sparkles: () => (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M5.6 5.6l2.8 2.8" />
      <path d="M15.6 15.6l2.8 2.8" />
      <path d="M18.4 5.6l-2.8 2.8" />
      <path d="M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
};

const perks = [
  {
    icon: <Icons.Check />,
    title: "Organize projects and tasks",
    desc: "Keep everything in one place and never miss a deadline.",
  },
  {
    icon: <Icons.Users />,
    title: "Collaborate with your team",
    desc: "Comment, mention, share files and stay aligned.",
  },
  {
    icon: <Icons.Chart />,
    title: "Track progress in real time",
    desc: "Get visibility into what's done, what's in progress, and what's next.",
  },
];

const trustBadges = [
  {
    icon: <Icons.Shield />,
    text: "Enterprise-grade security",
  },
  {
    icon: <Icons.Lock />,
    text: "Your data is always safe",
  },
  {
    icon: <Icons.Users />,
    text: "Trusted by modern teams worldwide",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* =====================================================
          LEFT BRANDING PANEL
      ===================================================== */}

      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0e0a2e] via-[#180f3e] to-[#1c1147] p-10">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div
            className="blob w-80 h-80 bg-purple-700 -top-20 -left-20"
            style={{ opacity: 0.3 }}
          />

          <div
            className="blob w-72 h-72 bg-indigo-600 bottom-0 right-0"
            style={{
              opacity: 0.2,
              animationDelay: "2.5s",
            }}
          />

        </div>

        <div className="relative">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-white mb-8"
          >
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Icons.Logo />
            </span>

            PM Tool
          </Link>

          {/* BADGE */}

          <span className="inline-flex items-center gap-1.5 bg-white/10 text-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full mb-5 border border-white/10">

            <Icons.Sparkles />

            Simple project management for modern teams

          </span>

          {/* HEADING */}

          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">

            Plan smarter.
            <br />

            Work together.
            <br />

            <span className="text-indigo-300">
              Get things done.
            </span>

          </h1>

          <p className="text-indigo-100/60 text-sm max-w-sm mb-6">
            All-in-one workspace to organize projects,
            manage tasks, and collaborate seamlessly from
            start to finish.
          </p>

          {/* MINI DASHBOARD */}

          <div className="relative mb-10">

            <div className="bg-[#151033] border border-white/10 rounded-xl p-3 shadow-2xl">

              <div className="grid grid-cols-3 gap-2">

                {[
                  {
                    label: "To Do",
                    rows: 3,
                  },
                  {
                    label: "In Progress",
                    rows: 2,
                  },
                  {
                    label: "Done",
                    rows: 3,
                  },
                ].map((col) => (

                  <div
                    key={col.label}
                    className="bg-white/5 rounded-lg p-2"
                  >

                    <p className="text-[9px] font-medium text-indigo-100/50 mb-1.5">
                      {col.label}
                    </p>

                    {Array.from({
                      length: col.rows,
                    }).map((_, i) => (

                      <div
                        key={i}
                        className="bg-white/10 rounded p-1.5 mb-1 flex items-center gap-1"
                      >

                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0" />

                        <span className="h-1 flex-1 bg-white/20 rounded-full" />

                      </div>

                    ))}

                  </div>

                ))}

              </div>

            </div>

            {/* PROGRESS CARD */}

            <div className="absolute -bottom-6 -right-3 glass-strong rounded-lg p-3 shadow-2xl flex items-center gap-2 w-40">

              <div className="relative w-9 h-9 flex-shrink-0">

                <svg
                  viewBox="0 0 36 36"
                  className="w-9 h-9 -rotate-90"
                >

                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                  />

                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 15}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      15 *
                      (1 - 0.72)
                    }
                  />

                </svg>

                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-primary">
                  72%
                </span>

              </div>

              <div>

                <p className="text-[9px] font-semibold text-gray-800">
                  Team progress
                </p>

                <p className="text-[8px] text-emerald-500">
                  +16% this week
                </p>

              </div>

            </div>

          </div>

          {/* PERKS */}

          <ul className="space-y-4 mb-8">

            {perks.map((perk) => (

              <li
                key={perk.title}
                className="flex items-start gap-3"
              >

                <span className="w-9 h-9 rounded-full bg-white/10 text-indigo-200 flex items-center justify-center flex-shrink-0">
                  {perk.icon}
                </span>

                <div>

                  <p className="text-sm font-semibold text-white">
                    {perk.title}
                  </p>

                  <p className="text-xs text-indigo-100/50">
                    {perk.desc}
                  </p>

                </div>

              </li>

            ))}

          </ul>

        </div>

        <p className="relative text-xs text-indigo-100/40">
          © 2026 PM Tool. All rights reserved.
        </p>

      </div>

      {/* =====================================================
          RIGHT FORM PANEL
      ===================================================== */}

      <div className="relative flex items-center justify-center bg-surface px-6 py-12">

        <div className="w-full max-w-sm">

          <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl shadow-xl p-8 hero-animate text-center"
          >

            {/* LOGO */}

            <span className="inline-flex w-12 h-12 rounded-xl bg-primary text-white items-center justify-center mb-4 glow-primary">
              <Icons.Logo />
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Sign in to continue to your workspace
            </p>

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-2.5 rounded-lg mb-4 border border-red-100 text-left">
                {error}
              </div>
            )}

            <div className="text-left">

              {/* EMAIL */}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>

              <div className="relative mb-4">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Mail />
                </span>

                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

              </div>

              {/* PASSWORD */}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative mb-3">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Lock />
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="Enter your password"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((s) => !s)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >

                  {showPassword ? (
                    <Icons.EyeOff />
                  ) : (
                    <Icons.Eye />
                  )}

                </button>

              </div>

              {/* REMEMBER + FORGOT */}

              <div className="flex items-center justify-between mb-6 text-sm">

                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                    className="w-4 h-4 accent-primary"
                  />

                  Remember me

                </label>

                <a
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  Forgot password?
                </a>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-lg py-2.5 font-semibold hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-60 glow-primary"
              >

                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In

                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h13" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}

              </button>

              {/* DIVIDER */}

              <div className="flex items-center gap-3 my-5">

                <div className="flex-1 h-px bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR
                </span>

                <div className="flex-1 h-px bg-gray-200" />

              </div>

              {/* GOOGLE */}

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >

                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
                  />

                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33z"
                  />

                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
                  />

                </svg>

                Continue with Google

              </button>

              {/* REGISTER */}

              <p className="text-sm text-gray-500 mt-6 text-center">

                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Create one free
                </Link>

              </p>

            </div>

          </form>

          {/* TRUST BADGES */}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-gray-500">

            {trustBadges.map((badge) => (

              <span
                key={badge.text}
                className="flex items-center gap-1.5"
              >

                <span className="text-primary">
                  {badge.icon}
                </span>

                {badge.text}

              </span>

            ))}

          </div>

          {/* GET STARTED CARD */}

          <div className="glass rounded-xl p-4 mt-6 flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <span className="w-9 h-9 rounded-lg bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                <Icons.Rocket />
              </span>

              <div>

                <p className="text-sm font-semibold text-gray-800">
                  New to PM Tool?
                </p>

                <p className="text-xs text-gray-500">
                  Create your account in less than a minute.
                </p>

              </div>

            </div>

            <Link
              to="/register"
              className="flex-shrink-0 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Get Started →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}