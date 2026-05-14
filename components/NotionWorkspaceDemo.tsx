"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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
  sidebarItemActive: string;
  sidebarItemInactive: string;
  separator: string;
  cursor: string;
  benefitActive: string;
  benefitInactive: string;
  miniTag: string;
};

type OsMenuItem = {
  label: string;
  emoji: string;
};

type OsSystem = {
  title: string;
  menu: OsMenuItem[];
};

type TemplateBenefit = {
  id: string;
  icon: string;
  title: string;
  time: string;
  label: string;
  summary: string;
  details: string;
  tags: string[];
  checklist: string[];
};

const TEMPLATE_BENEFITS: TemplateBenefit[] = [
  {
    id: "plan",
    icon: "🧭",
    title: "Plan your system in minutes",
    time: "2 min",
    label: "Clarity",
    summary:
      "Turn scattered ideas into a clean dashboard with pages, tasks, and priorities already connected.",
    details:
      "Noricraft templates give you a ready structure, so you do not start from a blank page. Each workspace is designed around a real workflow and can be adapted to your routine.",
    tags: ["Dashboard", "Planning", "Structure"],
    checklist: [
      "Ready-made page hierarchy",
      "Clear task and project views",
      "Built-in weekly review",
    ],
  },
  {
    id: "track",
    icon: "✅",
    title: "Track what matters daily",
    time: "5 min",
    label: "Execution",
    summary:
      "Keep tasks, notes, habits, and progress in one place instead of switching between tools.",
    details:
      "Use connected databases and simple views to see what needs attention today, what is waiting, and what is already done.",
    tags: ["Tasks", "Habits", "Progress"],
    checklist: [
      "Daily action list",
      "Progress-friendly views",
      "Simple status system",
    ],
  },
  {
    id: "automate",
    icon: "⚡",
    title: "Reduce repetitive work",
    time: "Auto",
    label: "Automation",
    summary:
      "Use templates built with repeatable workflows in mind, ready for AI automations and system upgrades.",
    details:
      "Our systems are designed to make repetitive work visible, so it can later be automated with AI, forms, reminders, or workflow tools.",
    tags: ["AI-ready", "Workflow", "Ops"],
    checklist: [
      "Repeatable process structure",
      "Automation-friendly databases",
      "Less manual context switching",
    ],
  },
  {
    id: "focus",
    icon: "🎯",
    title: "Stay focused without chaos",
    time: "Daily",
    label: "Focus",
    summary:
      "Separate priorities from noise with simple views for today, this week, and long-term goals.",
    details:
      "A good workspace should help you decide what to do next. These templates make priorities easier to see and review.",
    tags: ["Focus", "Review", "Priorities"],
    checklist: [
      "Clean dashboard layout",
      "Priority-based sections",
      "Weekly reset flow",
    ],
  },
  {
    id: "scale",
    icon: "📈",
    title: "Grow your workspace over time",
    time: "Ongoing",
    label: "Scalable",
    summary:
      "Start simple, then expand your system with new pages, views, and automations as your needs grow.",
    details:
      "Noricraft templates are not static documents. They are modular workspaces built to evolve with personal routines, studies, fitness, business, or client work.",
    tags: ["Scalable", "Modular", "Templates"],
    checklist: [
      "Modular page system",
      "Expandable databases",
      "Works for personal and business use",
    ],
  },
];

const OS_SYSTEMS: OsSystem[] = [
  {
    title: "Travel",
    menu: [
      { emoji: "âś…", label: "Task" },
      { emoji: "đź§ł", label: "Travels" },
      { emoji: "đź“”", label: "Journal" },
      { emoji: "đźŚŤ", label: "Country base" },
      { emoji: "đźŽ’", label: "Packing" },
      { emoji: "đź’¸", label: "Budget" },
    ],
  },
  {
    title: "Study",
    menu: [
      { emoji: "đź§Ş", label: "Exams" },
      { emoji: "đź“ť", label: "Homeworks" },
      { emoji: "đź“", label: "Projects" },
      { emoji: "đź—“ď¸Ź", label: "Schedule" },
      { emoji: "đź“…", label: "Calendar" },
      { emoji: "đź“’", label: "Notes" },
    ],
  },
  {
    title: "Job Hunting",
    menu: [
      { emoji: "đźŽŻ", label: "Job search plan" },
      { emoji: "đź“¨", label: "Applications" },
      { emoji: "đźŹ˘", label: "Companies" },
      { emoji: "đź¤ť", label: "Networking" },
      { emoji: "đź’¬", label: "Interviews" },
      { emoji: "đź“„", label: "Documents" },
      { emoji: "đź”—", label: "Resources" },
    ],
  },
  {
    title: "Daily Tracker",
    menu: [
      { emoji: "âś…", label: "Tasks" },
      { emoji: "đź’»", label: "Work" },
      { emoji: "đź“", label: "Projects" },
      { emoji: "đź“’", label: "Notes" },
      { emoji: "đźŚ±", label: "Habits" },
      { emoji: "đź§­", label: "Purpose" },
    ],
  },
  {
    title: "Gym Progress",
    menu: [
      { emoji: "đźŽŻ", label: "Fitness goals" },
      { emoji: "đź“‹", label: "Workout plan" },
      { emoji: "đźŹ‹ď¸Ź", label: "Workouts" },
      { emoji: "đź“", label: "Progress" },
      { emoji: "đź“Ź", label: "Body measurements" },
      { emoji: "đźĄ—", label: "Nutrition" },
      { emoji: "đź§", label: "Recovery" },
      { emoji: "đź”—", label: "Resources" },
    ],
  },
  {
    title: "Gym Trainer",
    menu: [
      { emoji: "đź‘Ą", label: "Clients" },
      { emoji: "đź—“ď¸Ź", label: "Schedule" },
      { emoji: "đź“‹", label: "Training plans" },
      { emoji: "đźŹ‹ď¸Ź", label: "Workouts" },
      { emoji: "đź“", label: "Client progress" },
      { emoji: "đźĄ—", label: "Nutrition" },
      { emoji: "âś…", label: "Check-ins" },
      { emoji: "đź’ł", label: "Payments" },
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
  children: React.ReactNode;
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
  const [activeBenefitId, setActiveBenefitId] = useState(
    TEMPLATE_BENEFITS[0]?.id ?? "plan",
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
    sidebarItemActive: isLightTheme
      ? "bg-black/[0.08] !text-black/88 transition-colors duration-200"
      : "bg-white/[0.08] !text-white transition-colors duration-200",
    sidebarItemInactive: isLightTheme
      ? "text-black/55 hover:bg-black/[0.045] hover:text-black/78 transition-colors duration-200"
      : "text-white/55 hover:bg-white/[0.055] hover:text-white/78 transition-colors duration-200",
    separator: isLightTheme ? "border-black/[0.08]" : "border-white/[0.08]",
    cursor: isLightTheme ? "bg-black/55" : "bg-white/70",
    benefitActive: isLightTheme
      ? "border-black/[0.12] bg-black/[0.055] text-black/82"
      : "border-white/[0.12] bg-white/[0.07] text-white/86",
    benefitInactive: isLightTheme
      ? "border-black/[0.06] bg-white hover:bg-black/[0.035] text-black/70"
      : "border-white/[0.08] bg-[#252525] hover:bg-white/[0.06] text-white/70",
    miniTag: isLightTheme
      ? "bg-black/[0.06] text-black/58"
      : "bg-white/[0.07] text-white/58",
  };

  const transition = useMemo(() => getTransition(reduceMotion), [reduceMotion]);
  const activeSystem = OS_SYSTEMS[titleIndex] ?? OS_SYSTEMS[0];
  const activeTitlePrefix = activeSystem.title;
  const activeMenuKeyPrefix = `${activeSystem.title}::`;
  const activeMenuLabel = activeMenuItem.startsWith(activeMenuKeyPrefix)
    ? activeMenuItem.slice(activeMenuKeyPrefix.length)
    : activeSystem.menu[0]?.label || "";
  const activeBenefit =
    TEMPLATE_BENEFITS.find((benefit) => benefit.id === activeBenefitId) ??
    TEMPLATE_BENEFITS[0];

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
                      <span className="grid h-5 w-5 shrink-0 place-items-center text-[13px] leading-none">
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
                      Template benefits
                    </p>
                    <p className="theme-text-primary mt-1 text-lg font-semibold tracking-[-0.04em] !text-white/88">
                      Build a system that feels ready on day one.
                    </p>
                    <p className="theme-text-secondary mt-1 text-sm !text-white/62">
                      Explore how Noricraft templates turn Notion into a practical operating
                      system.
                    </p>
                  </div>
                  <StatusPill themeClasses={themeClasses}>Curated setup</StatusPill>
                </div>
              </div>

              <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className={`rounded-[16px] border px-3 py-2 ${themeClasses.subtle}`}>
                  <div className="grid grid-cols-[minmax(0,1fr)_52px_72px] gap-3 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    <span className="theme-text-muted !text-white/40">Page</span>
                    <span className="theme-text-muted !text-white/40">Time</span>
                    <span className="theme-text-muted !text-white/40">State</span>
                  </div>
                </div>

                <div className="mt-2 min-h-0 flex-1 overflow-auto pr-1">
                  <div className="space-y-1.5">
                    {TEMPLATE_BENEFITS.map((benefit) => {
                      const isActive = activeBenefit.id === benefit.id;

                      return (
                        <button
                          key={benefit.id}
                          type="button"
                          onClick={() => setActiveBenefitId(benefit.id)}
                          aria-pressed={isActive}
                          className={`w-full rounded-[14px] border px-3 py-3 text-left transition-colors ${
                            isActive
                              ? themeClasses.benefitActive
                              : themeClasses.benefitInactive
                          }`}
                        >
                          <div className="grid grid-cols-[minmax(0,1fr)_52px_72px] gap-3">
                            <div className="flex min-w-0 items-start gap-2.5">
                              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-sm">
                                {benefit.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="theme-text-primary truncate text-sm font-semibold !text-white/88">
                                    {benefit.title}
                                  </p>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${themeClasses.miniTag}`}
                                  >
                                    {benefit.label}
                                  </span>
                                </div>
                                <p className="theme-text-secondary mt-1 overflow-hidden text-xs leading-5 !text-white/58">
                                  {benefit.summary}
                                </p>
                              </div>
                            </div>

                            <span className="theme-text-muted text-[10px] leading-6 !text-white/40">
                              {benefit.time}
                            </span>

                            <span className="flex justify-start lg:justify-end">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${themeClasses.miniTag}`}
                              >
                                {isActive ? "Open" : "View"}
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <aside
              className={`hidden min-h-0 flex-col rounded-[20px] border p-3 text-white/72 lg:flex ${themeClasses.assistant}`}
            >
              <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.18em] !text-white/40">
                Selected page
              </p>

              <div className="mt-3 min-h-0 flex-1 overflow-auto">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeBenefit.id}
                    initial={reduceMotion ? false : { opacity: 0, x: 12, y: 8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10, y: -6 }}
                    transition={transition}
                    className="space-y-3"
                  >
                    <div className={`rounded-[16px] border p-3 ${themeClasses.card}`}>
                      <div className="flex items-start gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg">
                          {activeBenefit.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="theme-text-primary text-base font-semibold !text-white/88">
                            {activeBenefit.title}
                          </p>
                          <p className="theme-text-secondary mt-1 text-sm leading-6 !text-white/60">
                            {activeBenefit.details}
                          </p>
                        </div>
                      </div>

                      <div className={`mt-4 border-t pt-3 ${themeClasses.separator}`}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.12em] !text-white/40">
                              Property
                            </span>
                            <span className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.12em] !text-white/40">
                              Value
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="theme-text-secondary text-sm !text-white/60">
                              Benefit
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-medium ${themeClasses.miniTag}`}
                            >
                              {activeBenefit.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="theme-text-secondary text-sm !text-white/60">
                              Setup time
                            </span>
                            <span className="theme-text-primary text-sm font-medium !text-white/84">
                              {activeBenefit.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {activeBenefit.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${themeClasses.miniTag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-[16px] border p-3 ${themeClasses.subtle}`}>
                      <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.12em] !text-white/40">
                        What it gives you
                      </p>
                      <div className="mt-3 space-y-2">
                        {activeBenefit.checklist.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded bg-emerald-500/20 text-[10px] text-emerald-300">
                              ✓
                            </span>
                            <p className="theme-text-secondary text-sm leading-5 !text-white/60">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-[16px] border p-3 ${themeClasses.subtle}`}>
                      <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.12em] !text-white/40">
                        Included
                      </p>
                      <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/60">
                        A polished dashboard, connected databases, and a workflow structure that
                        is ready to adapt instead of being rebuilt from scratch.
                      </p>
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
