"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type DemoView = "workspace" | "automation" | "insights";

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

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-full border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/58">
      {children}
    </span>
  );
}

function WorkspacePanel() {
  return (
    <div className="space-y-3.5">
      <div className="grid gap-3 xl:grid-cols-3">
        {WORKSPACE_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-[20px] border border-white/[0.08] bg-[#151821] px-4 py-4 shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
          >
            <StatusPill>Page</StatusPill>
            <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-white/88">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/58">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-[22px] border border-white/[0.08] bg-[#111217] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                Core database
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.01em] text-white/84">
                Product ops board
              </p>
            </div>
            <StatusPill>Synced</StatusPill>
          </div>

          <div className="mt-4 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0d0f14]">
            <div className="grid grid-cols-[minmax(0,1.8fr)_88px_92px] border-b border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/36">
              <span>Item</span>
              <span>Owner</span>
              <span>Status</span>
            </div>
            {DATABASE_ROWS.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[minmax(0,1.8fr)_88px_92px] items-center border-b border-white/[0.06] px-3 py-3 last:border-b-0"
              >
                <span className="truncate pr-3 text-sm font-medium text-white/78">{row.name}</span>
                <span className="text-sm text-white/48">{row.owner}</span>
                <span className="inline-flex w-fit rounded-full border border-[#2f6fed]/40 bg-[#102033] px-2.5 py-1 text-[11px] font-medium text-[#8cb4ff]">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/[0.08] bg-[#0f1117] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
            Action queue
          </p>
          <div className="mt-3 space-y-2.5">
            {["Planning locked", "Assets attached", "Handoff ready"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-3 py-3"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full border border-[#2f6fed]/40 bg-[#102033] text-[10px] font-semibold uppercase text-[#9abaff]">
                  OK
                </span>
                <span className="text-sm font-medium text-white/72">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationPanel() {
  return (
    <div className="space-y-3.5">
        <div className="rounded-[22px] border border-white/[0.08] bg-[#111217] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                Automation map
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.01em] text-white/84">
                Lead intake to delivery handoff
              </p>
            </div>
          <StatusPill>System healthy</StatusPill>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {AUTOMATION_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-[18px] border border-white/[0.08] bg-[#151821] p-4"
            >
              <StatusPill>{`Step ${index + 1}`}</StatusPill>
              <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-white/86">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/56">{step.meta}</p>
              <div className="mt-4 inline-flex rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/60">
                {step.status}
              </div>
              {index < AUTOMATION_STEPS.length - 1 ? (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-white/[0.12] xl:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-[22px] border border-white/[0.08] bg-[#0f1117] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
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
                className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/62"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/[0.08] bg-[#111217] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
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
                className="flex items-center justify-between rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-3 py-3"
              >
                <span className="text-sm text-white/54">{label}</span>
                <span className="text-sm font-semibold text-white/76">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsPanel() {
  return (
    <div className="space-y-3.5">
      <div className="grid gap-3 md:grid-cols-3">
        {INSIGHT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[20px] border border-white/[0.08] bg-[#151821] px-4 py-4 shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white/84">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-[22px] border border-white/[0.08] bg-[#111217] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                Recommendations
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.01em] text-white/84">
                Next moves for the workspace
              </p>
            </div>
            <StatusPill>AI summary</StatusPill>
          </div>

          <div className="mt-4 space-y-3">
            {[
              "Promote the roadmap template to the default intake flow.",
              "Archive inactive pages after seven days to reduce dashboard noise.",
              "Add one approval checkpoint before the fulfillment handoff.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/64"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/[0.08] bg-[#0f1117] p-4 shadow-[0_16px_28px_rgba(0,0,0,0.2)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
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
                className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-3 py-3"
              >
                <p className="text-sm font-semibold text-white/78">{title}</p>
                <p className="mt-1 text-sm leading-6 text-white/56">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoContent({ view }: { view: DemoView }) {
  if (view === "automation") {
    return <AutomationPanel />;
  }

  if (view === "insights") {
    return <InsightsPanel />;
  }

  return <WorkspacePanel />;
}

export default function NotionWorkspaceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const [activeView, setActiveView] = useState<DemoView>("workspace");
  const [titleIndex, setTitleIndex] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [typedTitle, setTypedTitle] = useState("");
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);
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
      className="group relative h-[420px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0f] shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_36px_96px_rgba(0,0,0,0.52)] sm:h-[460px] lg:h-[520px]"
      style={{
        fontFamily:
          '"Inter", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 10%, rgba(61,88,134,0.2), transparent 28%), radial-gradient(circle at 82% 16%, rgba(121,76,162,0.14), transparent 26%), linear-gradient(180deg, #0b0b0f 0%, #111218 42%, #17171d 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23ffffff' fill-opacity='.045'%3E%3Ccircle cx='14' cy='18' r='1'/%3E%3Ccircle cx='44' cy='30' r='1'/%3E%3Ccircle cx='90' cy='18' r='1'/%3E%3Ccircle cx='104' cy='56' r='1'/%3E%3Ccircle cx='26' cy='74' r='1'/%3E%3Ccircle cx='72' cy='86' r='1'/%3E%3Ccircle cx='30' cy='104' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 p-2.5 sm:p-3">
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0e1015]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
          <div className="flex h-12 items-center gap-3 border-b border-white/[0.08] bg-white/[0.03] px-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] font-serif text-[11px] font-semibold text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                N
              </div>
              <span className="inline-flex min-w-[164px] items-center text-sm font-medium text-white/76 sm:min-w-[192px]">
                <span className="inline-flex items-center whitespace-nowrap">
                  <span>{reduceMotion ? activeTitlePrefix : typedTitle}</span>
                  {!reduceMotion ? (
                    <span
                      aria-hidden="true"
                      className="typewriter-cursor mx-0.5 h-4 w-px bg-white/70"
                    />
                  ) : null}
                  <span>{" OS"}</span>
                </span>
              </span>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2">
              <div className="hidden min-w-[150px] flex-1 items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/42 sm:flex">
                Search workspace...
              </div>
              <span className="inline-flex rounded-full border border-[#2f6fed]/35 bg-[#102033] px-3 py-1 text-[11px] font-medium text-[#8cb4ff]">
                Live system
              </span>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[136px_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[156px_minmax(0,1fr)] sm:p-4 lg:grid-cols-[176px_minmax(0,1fr)_188px]">
            <aside className="flex min-h-0 flex-col rounded-[20px] border border-white/[0.08] bg-[#0f1117] px-2.5 pb-2.5 pt-2">
              <div className="px-1.5">
                <p className="text-[11px] font-medium leading-none text-white/38">Private</p>
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
                      className={`flex w-full cursor-pointer appearance-none items-center gap-2 rounded-md border-0 px-2 py-1.5 text-left text-sm font-medium transition active:bg-white/[0.075] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/30 ${
                        isActive
                          ? "bg-white/[0.08] text-white/88"
                          : "text-white/58 hover:bg-white/[0.045] hover:text-white/78"
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center text-[13px] leading-none">
                        {item.emoji}
                      </span>
                      <span className="min-w-0 truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-3 border-t border-white/[0.08] px-2 pt-3">
                <div className="rounded-md px-2 py-1.5 text-xs text-white/36">
                  {activeSystem.menu.length} pages
                </div>
              </div>
            </aside>

            <div className="flex min-h-0 flex-col rounded-[20px] border border-white/[0.08] bg-[#111217] p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/34">
                  A workspace built around your team
                </p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-white/86">
                    {activeMeta.title}
                  </p>
                  <p className="mt-1 text-sm text-white/52">{activeMeta.detail}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill>{activeMeta.pill}</StatusPill>
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
                          isActive
                            ? "border-[#2f6fed]/40 bg-[#102033] text-[#9abaff]"
                            : "border-white/[0.08] bg-white/[0.04] text-white/58 hover:bg-white/[0.07]"
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
                    <DemoContent view={activeView} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <aside className="hidden min-h-0 flex-col rounded-[20px] border border-white/[0.08] bg-[#0f1117] p-3 lg:flex">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
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
                    className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-sm leading-6 text-white/60 shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto rounded-[16px] border border-white/[0.08] bg-white/[0.04] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
                  Quick note
                </p>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  Navigation swaps the active workspace state without changing the hero layout.
                </p>
              </div>
            </aside>
          </div>
        </div>
        <style jsx>{`
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
