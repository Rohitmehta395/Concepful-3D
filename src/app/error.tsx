"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Telemetry error:", error);
  }, [error]);

  return (
    <main id="main" className="st">
      <div className="in">
        <div className="sc">
          <div className="eyebrow">SYSTEM MALFUNCTION // ERROR</div>
          <h2 className="mid">Operation Interrupted</h2>
          <p>
            An unexpected error occurred during operations. Diagnostics have
            been logged.
          </p>
          <div className="ctas">
            <button
              type="button"
              className="fu cursor-pointer"
              onClick={() => reset()}
            >
              Reboot System
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
