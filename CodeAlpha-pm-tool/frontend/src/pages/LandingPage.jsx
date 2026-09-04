import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Counter from "../components/Counter.jsx";

/* =========================
   ICONS
========================= */

const Icons = {
  Logo: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  ),

  ArrowRight: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),

  Play: () => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  ),

  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  ),

  Folder: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  ),

  Users: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  Tasks: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m3 6 2 2 4-4" />
      <path d="M3 12l2 2 4-4" />
      <path d="M3 18l2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  ),

  Calendar: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),

  Settings: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 9.46 15a1.7 1.7 0 0 0-1.56-1.03H7.8v-2h.1A1.7 1.7 0 0 0 9.46 11a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.43 6.5V6h2v.5A1.7 1.7 0 0 0 16.46 8a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.97 12H21v2h-.03A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  ),

  Clock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),

  Bell: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),

  Chart: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </svg>
  ),

  Layout: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
    </svg>
  ),

  ArrowUp: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  ),

  Rocket: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d="M14 4c3-1 5-1 6-1 0 1 0 3-1 6-1.5 3.5-5 6.5-9 8l-3-3c1.5-4 4.5-7.5 8-9Z" />
      <path d="M7 14 4 17l3 3 3-3" />
      <path d="M10 7 7 4" />
      <circle cx="16" cy="8" r="1.5" />
    </svg>
  ),

  Home: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),

  More: () => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  ),
};

/* =========================
   STATS
========================= */

const stats = [
  {
    end: 120,
    suffix: "+",
    label: "Tasks Managed",
    icon: <Icons.Tasks />,
  },
  {
    end: 24,
    suffix: "",
    label: "Active Projects",
    icon: <Icons.Folder />,
  },
  {
    end: 98,
    suffix: "%",
    label: "Team Satisfaction",
    icon: <Icons.Users />,
  },
  {
    end: 5,
    suffix: "K+",
    label: "Happy Users",
    icon: <Icons.Chart />,
  },
];

/* =========================
   FEATURES
========================= */

const features = [
  {
    icon: <Icons.Folder />,
    title: "Project Management",
    desc: "Group projects, set timelines and keep everything on track.",
  },
  {
    icon: <Icons.Tasks />,
    title: "Task Management",
    desc: "Create tasks, assign owners, set priorities and add subtasks.",
  },
  {
    icon: <Icons.Users />,
    title: "Team Collaboration",
    desc: "Comment, mention teammates and share updates right where work happens.",
  },
  {
    icon: <Icons.Layout />,
    title: "Kanban Boards",
    desc: "Visualize work with drag & drop Kanban boards.",
  },
  {
    icon: <Icons.Clock />,
    title: "Deadlines & Priorities",
    desc: "Set due dates, add priorities and focus on what matters most.",
  },
  {
    icon: <Icons.Bell />,
    title: "Real-Time Notifications",
    desc: "Stay updated with instant notifications and never miss anything.",
  },
];

/* =========================
   HOW IT WORKS
========================= */

const steps = [
  {
    n: "01",
    title: "Create your project",
    desc: "Set up your workspace and invite your team.",
  },
  {
    n: "02",
    title: "Organize & assign tasks",
    desc: "Break down work, assign owners and set priorities.",
  },
  {
    n: "03",
    title: "Track progress & deliver",
    desc: "See progress in real-time and get things done faster.",
  },
];

/* =========================
   PROJECT DATA
========================= */

const projectsOverview = [
  {
    name: "Website Redesign",
    percent: 72,
    color: "bg-primary",
  },
  {
    name: "Mobile App",
    percent: 45,
    color: "bg-blue-500",
  },
  {
    name: "Marketing Campaign",
    percent: 88,
    color: "bg-emerald-500",
  },
];

const activity = [
  {
    text: "Sarah completed Homepage Design",
    time: "12 minutes ago",
  },
  {
    text: "Ali commented on API Integration",
    time: "48 minutes ago",
  },
  {
    text: "John created a new task",
    time: "2 hours ago",
  },
];

const deadlines = [
  {
    title: "Marketing Campaign launch",
    date: "Aug 09",
  },
  {
    title: "API integration handoff",
    date: "Aug 11",
  },
  {
    title: "Homepage hero review",
    date: "Aug 15",
  },
];

/* =========================
   PRICING
========================= */

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "For individuals getting started",
    features: [
      "3 Projects",
      "Unlimited Tasks",
      "Kanban Boards",
      "Community Support",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Team",
    price: "$12",
    tagline: "For growing teams",
    features: [
      "Unlimited Projects",
      "Team Roles & Permissions",
      "Calendar & Timeline",
      "Priority Support",
    ],
    cta: "Start 14-day free trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "$24",
    tagline: "For advanced teams",
    features: [
      "Advanced Reporting",
      "Guest Access",
      "Audit Logs & SSO",
      "Dedicated Account Manager",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
];

/* =========================
   LANDING PAGE
========================= */

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* =========================
          SCROLL PROGRESS
      ========================= */}

      <div className="fixed top-0 left-0 w-full h-1 z-[120] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-400 transition-[width] duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      {/* =========================
          FIXED NAVBAR
      ========================= */}

      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 py-4 bg-[#0e0a2e]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-white"
        >
          <span className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Icons.Logo />
          </span>

          PM Tool
        </Link>

        {/* Desktop Navigation */}

        <div className="hidden md:flex items-center gap-8 text-sm text-indigo-100/80 font-medium">

          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>

          <a
            href="#pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </a>

          <a
            href="#footer"
            className="hover:text-white transition-colors"
          >
            Resources
          </a>

        </div>

        {/* Navbar Buttons */}

        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="hidden sm:block text-sm text-white font-medium border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg shadow-indigo-900/50"
          >
            Get Started Free
          </Link>

        </div>
      </nav>

      {/* =========================
          BACK TO TOP
      ========================= */}

      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-indigo-900/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-indigo-700 ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <Icons.ArrowUp />
      </button>

      {/* =========================
          HERO
      ========================= */}

      <div className="relative bg-gradient-to-b from-[#0e0a2e] via-[#180f3e] to-[#1c1147]">

        {/* Background Blobs */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div
            className="blob w-96 h-96 bg-purple-700 -top-20 -left-20"
            style={{ opacity: 0.3 }}
          />

          <div
            className="blob w-96 h-96 bg-indigo-600 top-40 right-0"
            style={{
              opacity: 0.25,
              animationDelay: "2.5s",
            }}
          />

        </div>

        {/* Hero Content */}

        <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Hero Text */}

          <div className="text-center lg:text-left">

            <span className="hero-animate inline-flex items-center gap-2 bg-white/10 text-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/10">

              <span className="text-indigo-300">
                <Icons.Chart />
              </span>

              Simple project management for modern teams

            </span>

            <h1 className="hero-animate-delay-1 text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">

              Plan smarter.

              <br />

              Work together.

              <br />

              <span className="text-indigo-300">
                Get things done.
              </span>

            </h1>

            <p className="hero-animate-delay-2 text-indigo-100/70 max-w-md mx-auto lg:mx-0 mb-8">

              All-in-one workspace to organize projects, manage tasks,
              and collaborate seamlessly from start to finish.

            </p>

            <div className="hero-animate-delay-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5">

              <Link
                to="/register"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg shadow-indigo-900/50 flex items-center gap-2"
              >
                Get Started Free
                <Icons.ArrowRight />
              </Link>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                <Icons.Play />
                See How It Works
              </a>

            </div>

            <p className="hero-animate-delay-3 text-xs text-indigo-100/50 flex items-center justify-center lg:justify-start gap-4">

              <span className="flex items-center gap-1">
                <Icons.Check />
                Free forever plan
              </span>

              <span className="flex items-center gap-1">
                <Icons.Check />
                No credit card required
              </span>

            </p>

          </div>

          {/* Dashboard Preview */}

          <div className="hero-animate-delay-2 relative">

            <div className="bg-[#151033] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex">

              {/* Sidebar */}

              <div className="hidden sm:block w-28 border-r border-white/10 py-4 px-3">

                <div className="flex items-center gap-1.5 mb-5 text-white text-xs font-bold">

                  <span className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                    <span className="scale-75">
                      <Icons.Logo />
                    </span>
                  </span>

                  PM Tool

                </div>

                <div className="space-y-1 text-[10px]">

                  <p className="bg-primary/30 text-white rounded px-2 py-1.5">
                    Overview
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Projects
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Tasks
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Calendar
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Team
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Reports
                  </p>

                  <p className="text-indigo-100/40 px-2 py-1.5">
                    Settings
                  </p>

                </div>

              </div>

              {/* Dashboard */}

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">

                  <span className="text-xs font-semibold text-white">
                    Website Redesign
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

                <div className="flex items-center gap-4 px-4 pt-2 text-[10px] text-indigo-100/40 border-b border-white/10 pb-2">

                  <span className="text-white border-b-2 border-primary pb-1.5 -mb-2">
                    Board
                  </span>

                  <span>Timeline</span>
                  <span>Files</span>
                  <span>Progress</span>

                </div>

                <div className="p-4 grid grid-cols-3 gap-2">

                  {/* To Do */}

                  <div className="bg-white/5 rounded-lg p-2">

                    <p className="text-[10px] font-medium text-indigo-100/50 mb-2">
                      TO DO · 4
                    </p>

                    <div className="bg-white/10 rounded p-1.5 mb-1.5">

                      <p className="text-[10px] text-indigo-50 mb-1">
                        Create hero section
                      </p>

                      <span className="text-[8px] text-blue-300 bg-blue-400/10 px-1.5 py-0.5 rounded">
                        Design
                      </span>

                    </div>

                    <div className="bg-white/10 rounded p-1.5">

                      <p className="text-[10px] text-indigo-50">
                        Write headlines
                      </p>

                    </div>

                  </div>

                  {/* In Progress */}

                  <div className="bg-white/5 rounded-lg p-2">

                    <p className="text-[10px] font-medium text-indigo-100/50 mb-2">
                      IN PROGRESS · 3
                    </p>

                    <div className="bg-white/10 rounded p-1.5 mb-1.5">

                      <p className="text-[10px] text-indigo-50 mb-1">
                        Build navigation
                      </p>

                      <span className="text-[8px] text-purple-300 bg-purple-400/10 px-1.5 py-0.5 rounded">
                        Design
                      </span>

                    </div>

                    <div className="bg-white/10 rounded p-1.5">

                      <p className="text-[10px] text-indigo-50 mb-1">
                        Integrate API
                      </p>

                      <span className="text-[8px] text-emerald-300 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                        Dev
                      </span>

                    </div>

                  </div>

                  {/* Done */}

                  <div className="bg-white/5 rounded-lg p-2">

                    <p className="text-[10px] font-medium text-indigo-100/50 mb-2">
                      DONE · 3
                    </p>

                    <div className="bg-white/10 rounded p-1.5 mb-1.5">

                      <p className="text-[10px] text-indigo-50 mb-1">
                        QA & testing
                      </p>

                      <span className="text-[8px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        Design
                      </span>

                    </div>

                    <div className="bg-white/10 rounded p-1.5">

                      <p className="text-[10px] text-indigo-50">
                        Optimize perf.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Progress Card */}

            <div className="absolute -bottom-8 -right-4 glass-strong rounded-xl p-4 shadow-2xl w-60">

              <div className="flex items-center gap-3 mb-1">

                <div className="relative w-14 h-14 flex-shrink-0">

                  <svg
                    viewBox="0 0 56 56"
                    className="w-14 h-14 -rotate-90"
                  >

                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="6"
                    />

                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={
                        2 * Math.PI * 24 * (1 - 0.72)
                      }
                    />

                  </svg>

                  <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-primary">
                    72%
                  </span>

                </div>

                <div>

                  <p className="text-xs font-semibold text-gray-800">
                    Project progress
                  </p>

                  <p className="text-[10px] text-emerald-500">
                    +12% this week
                  </p>

                </div>

              </div>

              <svg
                viewBox="0 0 100 24"
                className="w-full h-6 mt-1"
              >

                <polyline
                  points="0,20 15,16 30,18 45,10 60,12 75,4 100,6"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            </div>

          </div>

        </div>
      </div>

      {/* =========================
          TRUSTED TEAMS
      ========================= */}

      <section className="bg-[#1c1147] pt-8 pb-24 px-8">

        <p className="text-center text-xs font-bold text-indigo-100/40 tracking-widest mb-6">
          TRUSTED BY MODERN TEAMS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">

          {[
            {
              name: "Lumen Labs",
              icon: "◈",
            },
            {
              name: "Orbit Studio",
              icon: "◎",
            },
            {
              name: "Northwind",
              icon: "≈",
            },
            {
              name: "Cedar & Co",
              icon: "✳",
            },
            {
              name: "Pixelmint",
              icon: "◇",
            },
          ].map((c) => (

            <div
              key={c.name}
              className="flex items-center gap-2 text-indigo-100/40 font-semibold text-base"
            >

              <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs">
                {c.icon}
              </span>

              {c.name}

            </div>

          ))}

        </div>

      </section>

      {/* =========================
          STATS
      ========================= */}

      <div className="relative px-8 -mt-16 mb-10">

        <Reveal className="max-w-5xl mx-auto">

          <div className="glass-strong shadow-2xl shadow-indigo-900/20 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">

            {stats.map((s) => (

              <div
                key={s.label}
                className="flex items-center gap-3"
              >

                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>

                <div>

                  <div className="text-xl font-extrabold text-gray-900">
                    <Counter
                      end={s.end}
                      suffix={s.suffix}
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    {s.label}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </Reveal>

      </div>

      {/* =========================
          FEATURES
      ========================= */}

      <section
        id="features"
        className="py-20 px-8"
      >

        <Reveal
          className="max-w-2xl mx-auto text-center mb-14"
        >

          <p className="text-primary text-xs font-bold tracking-widest mb-3">
            EVERYTHING IN ONE PLACE
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">

            Everything your team needs to stay{" "}

            <span className="text-primary">
              organized
            </span>

          </h2>

        </Reveal>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {features.map((f, i) => (

            <Reveal
              key={f.title}
              delay={(i % 3) * 100}
            >

              <div className="glass card-lift rounded-2xl p-6 h-full relative overflow-hidden group">

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/0 via-purple-50/0 to-indigo-100/0 group-hover:from-indigo-100/60 group-hover:via-purple-50/40 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

                <div className="relative">

                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center mb-4">

                    {f.icon}

                  </div>

                  <h3 className="font-bold text-gray-900 mb-1.5">
                    {f.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>

                </div>

              </div>

            </Reveal>

          ))}

        </div>

      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section
        id="how-it-works"
        className="bg-surface py-20 px-8"
      >

        <Reveal
          className="max-w-2xl mx-auto text-center mb-16"
        >

          <p className="text-primary text-xs font-bold tracking-widest mb-3">
            HOW PM TOOL WORKS
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Simple steps to move your work forward
          </h2>

        </Reveal>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">

          {steps.map((s, i) => (

            <div
              key={s.n}
              className="flex items-center md:items-start w-full md:w-auto flex-1"
            >

              <Reveal
                delay={i * 150}
                className="w-full"
              >

                <div className="text-center md:text-left">

                  <div className="w-11 h-11 mx-auto md:mx-0 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white font-bold flex items-center justify-center mb-4">
                    {s.n}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">
                    {s.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {s.desc}
                  </p>

                </div>

              </Reveal>

              {i < steps.length - 1 && (
                <span className="hidden md:block text-2xl text-indigo-200 mx-4 mt-2">
                  →
                </span>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* =========================
          DASHBOARD SECTION
      ========================= */}

      <section className="py-20 px-8">

        <Reveal className="max-w-6xl mx-auto">

          <div className="bg-gradient-to-br from-[#0e0a2e] to-[#1c1147] rounded-3xl p-4 md:p-6 shadow-2xl">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 items-center">

              {/* Left */}

              <div className="px-4 py-8 md:px-8 md:py-10">

                <p className="text-indigo-300 text-xs font-bold tracking-widest mb-3">
                  ALL YOUR WORK AT A GLANCE
                </p>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-snug">
                  A workspace that shows the whole picture
                </h2>

                <ul className="space-y-3 mb-8">

                  {[
                    "Track progress in real-time",
                    "Stay on top of deadlines",
                    "See team activity and updates",
                    "Make data-driven decisions",
                  ].map((t) => (

                    <li
                      key={t}
                      className="flex items-center gap-3 text-indigo-100/70 text-sm"
                    >

                      <span className="w-5 h-5 rounded-full bg-white/10 text-indigo-300 flex items-center justify-center flex-shrink-0">
                        <Icons.Check />
                      </span>

                      {t}

                    </li>

                  ))}

                </ul>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg shadow-indigo-900/50"
                >
                  Explore Dashboard
                  <Icons.ArrowRight />
                </Link>

              </div>

              {/* Right Dashboard */}

              <div className="bg-white rounded-2xl p-5 flex overflow-hidden">

                <div className="hidden sm:flex flex-col items-center gap-4 pr-4 mr-4 border-r border-gray-100">

                  <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Icons.Logo />
                  </span>

                  <span className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center">
                    <Icons.Folder />
                  </span>

                  <span className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center">
                    <Icons.Tasks />
                  </span>

                  <span className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center">
                    <Icons.Users />
                  </span>

                  <span className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center">
                    <Icons.Settings />
                  </span>

                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between mb-4">

                    <p className="font-bold text-gray-900">
                      Good morning, Sarah
                    </p>

                    <div className="hidden sm:flex items-center gap-2 text-gray-300 text-xs">

                      <Icons.Home />

                      <Icons.Bell />

                      <Icons.More />

                    </div>

                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-5">

                    {[
                      {
                        label: "Total Projects",
                        value: 12,
                        color: "text-gray-900",
                      },
                      {
                        label: "Active Tasks",
                        value: 28,
                        color: "text-gray-900",
                      },
                      {
                        label: "Completed",
                        value: 64,
                        color: "text-emerald-500",
                      },
                      {
                        label: "Due Soon",
                        value: 7,
                        color: "text-red-400",
                      },
                    ].map((s) => (

                      <div
                        key={s.label}
                        className="bg-surface rounded-lg p-2"
                      >

                        <p className="text-[9px] text-gray-500 mb-0.5">
                          {s.label}
                        </p>

                        <p
                          className={`text-base font-extrabold ${s.color}`}
                        >
                          {s.value}
                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    {/* Progress */}

                    <div>

                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Project Progress
                      </p>

                      {projectsOverview.map((p) => (

                        <div
                          key={p.name}
                          className="mb-2.5"
                        >

                          <div className="flex justify-between text-[11px] mb-1">

                            <span className="text-gray-600">
                              {p.name}
                            </span>

                            <span className="text-gray-400">
                              {p.percent}%
                            </span>

                          </div>

                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">

                            <div
                              className={`h-full ${p.color} rounded-full`}
                              style={{
                                width: `${p.percent}%`,
                              }}
                            />

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* Activity */}

                    <div>

                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Recent Activity
                      </p>

                      <ul className="space-y-1.5 mb-3">

                        {activity.map((a) => (

                          <li
                            key={a.text}
                            className="text-[10px] text-gray-500"
                          >
                            {a.text}
                          </li>

                        ))}

                      </ul>

                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Upcoming Deadlines
                      </p>

                      <ul className="space-y-1.5">

                        {deadlines.map((d) => (

                          <li
                            key={d.title}
                            className="text-[10px] text-gray-500 flex justify-between gap-2"
                          >

                            <span>
                              {d.title}
                            </span>

                            <span className="text-amber-600">
                              {d.date}
                            </span>

                          </li>

                        ))}

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </Reveal>

      </section>

      {/* =========================
          PRICING
      ========================= */}

      <section
        id="pricing"
        className="bg-surface py-20 px-8"
      >

        <Reveal
          className="max-w-2xl mx-auto text-center mb-14"
        >

          <p className="text-primary text-xs font-bold tracking-widest mb-3">
            SIMPLE, TRANSPARENT PRICING
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Choose the perfect plan for your team
          </h2>

        </Reveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {plans.map((p) => (

            <Reveal key={p.name}>

              <div
                className={
                  p.highlight
                    ? "relative overflow-hidden group glass-strong rounded-2xl p-6 border-2 border-primary shadow-xl shadow-indigo-100 h-full card-lift"
                    : "relative overflow-hidden group glass-strong shadow-md shadow-indigo-100/60 rounded-2xl p-6 h-full card-lift"
                }
              >

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/0 via-purple-50/0 to-indigo-100/0 group-hover:from-indigo-100/60 group-hover:via-purple-50/40 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

                <div className="relative">

                  <div className="flex items-center justify-between mb-1">

                    <h3 className="font-semibold text-gray-800">
                      {p.name}
                    </h3>

                    {p.highlight && (

                      <span className="text-xs bg-indigo-50 text-primary px-2 py-0.5 rounded-full">
                        Most Popular
                      </span>

                    )}

                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    {p.tagline}
                  </p>

                  <div className="text-3xl font-extrabold text-gray-900 mb-1">

                    {p.price}

                    {p.price !== "$0" && (
                      <span className="text-sm font-medium text-gray-400">
                        {" "}
                        /user/month
                      </span>
                    )}

                  </div>

                  <ul className="space-y-2 my-6">

                    {p.features.map((f) => (

                      <li
                        key={f}
                        className="text-sm text-gray-600 flex items-center gap-2"
                      >

                        <span className="text-primary">
                          <Icons.Check />
                        </span>

                        {f}

                      </li>

                    ))}

                  </ul>

                  <Link
                    to="/register"
                    className={
                      p.highlight
                        ? "relative z-10 block text-center rounded-lg py-2.5 text-sm font-semibold bg-primary text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:scale-[1.03]"
                        : "relative z-10 block text-center rounded-lg py-2.5 text-sm font-semibold border-2 border-gray-200 text-gray-700 bg-white transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.03]"
                    }
                  >
                    {p.cta}
                  </Link>

                </div>

              </div>

            </Reveal>

          ))}

        </div>

      </section>

      {/* =========================
          CTA
      ========================= */}

      <Reveal>

        <section className="px-8 py-10">

          <div className="max-w-5xl mx-auto relative overflow-hidden bg-gradient-to-r from-[#1c1147] to-[#2c1a6b] rounded-3xl py-12 px-8 md:px-12 shadow-2xl">

            <div
              className="blob w-72 h-72 bg-purple-600 -top-20 right-10"
              style={{ opacity: 0.3 }}
            />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="flex items-center gap-4 text-center md:text-left">

                <span className="hidden md:flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center text-white flex-shrink-0">
                  <Icons.Rocket />
                </span>

                <div>

                  <h2 className="text-xl md:text-2xl font-extrabold text-white mb-1">
                    Ready to bring your team's work together?
                  </h2>

                  <p className="text-indigo-100/60 text-sm">
                    Join thousands of teams that use PM Tool to plan,
                    collaborate and deliver.
                  </p>

                </div>

              </div>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-all hover:scale-105 shadow-lg shadow-indigo-900/50 whitespace-nowrap"
                >
                  Get Started Free
                  <Icons.ArrowRight />
                </Link>

                <p className="text-indigo-100/40 text-xs">
                  No credit card required
                </p>

              </div>

            </div>

          </div>

        </section>

      </Reveal>

      {/* =========================
          FOOTER
      ========================= */}

      <footer
        id="footer"
        className="bg-[#0e0a2e] pt-14 pb-8 px-8"
      >

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">

          {/* Brand */}

          <div className="col-span-2">

            <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">

              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">

                <Icons.Logo />

              </span>

              PM Tool

            </div>

            <p className="text-sm text-indigo-100/50 mb-4 max-w-xs">
              Plan smarter. Work together. Get things done.
            </p>

            <div className="flex items-center gap-3">

              {[
                "X",
                "in",
                "gh",
                "yt",
              ].map((icon) => (

                <a
                  key={icon}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 text-indigo-100/70 text-xs flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {icon}
                </a>

              ))}

            </div>

          </div>

          {/* Product */}

          <div>

            <h4 className="text-sm font-semibold text-white mb-3">
              Product
            </h4>

            <ul className="space-y-2 text-sm text-indigo-100/50">

              <li>
                <a
                  href="#features"
                  className="hover:text-white"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#pricing"
                  className="hover:text-white"
                >
                  Pricing
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Integrations
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Changelog
                </a>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h4 className="text-sm font-semibold text-white mb-3">
              Company
            </h4>

            <ul className="space-y-2 text-sm text-indigo-100/50">

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Careers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Customers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Contact
                </a>
              </li>

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h4 className="text-sm font-semibold text-white mb-3">
              Resources
            </h4>

            <ul className="space-y-2 text-sm text-indigo-100/50">

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Help Center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Guides
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Templates
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Community
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Status
                </a>
              </li>

            </ul>

          </div>

          {/* Legal */}

          <div>

            <h4 className="text-sm font-semibold text-white mb-3">
              Legal
            </h4>

            <ul className="space-y-2 text-sm text-indigo-100/50">

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Privacy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Terms
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  Security
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white"
                >
                  GDPR
                </a>
              </li>

            </ul>

          </div>

        </div>

        {/* Copyright */}

        <div className="max-w-6xl mx-auto border-t border-white/10 pt-6 text-center">

          <p className="text-xs text-indigo-100/40">
            © 2026 PM Tool. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}