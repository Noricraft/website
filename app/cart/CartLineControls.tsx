"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeLine, updateLine } from "../actions/cart";

type CartLineControlsProps = {
  lineId: string;
  quantity: number;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return "Cart update failed.";
}

export default function CartLineControls({
  lineId,
  quantity,
}: CartLineControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const runAction = (action: () => Promise<unknown>) => {
    setError("");
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (actionError) {
        setError(getErrorMessage(actionError));
      }
    });
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
          onClick={() => runAction(() => updateLine(lineId, quantity - 1))}
        >
          -
        </button>
        <span className="min-w-8 text-center text-sm font-medium text-black">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="h-8 w-8 rounded-full border border-black/10 bg-white text-sm font-medium hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
          onClick={() => runAction(() => updateLine(lineId, quantity + 1))}
        >
          +
        </button>
        <button
          type="button"
          className="ml-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
          onClick={() => runAction(() => removeLine(lineId))}
        >
          Remove
        </button>
        {isPending ? (
          <span className="text-xs text-black/50" role="status" aria-live="polite">
            Updating...
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
