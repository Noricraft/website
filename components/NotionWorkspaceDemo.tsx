"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type PanelTheme = "dark" | "light";

type ThemeClasses = {
  window: string;
  topbar: string;
  iconTile: string;
  search: string;
  pill: string;
  themeButton: string;
  sidebar: string;
  content: string;
  assistant: string;
  card: string;
  subtle: string;
  tableHeader: string;
  sidebarItemActive: string;
  sidebarItemInactive: string;
  separator: string;
  cursor: string;
  featureActive: string;
  featureInactive: string;
  featureTag: string;
  featureCheck: string;
};

type OsMenuItem = {
  label: string;
  emoji: string;
};

type OsSystem = {
  title: string;
  menu: OsMenuItem[];
};

type TemplateFeature = {
  id: string;
  icon: string;
  title: string;
  type: string;
  status: string;
  summary: string;
  detailTitle: string;
  detail: string;
  included: string[];
  bestFor: string[];
};

const TEMPLATE_FEATURES: TemplateFeature[] = [
  {
    id: "ready-dashboard",
    icon: "🧩",
    title: "Ready-to-use dashboard",
    type: "Setup",
    status: "Included",
    summary: "Start with a complete operating system, not a blank page.",
    detailTitle: "Launch faster with a ready dashboard",
    detail:
      "Noricraft templates give you a structured workspace from the first minute, so you can focus on using the system instead of designing it.",
    included: [
      "Pre-built main dashboard",
      "Linked sections and quick navigation",
      "Clean page hierarchy",
      "Beginner-friendly layout",
    ],
    bestFor: ["Planning", "Study", "Fitness", "Client work"],
  },
  {
    id: "connected-databases",
    icon: "🔗",
    title: "Connected databases",
    type: "System",
    status: "Included",
    summary: "Keep pages, tasks, notes and goals connected in one system.",
    detailTitle: "Make every page work together",
    detail:
      "Instead of isolated pages, the workspace uses connected databases so information can appear in the right place automatically.",
    included: [
      "Task and project relations",
      "Filtered views",
      "Status-based organization",
      "Reusable database structure",
    ],
    bestFor: ["Projects", "Tasks", "Goals", "Tracking"],
  },
  {
    id: "daily-action",
    icon: "✅",
    title: "Daily action system",
    type: "Workflow",
    status: "Included",
    summary: "Know what to do today without digging through your workspace.",
    detailTitle: "Turn plans into daily action",
    detail:
      "A good template should help you decide what matters now. Daily views make priorities visible and reduce decision fatigue.",
    included: [
      "Today view",
      "Priority sections",
      "Quick capture area",
      "Daily review flow",
    ],
    bestFor: ["Productivity", "Habits", "Work", "Study"],
  },
  {
    id: "progress-tracking",
    icon: "📈",
    title: "Progress tracking",
    type: "Tracking",
    status: "Included",
    summary: "See progress clearly across goals, tasks and routines.",
    detailTitle: "Measure progress without extra work",
    detail:
      "Progress views help users understand what is moving forward, what is stuck, and what needs attention next.",
    included: [
      "Progress views",
      "Status boards",
      "Weekly overview",
      "Completion indicators",
    ],
    bestFor: ["Fitness", "Learning", "Projects", "Goals"],
  },
  {
    id: "clean-structure",
    icon: "🧱",
    title: "Clean Notion structure",
    type: "Design",
    status: "Included",
    summary: "A minimal workspace that is easy to understand and maintain.",
    detailTitle: "Stay organized without visual noise",
    detail:
      "Each template is designed with a clean hierarchy, simple navigation and focused pages, so the system feels calm instead of overwhelming.",
    included: [
      "Minimal page layout",
      "Clear navigation",
      "Organized sections",
      "No unnecessary clutter",
    ],
    bestFor: ["Beginners", "Personal systems", "Simple workflows", "Focus"],
  },
  {
    id: "reusable-workflows",
    icon: "🔁",
    title: "Reusable workflows",
    type: "Process",
    status: "Included",
    summary: "Repeat planning, reviews and checklists without rebuilding them.",
    detailTitle: "Use the same workflow again and again",
    detail:
      "Reusable structures make it easier to run weekly reviews, repeat projects, plan content or manage recurring routines.",
    included: [
      "Repeatable checklists",
      "Weekly reset flow",
      "Reusable project structure",
      "Template-ready pages",
    ],
    bestFor: ["Weekly planning", "Project work", "Content", "Client workflows"],
  },
  {
    id: "ai-ready",
    icon: "⚡",
    title: "AI-ready workspace",
    type: "Automation",
    status: "Included",
    summary: "Structured pages and databases ready for automation and AI workflows.",
    detailTitle: "Prepare your workspace for AI",
    detail:
      "Clean inputs and organized databases make it easier to connect AI automations, generate summaries and build smarter workflows later.",
    included: [
      "Structured fields",
      "Prompt-friendly sections",
      "Automation-ready databases",
      "Clean source data",
    ],
    bestFor: ["AI workflows", "Automation", "Summaries", "Operations"],
  },
  {
    id: "scalable-system",
    icon: "🌱",
    title: "Scalable system",
    type: "Growth",
    status: "Included",
    summary: "Start simple and expand your workspace as your needs grow.",
    detailTitle: "Build a system that grows with you",
    detail:
      "The workspace can start as a simple template and gradually become a full operating system for personal or business use.",
    included: [
      "Modular page system",
      "Expandable databases",
      "Flexible views",
      "Personal and business use cases",
    ],
    bestFor: ["Long-term systems", "Business", "Personal growth", "Team workflows"],
  },
];

const OS_SYSTEMS: OsSystem[] = [
  {
    title: "Travel",
    menu: [
      { emoji: "✅", label: "Task" },
      { emoji: "🧳", label: "Travels" },
      { emoji: "📔", label: "Journal" },
      { emoji: "🌍", label: "Country base" },
      { emoji: "🎒", label: "Packing" },
      { emoji: "💸", label: "Budget" },
    ],
  },
  {
    title: "Study",
    menu: [
      { emoji: "🧪", label: "Exams" },
      { emoji: "📝", label: "Homeworks" },
      { emoji: "📁", label: "Projects" },
      { emoji: "🗓️", label: "Schedule" },
      { emoji: "📅", label: "Calendar" },
      { emoji: "📒", label: "Notes" },
    ],
  },
  {
    title: "Job Hunting",
    menu: [
      { emoji: "🎯", label: "Job search plan" },
      { emoji: "📨", label: "Applications" },
      { emoji: "🏢", label: "Companies" },
      { emoji: "🤝", label: "Networking" },
      { emoji: "💬", label: "Interviews" },
      { emoji: "📄", label: "Documents" },
      { emoji: "🔗", label: "Resources" },
    ],
  },
  {
    title: "Daily Tracker",
    menu: [
      { emoji: "✅", label: "Tasks" },
      { emoji: "💻", label: "Work" },
      { emoji: "📁", label: "Projects" },
      { emoji: "📒", label: "Notes" },
      { emoji: "🌱", label: "Habits" },
      { emoji: "🧭", label: "Purpose" },
    ],
  },
  {
    title: "Gym Progress",
    menu: [
      { emoji: "🎯", label: "Fitness goals" },
      { emoji: "📋", label: "Workout plan" },
      { emoji: "🏋️", label: "Workouts" },
      { emoji: "📈", label: "Progress" },
      { emoji: "📏", label: "Body measurements" },
      { emoji: "🥗", label: "Nutrition" },
      { emoji: "🧘", label: "Recovery" },
      { emoji: "🔗", label: "Resources" },
    ],
  },
  {
    title: "Gym Trainer",
    menu: [
      { emoji: "👥", label: "Clients" },
      { emoji: "🗓️", label: "Schedule" },
      { emoji: "📋", label: "Training plans" },
      { emoji: "🏋️", label: "Workouts" },
      { emoji: "📈", label: "Client progress" },
      { emoji: "🥗", label: "Nutrition" },
      { emoji: "✅", label: "Check-ins" },
      { emoji: "💳", label: "Payments" },
    ],
  },
];

function getTransition(shouldReduceMotion: boolean) {
  if (shouldReduceMotion) {
    return { duration: 0 };
  }

  return {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1] as const,
  };
}

function StatusPill({
  children,
  themeClasses,
}: {
  children: ReactNode;
  themeClasses: ThemeClasses;
}) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 ${themeClasses.pill}`}
    >
      {children}
    </span>
  );
}

export default function NotionWorkspaceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const [titleIndex, setTitleIndex] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [panelTheme, setPanelTheme] = useState<PanelTheme>("dark");
  const [typedTitle, setTypedTitle] = useState("");
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState(
    TEMPLATE_FEATURES[0]?.id ?? "ready-dashboard",
  );

  const isLightTheme = panelTheme === "light";
  const themeClasses: ThemeClasses = {
    window: isLightTheme
      ? "border-black/[0.1] bg-[#f7f7f5] text-black/75 shadow-[0_30px_80px_rgba(0,0,0,0.18)] transition-colors duration-200"
      : "border-white/[0.1] bg-[#191919] text-white/72 shadow-[0_30px_80px_rgba(0,0,0,0.42)] transition-colors duration-200",
    topbar: isLightTheme
      ? "border-black/[0.08] bg-[#f1f1ef] transition-colors duration-200"
      : "border-white/[0.08] bg-[#202020] transition-colors duration-200",
    iconTile: isLightTheme
      ? "border-black/[0.08] bg-white text-black/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-colors duration-200"
      : "border-white/[0.08] bg-[#2a2a2a] text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200",
    search: isLightTheme
      ? "border-black/[0.08] bg-white text-black/45 transition-colors duration-200"
      : "border-white/[0.08] bg-[#2a2a2a] text-white/40 transition-colors duration-200",
    pill: isLightTheme
      ? "border-black/[0.08] bg-white text-black/55 transition-colors duration-200"
      : "border-white/[0.1] bg-white/[0.06] text-white/55 transition-colors duration-200",
    themeButton: isLightTheme
      ? "text-black/58 hover:text-black/78 transition-colors duration-200"
      : "text-white/58 hover:text-white/78 transition-colors duration-200",
    sidebar: isLightTheme
      ? "border-black/[0.08] bg-[#f1f1ef] text-black/72 transition-colors duration-200"
      : "border-white/[0.08] bg-[#202020] text-white/72 transition-colors duration-200",
    content: isLightTheme
      ? "border-black/[0.08] bg-[#fbfbfa] text-black/72 transition-colors duration-200"
      : "border-white/[0.08] bg-[#191919] text-white/72 transition-colors duration-200",
    assistant: isLightTheme
      ? "border-black/[0.08] bg-[#f1f1ef] text-black/72 transition-colors duration-200"
      : "border-white/[0.08] bg-[#202020] text-white/72 transition-colors duration-200",
    card: isLightTheme
      ? "border-black/[0.08] bg-white transition-colors duration-200"
      : "border-white/[0.08] bg-[#252525] transition-colors duration-200",
    subtle: isLightTheme
      ? "border-black/[0.08] bg-black/[0.035] transition-colors duration-200"
      : "border-white/[0.08] bg-white/[0.045] transition-colors duration-200",
    tableHeader: isLightTheme
      ? "border-black/[0.08] bg-black/[0.035] text-black/40 transition-colors duration-200"
      : "border-white/[0.08] bg-white/[0.045] text-white/36 transition-colors duration-200",
    sidebarItemActive: isLightTheme
      ? "bg-black/[0.08] !text-black/88 transition-colors duration-200"
      : "bg-white/[0.08] !text-white transition-colors duration-200",
    sidebarItemInactive: isLightTheme
      ? "text-black/55 hover:bg-black/[0.045] hover:text-black/78 transition-colors duration-200"
      : "text-white/55 hover:bg-white/[0.055] hover:text-white/78 transition-colors duration-200",
    separator: isLightTheme ? "border-black/[0.08]" : "border-white/[0.08]",
    cursor: isLightTheme ? "bg-black/55" : "bg-white/70",
    featureActive: isLightTheme
      ? "border-black/[0.12] bg-black/[0.055] text-black/82 transition-colors duration-200"
      : "border-white/[0.12] bg-white/[0.075] text-white/86 transition-colors duration-200",
    featureInactive: isLightTheme
      ? "border-black/[0.06] bg-white text-black/70 hover:bg-black/[0.035] transition-colors duration-200"
      : "border-white/[0.08] bg-[#252525] text-white/70 hover:bg-white/[0.06] transition-colors duration-200",
    featureTag: isLightTheme
      ? "bg-black/[0.06] text-black/58 transition-colors duration-200"
      : "bg-white/[0.07] text-white/58 transition-colors duration-200",
    featureCheck: isLightTheme
      ? "bg-emerald-500/[0.14] text-emerald-700"
      : "bg-emerald-400/[0.14] text-emerald-300",
  };

  const transition = useMemo(() => getTransition(reduceMotion), [reduceMotion]);
  const activeSystem = OS_SYSTEMS[titleIndex] ?? OS_SYSTEMS[0];
  const activeFeature =
    TEMPLATE_FEATURES.find((feature) => feature.id === activeFeatureId) ?? TEMPLATE_FEATURES[0];
  const activeTitlePrefix = activeSystem.title;
  const activeMenuKeyPrefix = `${activeSystem.title}::`;
  const activeMenuLabel = activeMenuItem.startsWith(activeMenuKeyPrefix)
    ? activeMenuItem.slice(activeMenuKeyPrefix.length)
    : activeSystem.menu[0]?.label || "";

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const isTyping = typedTitle.length < activeTitlePrefix.length && !isDeletingTitle;
    const isHolding = typedTitle === activeTitlePrefix && !isDeletingTitle;
    const isDeleting = typedTitle.length > 0 && isDeletingTitle;

    const timeout = window.setTimeout(
      () => {
        if (isTyping) {
          setTypedTitle(activeTitlePrefix.slice(0, typedTitle.length + 1));
          return;
        }

        if (isHolding) {
          setIsDeletingTitle(true);
          return;
        }

        if (isDeleting) {
          setTypedTitle(activeTitlePrefix.slice(0, typedTitle.length - 1));
          return;
        }

        setIsDeletingTitle(false);
        setTitleIndex((currentIndex) => (currentIndex + 1) % OS_SYSTEMS.length);
      },
      isHolding ? 3000 : isDeleting ? 40 : 65,
    );

    return () => window.clearTimeout(timeout);
  }, [activeTitlePrefix, isDeletingTitle, reduceMotion, typedTitle]);

  return (
    <div
      className={`notion-workspace-demo notion-workspace-demo-${panelTheme} relative h-[420px] w-full sm:h-[460px] lg:h-[520px]`}
      style={{
        fontFamily:
          '"Inter", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      <div className="absolute inset-0">
        <div
          className={`flex h-full flex-col overflow-hidden rounded-[24px] border ${themeClasses.window}`}
        >
          <div className={`flex h-12 items-center gap-3 border-b px-4 ${themeClasses.topbar}`}>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <button
                type="button"
                aria-label={isLightTheme ? "Switch panel to dark mode" : "Switch panel to light mode"}
                aria-pressed={isLightTheme}
                onClick={() =>
                  setPanelTheme((current) => (current === "dark" ? "light" : "dark"))
                }
                className={`ml-3 grid h-6 w-6 cursor-pointer place-items-center transition-colors duration-200 ${themeClasses.themeButton}`}
              >
                {isLightTheme ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20.2 15.35A7.7 7.7 0 0 1 8.65 3.8A8.25 8.25 0 1 0 20.2 15.35Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M12 2.75V5M12 19V21.25M4.22 4.22L5.8 5.8M18.2 18.2L19.78 19.78M2.75 12H5M19 12H21.25M4.22 19.78L5.8 18.2M18.2 5.8L19.78 4.22"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div
                className={`grid h-7 w-7 place-items-center rounded-lg border font-serif text-[11px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${themeClasses.iconTile}`}
              >
                N
              </div>
              <span className="theme-text-primary inline-flex min-w-[164px] items-center text-sm font-medium sm:min-w-[192px]">
                <span className="inline-flex items-center whitespace-nowrap">
                  <span>{reduceMotion ? activeTitlePrefix : typedTitle}</span>
                  {!reduceMotion ? (
                    <span
                      aria-hidden="true"
                      className={`typewriter-cursor mx-0.5 h-4 w-px ${themeClasses.cursor}`}
                    />
                  ) : null}
                  <span>{" OS"}</span>
                </span>
              </span>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2">
              <div
                className={`theme-text-muted hidden min-w-[150px] flex-1 items-center rounded-full border px-3 py-1.5 text-xs sm:flex ${themeClasses.search}`}
              >
                Search workspace...
              </div>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium ${themeClasses.pill}`}
              >
                Live system
              </span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[136px_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[156px_minmax(0,1fr)] sm:p-4 lg:grid-cols-[176px_minmax(0,1fr)_188px]">
            <aside
              className={`flex min-h-0 flex-col rounded-[20px] border px-2.5 pb-2.5 pt-2 ${themeClasses.sidebar}`}
            >
              <div className="px-1.5">
                <p className="theme-text-muted text-[11px] font-medium leading-none !text-white/40">
                  Private
                </p>
              </div>

              <nav
                className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-auto"
                aria-label={`${activeSystem.title} menu`}
              >
                {activeSystem.menu.map((item) => {
                  const isActive = activeMenuLabel === item.label;

                  return (
                    <button
                      key={`${activeSystem.title}-${item.label}`}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Open ${item.label}`}
                      onClick={() => setActiveMenuItem(`${activeSystem.title}::${item.label}`)}
                      className={`flex w-full cursor-pointer appearance-none items-center gap-2 rounded-md border-0 px-2 py-1.5 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${
                        isLightTheme
                          ? "active:bg-black/[0.08] focus-visible:outline-black/20"
                          : "active:bg-white/[0.075] focus-visible:outline-white/30"
                      } ${
                        isActive
                          ? themeClasses.sidebarItemActive
                          : themeClasses.sidebarItemInactive
                      } ${isActive && !isLightTheme ? "!text-white" : ""}`}
                    >
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center text-[13px] leading-none"
                        style={{
                          fontFamily:
                            '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                        }}
                      >
                        {item.emoji}
                      </span>
                      <span className="min-w-0 truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className={`mt-3 border-t px-2 pt-3 ${themeClasses.separator}`}>
                <div className="theme-text-muted rounded-md px-2 py-1.5 text-xs !text-white/40">
                  {activeSystem.menu.length} pages
                </div>
              </div>
            </aside>

            <div
              className={`flex min-h-0 flex-col rounded-[20px] border p-3 text-white/72 sm:p-4 ${themeClasses.content}`}
            >
              <div className={`border-b pb-3 ${themeClasses.separator}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
                      Template benefits
                    </p>
                    <p className="theme-text-primary mt-1 text-lg font-semibold tracking-[-0.04em] !text-white/88">
                      Build a system that feels ready on day one.
                    </p>
                    <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/62">
                      Explore how Noricraft templates turn Notion into a practical operating
                      system.
                    </p>
                  </div>
                  <StatusPill themeClasses={themeClasses}>Curated setup</StatusPill>
                </div>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-auto pr-1">
                <div
                  className={`grid grid-cols-[minmax(0,1fr)_64px] border-b px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] sm:grid-cols-[minmax(0,1.45fr)_72px_78px] ${themeClasses.tableHeader}`}
                >
                  <span className="theme-text-muted">Page</span>
                  <span className="theme-text-muted">Type</span>
                  <span className="theme-text-muted hidden sm:block">State</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  {TEMPLATE_FEATURES.map((feature) => {
                    const isActive = activeFeature.id === feature.id;

                    return (
                      <button
                        key={feature.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveFeatureId(feature.id)}
                        className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_64px] items-center rounded-[12px] border px-3 py-2.5 text-left text-sm transition-colors sm:grid-cols-[minmax(0,1.45fr)_72px_78px] ${
                          isActive ? themeClasses.featureActive : themeClasses.featureInactive
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="grid h-5 w-5 shrink-0 place-items-center text-[13px] leading-none"
                            style={{
                              fontFamily:
                                '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                            }}
                          >
                            {feature.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="theme-text-primary block truncate text-sm font-semibold !text-white/88">
                              {feature.title}
                            </span>
                            <span className="theme-text-secondary mt-0.5 block truncate text-xs !text-white/58">
                              {feature.summary}
                            </span>
                          </span>
                        </span>

                        <span
                          className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium ${themeClasses.featureTag}`}
                        >
                          {feature.type}
                        </span>

                        <span
                          className={`hidden w-fit rounded-full px-2 py-1 text-[10px] font-medium sm:inline-flex ${themeClasses.featureTag}`}
                        >
                          {feature.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside
              className={`hidden min-h-0 flex-col rounded-[20px] border p-3 text-white/72 lg:flex ${themeClasses.assistant}`}
            >
              <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.18em] !text-white/40">
                Selected page
              </p>

              <div className="mt-3 min-h-0 flex-1 overflow-auto pr-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeFeature.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={transition}
                    className="space-y-3"
                  >
                    <div className={`rounded-[16px] border p-3 ${themeClasses.card}`}>
                      <div className="flex items-start gap-3">
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg"
                          style={{
                            fontFamily:
                              '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                          }}
                        >
                          {activeFeature.icon}
                        </span>

                        <div className="min-w-0">
                          <p className="theme-text-primary text-base font-semibold leading-6 !text-white/88">
                            {activeFeature.detailTitle}
                          </p>
                          <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/60">
                            {activeFeature.detail}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {activeFeature.bestFor.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${themeClasses.featureTag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-[16px] border p-3 ${themeClasses.subtle}`}>
                      <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.12em] !text-white/40">
                        Included
                      </p>

                      <div className="mt-3 space-y-2.5">
                        {activeFeature.included.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <span
                              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded text-[10px] ${themeClasses.featureCheck}`}
                            >
                              ✓
                            </span>
                            <p className="theme-text-secondary text-sm leading-5 !text-white/60">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </div>
        <style jsx>{`
          :global(.notion-workspace-demo) {
            color: rgba(255, 255, 255, 0.72);
          }

          :global(.notion-workspace-demo p),
          :global(.notion-workspace-demo h1),
          :global(.notion-workspace-demo h2),
          :global(.notion-workspace-demo h3),
          :global(.notion-workspace-demo h4),
          :global(.notion-workspace-demo h5),
          :global(.notion-workspace-demo h6),
          :global(.notion-workspace-demo span),
          :global(.notion-workspace-demo li),
          :global(.notion-workspace-demo dt),
          :global(.notion-workspace-demo dd),
          :global(.notion-workspace-demo button) {
            color: inherit;
          }

          :global(.notion-workspace-demo p),
          :global(.notion-workspace-demo h1),
          :global(.notion-workspace-demo h2),
          :global(.notion-workspace-demo h3),
          :global(.notion-workspace-demo h4),
          :global(.notion-workspace-demo h5),
          :global(.notion-workspace-demo h6),
          :global(.notion-workspace-demo li),
          :global(.notion-workspace-demo dt),
          :global(.notion-workspace-demo dd) {
            color: inherit !important;
          }

          :global(.notion-workspace-demo-light) {
            color: rgba(55, 53, 47, 0.72);
          }

          :global(.notion-workspace-demo-light p),
          :global(.notion-workspace-demo-light h1),
          :global(.notion-workspace-demo-light h2),
          :global(.notion-workspace-demo-light h3),
          :global(.notion-workspace-demo-light h4),
          :global(.notion-workspace-demo-light h5),
          :global(.notion-workspace-demo-light h6),
          :global(.notion-workspace-demo-light span),
          :global(.notion-workspace-demo-light li),
          :global(.notion-workspace-demo-light dt),
          :global(.notion-workspace-demo-light dd),
          :global(.notion-workspace-demo-light button) {
            color: inherit;
          }

          :global(.notion-workspace-demo-light .theme-text-muted) {
            color: rgba(55, 53, 47, 0.45) !important;
          }

          :global(.notion-workspace-demo-light .theme-text-secondary) {
            color: rgba(55, 53, 47, 0.62) !important;
          }

          :global(.notion-workspace-demo-light .theme-text-primary) {
            color: rgba(55, 53, 47, 0.88) !important;
          }

          .typewriter-cursor {
            animation: typewriter-blink 1s steps(1, end) infinite;
          }

          @keyframes typewriter-blink {
            0%,
            49% {
              opacity: 1;
            }

            50%,
            100% {
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
