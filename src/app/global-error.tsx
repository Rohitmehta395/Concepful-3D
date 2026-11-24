"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical core error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className="font-sans"
        style={{ background: "#141624", color: "#ffffff" }}
      >
        <main id="main" className="st">
          <div className="in">
            <div className="sc">
              <div className="eyebrow">CRITICAL SYSTEM FAILURE</div>
              <h1 className="mid">Core Overload</h1>
              <p>
                A fatal error halted the core process. System reboot required.
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
      </body>
    </html>
  );
}
