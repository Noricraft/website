"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { type RefObject, useEffect, useRef, useState } from "react";

type ContentType = "tasks" | "preview" | "cli";

type DemoWindowData = {
  id: string;
  title: string;
  subtitle: string;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  contentType: ContentType;
};

type DemoWindowProps = {
  data: DemoWindowData;
  index: number;
  scale: number;
  zIndex: number;
  onFocus: (id: string) => void;
  constraintsRef: RefObject<HTMLDivElement | null>;
};

const BASE_DESKTOP_WIDTH = 620;
const BASE_DESKTOP_HEIGHT = 420;

const WINDOWS: DemoWindowData[] = [
  {
    id: "tasks",
    title: "Tasks",
    subtitle: "Ready for review",
    initialX: 22,
    initialY: 24,
    width: 328,
    height: 252,
    contentType: "tasks",
  },
  {
    id: "preview",
    title: "Preview",
    subtitle: "Landing page mock",
    initialX: 370,
    initialY: 34,
    width: 222,
    height: 222,
    contentType: "preview",
  },
  {
    id: "cli",
    title: "CLI",
    subtitle: "Workspace sync",
    initialX: 108,
    initialY: 292,
    width: 384,
    height: 104,
    contentType: "cli",
  },
];

const TASKS = [
  {
    title: "Hero layout finalized",
    description: "Spacing tuned for desktop and tablet breakpoints.",
  },
  {
    title: "Pricing cards aligned",
    description: "CTA hierarchy matches the latest product brief.",
  },
  {
    title: "Contact flow reviewed",
    description: "Form labels and states checked before handoff.",
  },
  {
    title: "Motion polish queued",
    description: "Soft entry animation prepared for the final pass.",
  },
];

const CLI_LINES = [
  "$ open workspace/noricraft-demo",
  "> validating pages...",
  "> syncing assets...",
];

const CLI_TYPING_TEXT = "success: preview ready on localhost:3000";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 5.5" />
    </svg>
  );
}

function TasksContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between rounded-2xl border border-black/8 bg-[#f7f7f5] px-3 py-2.5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
            Sprint board
          </p>
          <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-black/84">
            4 items approved for final check
          </p>
        </div>
        <div className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-black/58">
          Team queue
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {TASKS.map((task) => (
          <div
            key={task.title}
            className="rounded-[20px] border border-black/8 bg-white/92 px-3 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 shadow-[0_6px_16px_rgba(16,185,129,0.28)]">
                <CheckIcon />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-[-0.02em] text-black/84">
                  {task.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-black/56">{task.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewContent() {
  return (
    <div className="h-full rounded-[22px] border border-black/10 bg-white shadow-[0_16px_35px_rgba(0,0,0,0.05)]">
      <div className="border-b border-black/8 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="h-2 w-14 rounded-full bg-black/8" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-black/10" />
            <span className="h-2 w-2 rounded-full bg-black/10" />
            <span className="h-2 w-2 rounded-full bg-black/10" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="rounded-[18px] bg-[#f3efe8] px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Product page
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-black/86">
            Ship cleaner systems with fewer manual steps.
          </h3>
          <p className="mt-2 text-xs leading-5 text-black/58">
            Build templates, automate handoffs, and keep every team in one calm workspace.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-black px-3 py-1.5 text-[11px] font-medium text-white">
            Book a walkthrough
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-black/8 bg-[#faf9f7] p-2.5">
              <div className="h-14 rounded-xl bg-black/[0.055]" />
              <div className="mt-2 h-2 w-10 rounded-full bg-black/10" />
              <div className="mt-1 h-2 w-14 rounded-full bg-black/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CLIContent() {
  const shouldReduceMotion = useReducedMotion();
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedText(CLI_TYPING_TEXT.slice(0, index));

      if (index >= CLI_TYPING_TEXT.length) {
        window.clearInterval(interval);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  const displayedText = shouldReduceMotion ? CLI_TYPING_TEXT : typedText;

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-white/6 bg-[#0c0f14] px-3.5 py-3 font-mono text-[11px] text-[#d8e0ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7f8a99]">
        <span>Terminal</span>
        <span>bash</span>
      </div>
      <div className="space-y-1.5">
        {CLI_LINES.map((line) => (
          <div key={line} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
        <div className="whitespace-pre-wrap break-words text-[#8de2b0]">
          {`> ${displayedText}`}
          {!shouldReduceMotion ? (
            <span className="ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[2px] bg-[#8de2b0]" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function renderContent(type: ContentType) {
  switch (type) {
    case "tasks":
      return <TasksContent />;
    case "preview":
      return <PreviewContent />;
    case "cli":
      return <CLIContent />;
    default:
      return null;
  }
}

function DemoWindow({
  data,
  index,
  scale,
  zIndex,
  onFocus,
  constraintsRef,
}: DemoWindowProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 180, damping: 18, mass: 0.5 });
  const rotateY = useSpring(rotateYValue, { stiffness: 180, damping: 18, mass: 0.5 });
  const highlight = useMotionTemplate`radial-gradient(180px circle at ${pointerX}% ${pointerY}%, rgba(255,255,255,0.72), rgba(255,255,255,0.28) 18%, transparent 65%)`;

  function resetWindowEffects() {
    rotateXValue.set(0);
    rotateYValue.set(0);
    pointerX.set(50);
    pointerY.set(50);
    setIsHovered(false);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100;
    const maxTilt = 2.6;

    pointerX.set(relativeX);
    pointerY.set(relativeY);
    rotateYValue.set(((relativeX - 50) / 50) * maxTilt);
    rotateXValue.set(((50 - relativeY) / 50) * maxTilt);
  }

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.14}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 24 }}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.06,
      }}
      whileDrag={{
        scale: 1.015,
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.16)",
      }}
      onHoverStart={() => {
        if (!shouldReduceMotion) {
          setIsHovered(true);
        }
      }}
      onHoverEnd={resetWindowEffects}
      onPointerDown={() => onFocus(data.id)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetWindowEffects}
      onDragStart={() => onFocus(data.id)}
      className="absolute overflow-hidden rounded-[24px] border border-black/10 bg-white/85 shadow-[0_16px_45px_rgba(0,0,0,0.12)] backdrop-blur-md"
      style={{
        left: data.initialX * scale,
        top: data.initialY * scale,
        width: data.width * scale,
        height: data.height * scale,
        zIndex,
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: shouldReduceMotion ? 0 : isHovered ? 1 : 0,
          backgroundImage: shouldReduceMotion ? "none" : highlight,
        }}
      />
      <div className="flex h-full flex-col bg-gradient-to-b from-white/95 to-white/78">
        <div className="flex items-start justify-between border-b border-black/6 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold tracking-[-0.02em] text-black/82">
              {data.title}
            </p>
            <p className="truncate text-xs text-black/46">{data.subtitle}</p>
          </div>
        </div>
        <div className="flex-1 p-3">{renderContent(data.contentType)}</div>
      </div>
    </motion.div>
  );
}

export default function DesktopDemo() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stackOrder, setStackOrder] = useState(() => WINDOWS.map((window) => window.id));

  useEffect(() => {
    const node = desktopRef.current;

    if (!node) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextScale = Math.min(
        entry.contentRect.width / BASE_DESKTOP_WIDTH,
        entry.contentRect.height / BASE_DESKTOP_HEIGHT,
        1,
      );

      setScale(nextScale);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  function bringToFront(id: string) {
    setStackOrder((currentOrder) => {
      if (currentOrder[currentOrder.length - 1] === id) {
        return currentOrder;
      }

      return [...currentOrder.filter((item) => item !== id), id];
    });
  }

  return (
    <div
      ref={desktopRef}
      className="relative h-[420px] w-full overflow-hidden rounded-[28px] border border-black/10 bg-[#f5f1eb] shadow-[0_28px_80px_rgba(0,0,0,0.12)] sm:h-[460px] lg:h-[520px]"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 12%, rgba(255,255,255,0.95), transparent 30%), radial-gradient(circle at 88% 20%, rgba(255,255,255,0.72), transparent 28%), linear-gradient(145deg, #f7f3ee 0%, #efe8df 48%, #f5f1ec 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='%23000000' fill-opacity='.06'%3E%3Ccircle cx='12' cy='14' r='1'/%3E%3Ccircle cx='48' cy='36' r='1'/%3E%3Ccircle cx='92' cy='20' r='1'/%3E%3Ccircle cx='124' cy='52' r='1'/%3E%3Ccircle cx='28' cy='76' r='1'/%3E%3Ccircle cx='76' cy='88' r='1'/%3E%3Ccircle cx='116' cy='104' r='1'/%3E%3Ccircle cx='34' cy='122' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute inset-x-8 bottom-5 h-14 rounded-full border border-white/55 bg-white/38 blur-sm" />
      <div className="absolute inset-0 p-3 sm:p-4">
        {WINDOWS.map((window, index) => (
          <DemoWindow
            key={window.id}
            data={window}
            index={index}
            scale={scale}
            zIndex={stackOrder.indexOf(window.id) + 1}
            onFocus={bringToFront}
            constraintsRef={desktopRef}
          />
        ))}
      </div>
    </div>
  );
}
