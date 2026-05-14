"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type DemoView = "workspace" | "automation" | "insights";
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
  panel: string;
  subtle: string;
  tableHeader: string;
  rowBorder: string;
  statusBadge: string;
  navActive: string;
  navInactive: string;
  sidebarItemActive: string;
  sidebarItemInactive: string;
  separator: string;
  cursor: string;
};

type NavItem = {
  id: DemoView;
  label: string;
};

type OsMenuItem = {
  label: string;
  emoji: string;
};

type OsSystem = {
  title: string;
  menu: OsMenuItem[];
};

const NAV_ITEMS: NavItem[] = [
  { id: "workspace", label: "Workspace" },
  { id: "automation", label: "Automation" },
  { id: "insights", label: "Insights" },
];

const WORKSPACE_CARDS = [
  {
    title: "Product Roadmap",
    detail: "Milestones, owners, and launch blockers aligned in one system.",
  },
  {
    title: "Client Portal",
    detail: "Shared approvals, updates, and next steps synced to the workspace.",
  },
  {
    title: "Content Calendar",
    detail: "Briefs, assets, and delivery dates tracked by status.",
  },
];

const DATABASE_ROWS = [
  { name: "Homepage refresh", owner: "Ava", status: "Ready" },
  { name: "Partner onboarding", owner: "Leo", status: "In review" },
  { name: "Renewal outreach", owner: "Mina", status: "Planned" },
];

const AUTOMATION_STEPS = [
  { title: "AI Brief", meta: "Summary generated from intake notes", status: "Done" },
  { title: "Slack Update", meta: "Routing status to the delivery channel", status: "Running" },
  { title: "Delivery Handoff", meta: "Assigning owner and final checklist", status: "Queued" },
];

const INSIGHT_METRICS = [
  { label: "Hours saved", value: "19.4h" },
  { label: "Tasks automated", value: "42" },
  { label: "Approval speed", value: "+28%" },
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

function getViewMeta(view: DemoView) {
  switch (view) {
    case "automation":
      return {
        title: "Automation control center",
        detail: "Flows, safeguards, and delivery handoffs linked to the workspace.",
        pill: "2 active flows",
      };
    case "insights":
      return {
        title: "Insights and optimization",
        detail: "Review what the system improved and where the next gains are hiding.",
        pill: "AI review",
      };
    case "workspace":
    default:
      return {
        title: "Workspace command center",
        detail: "Pages, databases, and execution notes shaped around your team.",
        pill: "Live sync",
      };
  }
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

function WorkspacePanel({ themeClasses }: { themeClasses: ThemeClasses }) {
  return (
    <div className="space-y-3.5">
      <div className="grid gap-3 xl:grid-cols-3">
        {WORKSPACE_CARDS.map((card) => (
          <div
            key={card.title}
            className={`rounded-[20px] border px-4 py-4 shadow-[0_16px_28px_rgba(0,0,0,0.18)] ${themeClasses.card}`}
          >
            <StatusPill themeClasses={themeClasses}>Page</StatusPill>
            <h3 className="theme-text-primary mt-3 text-base font-semibold tracking-[-0.02em] !text-white/88">
              {card.title}
            </h3>
            <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/60">
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
                Core database
              </p>
              <p className="theme-text-primary mt-1 text-sm font-semibold tracking-[-0.01em] !text-white/88">
                Product ops board
              </p>
            </div>
            <StatusPill themeClasses={themeClasses}>Synced</StatusPill>
          </div>

          <div className={`mt-4 overflow-hidden rounded-[18px] border ${themeClasses.subtle}`}>
            <div
              className={`grid grid-cols-[minmax(0,1.8fr)_88px_92px] border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] ${themeClasses.tableHeader}`}
            >
              <span className="theme-text-muted">Item</span>
              <span className="theme-text-muted">Owner</span>
              <span className="theme-text-muted">Status</span>
            </div>
            {DATABASE_ROWS.map((row) => (
              <div
                key={row.name}
                className={`grid grid-cols-[minmax(0,1.8fr)_88px_92px] items-center border-b px-3 py-3 last:border-b-0 ${themeClasses.rowBorder}`}
              >
                <span className="theme-text-primary truncate pr-3 text-sm font-medium">
                  {row.name}
                </span>
                <span className="theme-text-secondary text-sm">{row.owner}</span>
                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[11px] font-medium ${themeClasses.statusBadge}`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
            Action queue
          </p>
          <div className="mt-3 space-y-2.5">
            {["Planning locked", "Assets attached", "Handoff ready"].map((item) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-[16px] border px-3 py-3 ${themeClasses.subtle}`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-semibold uppercase ${themeClasses.statusBadge}`}
                >
                  OK
                </span>
                <span className="theme-text-secondary text-sm font-medium !text-white/70">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationPanel({
  themeClasses,
  isLightTheme,
}: {
  themeClasses: ThemeClasses;
  isLightTheme: boolean;
}) {
  return (
    <div className="space-y-3.5">
      <div
        className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
              Automation map
            </p>
            <p className="theme-text-primary mt-1 text-sm font-semibold tracking-[-0.01em] !text-white/88">
              Lead intake to delivery handoff
            </p>
          </div>
          <StatusPill themeClasses={themeClasses}>System healthy</StatusPill>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {AUTOMATION_STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`relative rounded-[18px] border p-4 ${themeClasses.card}`}
            >
              <StatusPill themeClasses={themeClasses}>{`Step ${index + 1}`}</StatusPill>
              <h3 className="theme-text-primary mt-3 text-base font-semibold tracking-[-0.02em] !text-white/88">
                {step.title}
              </h3>
              <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/60">
                {step.meta}
              </p>
              <div
                className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium ${themeClasses.statusBadge}`}
              >
                {step.status}
              </div>
              {index < AUTOMATION_STEPS.length - 1 ? (
                <div
                  className={`absolute -right-2 top-1/2 hidden h-px w-4 xl:block ${
                    isLightTheme ? "bg-black/[0.12]" : "bg-white/[0.12]"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
            Safeguards
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              "Fallback owner is assigned when no routing match is found.",
              "Slack updates publish only after approval status changes.",
              "Every automation run writes a clean audit log to the database.",
            ].map((item) => (
              <div
                key={item}
                className={`theme-text-secondary rounded-[16px] border px-4 py-3 text-sm leading-6 !text-white/60 ${themeClasses.subtle}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
            Status
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              ["Queue health", "Stable"],
              ["Failed runs", "0 today"],
              ["Avg. latency", "1.8 min"],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`flex items-center justify-between rounded-[16px] border px-3 py-3 ${themeClasses.subtle}`}
              >
                <span className="theme-text-secondary text-sm">{label}</span>
                <span className="theme-text-primary text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsPanel({ themeClasses }: { themeClasses: ThemeClasses }) {
  return (
    <div className="space-y-3.5">
      <div className="grid gap-3 md:grid-cols-3">
        {INSIGHT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-[20px] border px-4 py-4 shadow-[0_16px_28px_rgba(0,0,0,0.18)] ${themeClasses.card}`}
          >
            <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
              {metric.label}
            </p>
            <p className="theme-text-primary mt-3 text-2xl font-semibold tracking-[-0.05em] !text-white/88">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
                Recommendations
              </p>
              <p className="theme-text-primary mt-1 text-sm font-semibold tracking-[-0.01em] !text-white/88">
                Next moves for the workspace
              </p>
            </div>
            <StatusPill themeClasses={themeClasses}>AI summary</StatusPill>
          </div>

          <div className="mt-4 space-y-3">
            {[
              "Promote the roadmap template to the default intake flow.",
              "Archive inactive pages after seven days to reduce dashboard noise.",
              "Add one approval checkpoint before the fulfillment handoff.",
            ].map((item) => (
              <div
                key={item}
                className={`theme-text-secondary rounded-[16px] border px-4 py-3 text-sm leading-6 !text-white/60 ${themeClasses.subtle}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[22px] border p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)] ${themeClasses.panel}`}
        >
          <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
            Highlights
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              ["Top gain", "Approvals now finish 28% faster."],
              ["Watch item", "Two pages still use manual owner assignment."],
              ["Next test", "Measure handoff quality after template rollout."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className={`rounded-[16px] border px-3 py-3 ${themeClasses.subtle}`}
              >
                <p className="theme-text-primary text-sm font-semibold !text-white/88">{title}</p>
                <p className="theme-text-secondary mt-1 text-sm leading-6 !text-white/60">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoContent({
  view,
  themeClasses,
  isLightTheme,
}: {
  view: DemoView;
  themeClasses: ThemeClasses;
  isLightTheme: boolean;
}) {
  if (view === "automation") {
    return <AutomationPanel themeClasses={themeClasses} isLightTheme={isLightTheme} />;
  }

  if (view === "insights") {
    return <InsightsPanel themeClasses={themeClasses} />;
  }

  return <WorkspacePanel themeClasses={themeClasses} />;
}

export default function NotionWorkspaceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const [activeView, setActiveView] = useState<DemoView>("workspace");
  const [titleIndex, setTitleIndex] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [panelTheme, setPanelTheme] = useState<PanelTheme>("dark");
  const [typedTitle, setTypedTitle] = useState("");
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);
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
    panel: isLightTheme
      ? "border-black/[0.08] bg-[#f7f7f5] transition-colors duration-200"
      : "border-white/[0.08] bg-[#202020] transition-colors duration-200",
    subtle: isLightTheme
      ? "border-black/[0.08] bg-black/[0.035] transition-colors duration-200"
      : "border-white/[0.08] bg-white/[0.045] transition-colors duration-200",
    tableHeader: isLightTheme
      ? "border-black/[0.08] bg-black/[0.035] text-black/40 transition-colors duration-200"
      : "border-white/[0.08] bg-white/[0.045] text-white/36 transition-colors duration-200",
    rowBorder: isLightTheme ? "border-black/[0.06]" : "border-white/[0.06]",
    statusBadge: isLightTheme
      ? "border-black/[0.08] bg-black/[0.04] text-black/60 transition-colors duration-200"
      : "border-white/[0.1] bg-white/[0.065] text-white/65 transition-colors duration-200",
    navActive: isLightTheme
      ? "border-black/[0.12] bg-black/[0.08] text-black/82 transition-colors duration-200"
      : "border-white/[0.12] bg-white/[0.09] text-white/82 transition-colors duration-200",
    navInactive: isLightTheme
      ? "border-black/[0.08] bg-black/[0.035] text-black/55 hover:bg-black/[0.06] transition-colors duration-200"
      : "border-white/[0.08] bg-white/[0.045] text-white/55 hover:bg-white/[0.07] transition-colors duration-200",
    sidebarItemActive: isLightTheme
      ? "bg-black/[0.08] !text-black/88 transition-colors duration-200"
      : "bg-white/[0.08] !text-white transition-colors duration-200",
    sidebarItemInactive: isLightTheme
      ? "text-black/55 hover:bg-black/[0.045] hover:text-black/78 transition-colors duration-200"
      : "text-white/55 hover:bg-white/[0.055] hover:text-white/78 transition-colors duration-200",
    separator: isLightTheme ? "border-black/[0.08]" : "border-white/[0.08]",
    cursor: isLightTheme ? "bg-black/55" : "bg-white/70",
  };
  const transition = useMemo(() => getTransition(reduceMotion), [reduceMotion]);
  const activeMeta = useMemo(() => getViewMeta(activeView), [activeView]);
  const activeSystem = OS_SYSTEMS[titleIndex] ?? OS_SYSTEMS[0];
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
                      <span className="min-w-0 truncate">
                        {item.label}
                      </span>
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
              className={`flex min-h-0 flex-col rounded-[20px] border p-3 sm:p-4 ${themeClasses.content}`}
            >
              <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${themeClasses.separator}`}>
                <div>
                  <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.08em] !text-white/40">
                    A workspace built around your team
                  </p>
                  <p className="theme-text-primary mt-1 text-lg font-semibold tracking-[-0.04em] !text-white/88">
                    {activeMeta.title}
                  </p>
                  <p className="theme-text-secondary mt-1 text-sm !text-white/62">
                    {activeMeta.detail}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill themeClasses={themeClasses}>{activeMeta.pill}</StatusPill>
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeView === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Switch to ${item.label}`}
                        aria-pressed={isActive}
                        onClick={() => setActiveView(item.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          isActive ? themeClasses.navActive : themeClasses.navInactive
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeView}
                    initial={reduceMotion ? false : { opacity: 0, x: 14, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -12, y: -8 }}
                    transition={transition}
                    className="h-full overflow-auto pr-1"
                  >
                    <DemoContent
                      view={activeView}
                      themeClasses={themeClasses}
                      isLightTheme={isLightTheme}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <aside
              className={`hidden min-h-0 flex-col rounded-[20px] border p-3 lg:flex ${themeClasses.assistant}`}
            >
              <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.18em] !text-white/40">
                Assistant
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  "Suggesting a simpler intake view for new client requests.",
                  "Detected repeated handoff steps that can become one automation.",
                  "Highlighting pages with the highest approval lag.",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { ...transition, delay: index * 0.05 }}
                    className={`theme-text-secondary rounded-[16px] border px-3 py-3 text-sm leading-6 !text-white/70 shadow-[0_10px_20px_rgba(0,0,0,0.16)] ${themeClasses.subtle}`}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className={`mt-auto rounded-[16px] border p-3 ${themeClasses.subtle}`}>
                <p className="theme-text-muted text-[10px] font-semibold uppercase tracking-[0.18em] !text-white/40">
                  Quick note
                </p>
                <p className="theme-text-secondary mt-2 text-sm leading-6 !text-white/58">
                  Navigation swaps the active workspace state without changing the hero layout.
                </p>
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
