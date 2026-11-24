import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ErrorPage from "@/app/error";
import GlobalError from "@/app/global-error";
import NotFound from "@/app/not-found";

describe("production error and fallback pages", () => {
  it("renders ErrorPage correctly with reset CTA", () => {
    const html = renderToStaticMarkup(
      React.createElement(ErrorPage, {
        error: new Error("Test error"),
        reset: () => {},
      })
    );
    expect(html).toContain("SYSTEM MALFUNCTION // ERROR");
    expect(html).toContain("Operation Interrupted");
    expect(html).toContain("Reboot System");
  });

  it("renders GlobalError correctly with html and body wrapper", () => {
    const html = renderToStaticMarkup(
      React.createElement(GlobalError, {
        error: new Error("Fatal test error"),
        reset: () => {},
      })
    );
    expect(html).toContain("<html");
    expect(html).toContain("<body");
    expect(html).toContain("CRITICAL SYSTEM FAILURE");
    expect(html).toContain("Core Overload");
    expect(html).toContain("Reboot System");
  });

  it("renders NotFound correctly with link to home", () => {
    const html = renderToStaticMarkup(React.createElement(NotFound));
    expect(html).toContain("404 // SECTOR NOT FOUND");
    expect(html).toContain("Lost in the Void");
    expect(html).toContain("Return to Base");
  });
});
