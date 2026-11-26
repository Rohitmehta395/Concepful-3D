import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createHudManager } from "@/engine/overlay/hud";
import wiringMessages from "./wiring-messages.json";

describe("Lane wiring: messages fixture & HUD", () => {
  it("contains all 18 reference call() message templates", () => {
    const keys = Object.keys(wiringMessages);
    expect(keys).toHaveLength(18);
    expect(wiringMessages.formUpSolo.template).toBe(
      "Mission start. Good hunting."
    );
    expect(wiringMessages.formUpSquad.template).toBe(
      "Ready check passed. Everyone is ready."
    );
    expect(wiringMessages.formUpCombine.template).toBe(
      "Raid launched. All units aboard."
    );
  });

  it("matches reference/Concepful_Mech_Builder.html verbatim for literal messages", () => {
    const refHtml = fs.readFileSync(
      path.resolve(process.cwd(), "reference/Concepful_Mech_Builder.html"),
      "utf8"
    );
    expect(refHtml).toContain(wiringMessages.formUpSolo.template);
    expect(refHtml).toContain(wiringMessages.formUpSquad.template);
    expect(refHtml).toContain(wiringMessages.formUpCombine.template);
    expect(refHtml).toContain(wiringMessages.objectiveMinOne.template);
    expect(refHtml).toContain(wiringMessages.bootWelcome.template);
  });

  it("supports triggerForm(offsetMs) and getFormT() on HudManager", () => {
    const hud = createHudManager();
    expect(hud.getFormT?.()).toBe(0);
    hud.triggerForm(900);
    expect(hud.getFormT?.()).not.toBe(0);
    hud.dispose();
    expect(hud.getFormT?.()).toBe(0);
  });
});
