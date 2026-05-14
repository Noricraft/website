"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

type DemoView = "workspace" | "automation" | "insights";

type NavItem = {
  id: DemoView;
  label: string;
  eyebrow: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "workspace", label: "Workspace", eyebrow: "Overview" },
  { id: "automation", label: "Automation", eyebrow: "Flows" },
  { id: "insights", label: "Insights", eyebrow: "Review" },
];

const SECONDARY_ITEMS = [
  { label: "Pages", value: "12" },
  { label: "Templates", value: "08" },
  { label: "Automations", value: "05" },
];

const WORKSPACE_CARDS = [
  {
    title: "Weekly launch board",
    detail: "Owners, dates, and blockers synced in one view.",
    tone: "bg-[#f5f2ea]",
  },
  {
    title: "Client portal",
    detail: "Shared updates, approvals, and next actions.",
    tone: "bg-[#eef4ff]",
  },
  {
    title: "Content calendar",
    detail: "Drafts, briefs, and assets mapped by status.",
    tone: "bg-[#eef8f0]",
  },
];

const DATABASE_ROWS = [
  { name: "Homepage refresh", owner: "Ava", status: "Ready" },
  { name: "Partner onboarding", owner: "Leo", status: "In review" },
  { name: "Renewal outreach", owner: "Mina", status: "Planned" },
];

const AUTOMATION_STEPS = [
  { title: "Intake form submitted", meta: "Lead captured", status: "Done" },
  { title: "AI brief generated", meta: "Summary + tags", status: "Running" },
  { title: "Owner assigned", meta: "Based on template", status: "Queued" },
];

const INSIGHT_METRICS = [
  { label: "Hours saved", value: "19.4h" },
  { label: "Tasks automated", value: "42" },
  { label: "Approval speed", value: "+28%" },
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

function WorkspacePanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-3">
        {WORKSPACE_CARDS.map((card) => (
          <div
            key={card.title}
            className={`rounded-[22px] border border-black/8 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)] ${card.tone}`}
          >
            <div className="inline-flex rounded-full border border-black/8 bg-white/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
              Page
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-[-0.03em] text-black/85">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-black/56">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-[24px] border border-black/8 bg-white/88 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
                Content ops
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-black/84">
                Live database
              </p>
            </div>
            <div className="rounded-full border border-black/8 bg-[#f7f7f5] px-3 py-1 text-[11px] font-medium text-black/54">
              Synced
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[18px] border border-black/8">
            <div className="grid grid-cols-[minmax(0,1.8fr)_88px_92px] border-b border-black/8 bg-[#f8f7f4] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/42">
              <span>Item</span>
              <span>Owner</span>
              <span>Status</span>
            </div>
            {DATABASE_ROWS.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[minmax(0,1.8fr)_88px_92px] items-center border-b border-black/6 px-3 py-3 last:border-b-0"
              >
                <span className="truncate pr-3 text-sm font-medium text-black/78">{row.name}</span>
                <span className="text-sm text-black/54">{row.owner}</span>
                <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/8 bg-[#faf8f4] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
            Checklist
          </p>
          <div className="mt-3 space-y-2.5">
            {["Planning locked", "Assets attached", "Handoff ready"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[18px] border border-black/8 bg-white px-3 py-3"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] font-semibold uppercase text-white">
                  OK
                </span>
                <span className="text-sm font-medium text-black/72">{item}</span>
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
    <div className="space-y-4">
      <div className="rounded-[24px] border border-black/8 bg-white/90 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
              Automation map
            </p>
            <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-black/84">
              Lead intake to delivery handoff
            </p>
          </div>
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
            2 active flows
          </div>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {AUTOMATION_STEPS.map((step, index) => (
            <div key={step.title} className="relative rounded-[20px] border border-black/8 bg-[#faf8f4] p-4">
              <div className="inline-flex rounded-full border border-black/8 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/42">
                Step {index + 1}
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-[-0.03em] text-black/82">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-black/54">{step.meta}</p>
              <div className="mt-4 inline-flex rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-medium text-black/60">
                {step.status}
              </div>
              {index < AUTOMATION_STEPS.length - 1 ? (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-black/12 xl:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-[24px] border border-black/8 bg-[#f4f7ff] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
            Safeguards
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              "Fallback owner assigned if no match is found.",
              "Slack update sent only after approval status changes.",
              "Database log stored for every automation run.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-black/8 bg-white/88 px-4 py-3 text-sm leading-6 text-black/62"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/8 bg-white/90 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
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
                className="flex items-center justify-between rounded-[18px] border border-black/8 bg-[#faf8f4] px-3 py-3"
              >
                <span className="text-sm text-black/56">{label}</span>
                <span className="text-sm font-semibold text-black/76">{value}</span>
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
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {INSIGHT_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[22px] border border-black/8 bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-black/84">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-[24px] border border-black/8 bg-[#f6f4ef] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
                Recommendations
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-black/84">
                Next moves for the workspace
              </p>
            </div>
            <div className="rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-medium text-black/60">
              AI summary
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              "Promote the launch board template to the default intake flow.",
              "Archive inactive pages after seven days to reduce dashboard noise.",
              "Add one approval checkpoint before the fulfillment handoff.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-black/8 bg-white/88 px-4 py-3 text-sm leading-6 text-black/64"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/8 bg-white/90 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
            Highlights
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              ["Top gain", "Approvals now finish 28% faster."],
              ["Watch item", "Two pages still use manual owner assignment."],
              ["Next test", "Measure handoff quality after template rollout."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[18px] border border-black/8 bg-[#faf8f4] px-3 py-3">
                <p className="text-sm font-semibold text-black/78">{title}</p>
                <p className="mt-1 text-sm leading-6 text-black/56">{copy}</p>
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
  const [activeView, setActiveView] = useState<DemoView>("workspace");
  const transition = useMemo(() => getTransition(shouldReduceMotion), [shouldReduceMotion]);

  return (
    <div className="group relative h-[420px] w-full overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_72px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_30px_90px_rgba(0,0,0,0.16)] sm:h-[460px] lg:h-[520px]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 10%, rgba(255,255,255,0.96), transparent 28%), radial-gradient(circle at 84% 12%, rgba(242,247,255,0.88), transparent 30%), linear-gradient(145deg, #f8f5ef 0%, #f3efe8 46%, #fbfaf8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23000000' fill-opacity='.05'%3E%3Ccircle cx='14' cy='18' r='1'/%3E%3Ccircle cx='44' cy='30' r='1'/%3E%3Ccircle cx='90' cy='18' r='1'/%3E%3Ccircle cx='104' cy='56' r='1'/%3E%3Ccircle cx='26' cy='74' r='1'/%3E%3Ccircle cx='72' cy='86' r='1'/%3E%3Ccircle cx='30' cy='104' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 p-3 sm:p-4">
        <div className="grid h-full grid-cols-[136px_minmax(0,1fr)] gap-3 rounded-[24px] border border-white/70 bg-white/62 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-[10px] sm:grid-cols-[164px_minmax(0,1fr)] lg:grid-cols-[176px_minmax(0,1fr)_188px]">
          <aside className="flex min-h-0 flex-col rounded-[22px] border border-black/8 bg-[#fcfbf8] p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
                Workspace
              </p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.03em] text-black/82">
                Noricraft OS
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Open ${item.label} view`}
                    aria-pressed={isActive}
                    onClick={() => setActiveView(item.id)}
                    className={`relative w-full rounded-[18px] border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-black/12 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
                        : "border-transparent bg-transparent hover:border-black/8 hover:bg-white/70"
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                      {item.eyebrow}
                    </div>
                    <div className="mt-1 text-sm font-semibold tracking-[-0.02em] text-black/78">
                      {item.label}
                    </div>
                    {isActive ? (
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-[18px] ring-1 ring-black/6"
                        layoutId="active-nav-item"
                        transition={transition}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 border-t border-black/8 pt-4">
              {SECONDARY_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[16px] bg-white/70 px-3 py-2.5"
                >
                  <span className="text-sm text-black/56">{item.label}</span>
                  <span className="text-sm font-semibold text-black/74">{item.value}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-h-0 flex-col rounded-[22px] border border-black/8 bg-white/72 p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
                  A workspace built around your team
                </p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-black/86">
                  Systems, automations, and answers in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
                          ? "border-black/12 bg-black text-white"
                          : "border-black/10 bg-white/80 text-black/62 hover:bg-black/5"
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
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 14, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -12, y: -8 }}
                  transition={transition}
                  className="h-full overflow-auto pr-1"
                >
                  <DemoContent view={activeView} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <aside className="hidden min-h-0 flex-col rounded-[22px] border border-black/8 bg-[#faf8f4] p-3 lg:flex">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
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
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { ...transition, delay: index * 0.05 }}
                  className="rounded-[18px] border border-black/8 bg-white/90 px-3 py-3 text-sm leading-6 text-black/60 shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                >
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto rounded-[18px] border border-black/8 bg-white/92 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
                Quick note
              </p>
              <p className="mt-2 text-sm leading-6 text-black/58">
                Click the navigation to swap the workspace state without changing the hero layout.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
