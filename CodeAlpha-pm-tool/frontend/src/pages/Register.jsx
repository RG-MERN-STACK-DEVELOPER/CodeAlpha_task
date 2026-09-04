import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =========================
   Icons
========================= */

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
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
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="m7 16 4-5 3 3 5-7" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 3 18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.2 17.2 0 0 1-3.1 3.9" />
    <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.5 4.5-1.1" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
    <path d="M10 12v2h4v-2" />
  </svg>
);

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
    <path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
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
);

/* =========================
   Perks
========================= */

const perks = [
  {
    icon: UsersIcon,
    title: "Collaborate effortlessly",
    desc: "Comment, mention, share files and keep your team aligned.",
  },
  {
    icon: CheckIcon,
    title: "Stay on track",
    desc: "Set priorities, track progress and never miss a deadline.",
  },
  {
    icon: ChartIcon,
    title: "Everything in one place",
    desc: "Projects, tasks, files, chats and more, all in one workspace.",
  },
];

/* =========================
   Password Strength
========================= */

function getPasswordStrength(password) {
  if (!password) {
    return {
      label: "",
      percent: 0,
      color: "bg-gray-200",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      label: "Weak",
      percent: 33,
      color: "bg-red-400",
    };
  }

  if (score <= 2) {
    return {
      label: "Medium",
      percent: 66,
      color: "bg-amber-400",
    };
  }

  return {
    label: "Strong",
    percent: 100,
    color: "bg-emerald-500",
  };
}

/* =========================
   Register
========================= */

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  });

  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* =========================
          LEFT BRANDING PANEL
      ========================= */}

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
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-white mb-8"
          >
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
              <ChartIcon className="w-5 h-5" />
            </span>

            PM Tool
          </Link>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full mb-5 border border-white/10">
            <SparkleIcon className="w-3.5 h-3.5" />
            Simple project management for modern teams
          </span>

          {/* Heading */}
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
            Create your workspace and bring your team, projects,
            and ideas together in one beautiful place.
          </p>

          {/* Mini Dashboard */}
          <div className="relative mb-10">
            <div className="bg-[#151033] border border-white/10 rounded-xl p-3 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">
                  Project Launch
                </span>

                <div className="flex -space-x-1.5">
                  {[
                    {
                      l: "S",
                      c: "from-pink-400 to-rose-500",
                    },
                    {
                      l: "A",
                      c: "from-blue-400 to-indigo-500",
                    },
                    {
                      l: "J",
                      c: "from-amber-400 to-orange-500",
                    },
                  ].map((a) => (
                    <span
                      key={a.l}
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${a.c} text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-[#151033]`}
                    >
                      {a.l}
                    </span>
                  ))}

                  <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-[#151033]">
                    +3
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "To Do",
                    count: 4,
                    rows: 2,
                  },
                  {
                    label: "In Progress",
                    count: 3,
                    rows: 1,
                  },
                  {
                    label: "Done",
                    count: 2,
                    rows: 1,
                  },
                ].map((col) => (
                  <div
                    key={col.label}
                    className="bg-white/5 rounded-lg p-2"
                  >
                    <p className="text-[9px] font-medium text-indigo-100/50 mb-1.5">
                      {col.label} · {col.count}
                    </p>

                    {Array.from({
                      length: col.rows,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white/10 rounded p-1.5 mb-1"
                      >
                        <span className="block h-1 w-3/4 bg-white/20 rounded-full mb-1.5" />

                        <div className="flex -space-x-1">
                          <span className="w-3 h-3 rounded-full bg-pink-400/70" />
                          <span className="w-3 h-3 rounded-full bg-blue-400/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <button className="w-full mt-2 text-[9px] text-indigo-100/40 text-left px-1">
                + Add task
              </button>
            </div>

            {/* Progress Card */}
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
                      2 * Math.PI * 15 * (1 - 0.72)
                    }
                  />
                </svg>

                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-primary">
                  72%
                </span>
              </div>

              <div>
                <p className="text-[9px] font-semibold text-gray-800">
                  Project progress
                </p>

                <p className="text-[8px] text-emerald-500">
                  +16% this week
                </p>
              </div>
            </div>
          </div>

          {/* Perks */}
          <ul className="space-y-4 mb-8">
            {perks.map((p) => {
              const Icon = p.icon;

              return (
                <li
                  key={p.title}
                  className="flex items-start gap-3"
                >
                  <span className="w-9 h-9 rounded-full bg-white/10 text-indigo-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {p.title}
                    </p>

                    <p className="text-xs text-indigo-100/50">
                      {p.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-100/40">
          © 2026 PM Tool. All rights reserved.
        </p>
      </div>

      {/* =========================
          RIGHT FORM PANEL
      ========================= */}

      <div className="relative flex flex-col bg-surface px-6 py-8 overflow-y-auto">
        {/* Login */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">
              Already have an account?
            </span>

            <Link
              to="/login"
              className="border border-gray-200 bg-white text-primary font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl shadow-xl p-8 hero-animate text-center"
          >
            {/* Register Icon */}
            <span className="inline-flex w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white items-center justify-center mb-4 glow-primary">
              <UserIcon className="w-6 h-6" />
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Create{" "}
              <span className="text-primary">
                your
              </span>{" "}
              account
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Get started with your free PM Tool account
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-2.5 rounded-lg mb-4 border border-red-100 text-left">
                {error}
              </div>
            )}

            <div className="text-left">
              {/* Full Name */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>

              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon className="w-4 h-4" />
                </span>

                <input
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work email
              </label>

              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MailIcon className="w-4 h-4" />
                </span>

                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Password */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative mb-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon className="w-4 h-4" />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
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
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {form.password && (
                <div className="mb-4">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          strength.percent >=
                          (i + 1) * 33
                            ? strength.color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">
                    Password strength:{" "}
                    <span
                      className={
                        strength.label === "Weak"
                          ? "text-red-500 font-medium"
                          : strength.label === "Medium"
                          ? "text-amber-500 font-medium"
                          : "text-emerald-600 font-medium"
                      }
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>

              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon className="w-4 h-4" />
                </span>

                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm((s) => !s)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Company */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company or team name{" "}
                <span className="text-gray-400 font-normal">
                  (optional)
                </span>
              </label>

              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <BriefcaseIcon className="w-4 h-4" />
                </span>

                <input
                  placeholder="Enter your company or team name"
                  className="w-full bg-white/70 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm text-gray-600 mb-6 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(e.target.checked)
                  }
                  className="w-4 h-4 mt-0.5 accent-primary flex-shrink-0"
                />

                <span>
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-lg py-2.5 font-semibold hover:bg-indigo-700 transition-all hover:scale-[1.02] disabled:opacity-60 glow-primary"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR
                </span>

                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon />
                Sign up with Google
              </button>
            </div>
          </form>

          {/* Security Card */}
          <div className="glass rounded-xl p-4 mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                <ShieldIcon className="w-5 h-5" />
              </span>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Your data is safe with us
                </p>

                <p className="text-xs text-gray-500">
                  We use enterprise-grade security to protect
                  your information.
                </p>
              </div>
            </div>

            <span className="hidden sm:flex text-primary flex-shrink-0">
              <LockIcon className="w-6 h-6" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}