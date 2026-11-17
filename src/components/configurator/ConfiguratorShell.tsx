"use client";

import { BUFFS, GEAR, QUESTS, TIERS, type TierId } from "@/content";
import { useConfigurator } from "./ConfiguratorProvider";

/**
 * ConfiguratorShell Component (Phase 6.2 - Solo Interactivity)
 *
 * Renders the configurator DOM shell with solo tier interactivity:
 * - #panel with steps 01 (mode), 02 (pick mission/gear), 03 (flagship, hidden), 04 (buffs, hidden), 03 (loadout/blueprint)
 * - #card with hero character sheet and live stats/level
 * - #boxart with title, server lead, and burst badge
 *
 * Wired to ConfiguratorProvider (useReducer + configReducer + quote).
 */
export function ConfiguratorShell() {
  const { state, dispatch, q, currentQuest, level, stats } = useConfigurator();

  const soloTier = TIERS.solo;

  return (
    <>
      <aside className="panel glass" id="panel">
        <div className="intro">
          <div className="eyebrow">
            Server: Concepful · Creative Department as a Service
          </div>
          <div className="mt">Assemble your creative department.</div>
          <p id="intro-p">
            Choose a game mode, pick your mission, watch your build come online.
            Every part is priced before you commit.
          </p>
        </div>

        {/* Step 01: Game Mode */}
        <section className="step" id="st-mode">
          <div className="sh">
            <span className="n">01</span>
            <h2>Game mode</h2>
          </div>
          <p className="hint">
            Solo, party or raid. Scale up whenever you&apos;re ready.
          </p>
          <div className="tiers" id="tiers">
            {(Object.entries(TIERS) as [TierId, (typeof TIERS)[TierId]][]).map(
              ([id, tItem]) => {
                const on = state.tier === id;
                const p = tItem.base;
                const formattedPrice = `$${p.toLocaleString("en-US")}`;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`tier${on ? " on" : " mini"}`}
                    data-tier={id}
                    aria-pressed={on}
                    onClick={() => dispatch({ type: "SET_TIER", tier: id })}
                  >
                    {"popular" in tItem && tItem.popular && (
                      <span className="badge">Most popular</span>
                    )}
                    <span>
                      <span className="t">{tItem.name}</span>
                      <span className="k">{tItem.sub}</span>
                    </span>
                    <span className="p">
                      {tItem.one ? "" : "from "}
                      {formattedPrice}
                      <small>{tItem.one ? "" : "/mo"}</small>
                    </span>
                    <span className="d">{tItem.d}</span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* Step 02: Pick Mission & Gear */}
        <section className="step" id="st-pick">
          <div className="sh">
            <span className="n">02</span>
            <h2 id="lo-h">Mission</h2>
          </div>
          <p className="hint" id="lo-hint">
            Pick a mission. It summons your hero.
          </p>
          <div id="groups">
            <div className="grp">
              <div className="gh">
                <i style={{ background: "var(--red)" }}></i>
                <b>Missions</b>
                <span>Pick one</span>
              </div>
              <div className="opts radio">
                {QUESTS.map((qItem) => {
                  const on = state.mission === qItem.id;
                  return (
                    <button
                      key={qItem.id}
                      type="button"
                      className={`opt${on ? " on" : ""}`}
                      data-mission={qItem.id}
                      aria-pressed={on}
                      onClick={() =>
                        dispatch({ type: "SET_MISSION", mission: qItem.id })
                      }
                    >
                      <span className="ck" aria-hidden="true"></span>
                      <span className="ot">
                        <b>{qItem.name}</b>
                        <small>{qItem.desc}</small>
                        <em>
                          Summons · {qItem.hero}{" "}
                          <span className="dom">{qItem.cls.toUpperCase()}</span>
                        </em>
                      </span>
                      <span className="op">
                        {qItem.p > 0
                          ? `+$${qItem.p.toLocaleString("en-US")}`
                          : "incl."}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grp">
              <div className="gh">
                <i style={{ background: "var(--sun)" }}></i>
                <b>Gear</b>
                <span>Optional</span>
              </div>
              <div className="opts">
                {GEAR.filter((e) => e.not !== state.mission).map((e) => {
                  const on = state.extras.has(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      className={`opt${on ? " on" : ""}`}
                      data-extra={e.id}
                      aria-pressed={on}
                      onClick={() =>
                        dispatch({ type: "TOGGLE_EXTRA", gearId: e.id })
                      }
                    >
                      <span className="ck" aria-hidden="true"></span>
                      <span className="ot">
                        <b>{e.name}</b>
                        <small>{e.desc}</small>
                        <em>Adds · {e.fx}</em>
                      </span>
                      <span className="op">
                        +${e.p.toLocaleString("en-US")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`nudge${state.tier === "solo" && state.extras.size >= 2 ? " show" : ""}`}
            id="nudge"
          >
            <span>Bigger mission than one hero can carry? Bring a party.</span>
            <button type="button" data-tier="squad">
              Form a Full Crew
            </button>
          </div>
        </section>

        {/* Step 03: Flagship (Hidden in Solo mode) */}
        <section className="step" id="st-ship" hidden>
          <div className="sh">
            <span className="n">03</span>
            <h2>Flagship</h2>
          </div>
          <p className="hint">
            Included with Full Force. It upgrades on its own as you add raid
            buffs.
          </p>
          <div id="ships"></div>
        </section>

        {/* Step 04: Raid Buffs (Hidden in Solo mode) */}
        <section className="step" id="st-buffs" hidden>
          <div className="sh">
            <span className="n">04</span>
            <h2>Raid buffs</h2>
          </div>
          <p className="hint">
            Specialist gear and AI systems. Each one brings a new unit or
            effect.
          </p>
          <div className="opts" id="buffs">
            {BUFFS.map((b) => (
              <button
                key={b.id}
                type="button"
                className="opt"
                data-buff={b.id}
                aria-pressed="false"
              >
                <span className="ck" aria-hidden="true"></span>
                <span className="ot">
                  <b>{b.name}</b>
                  <small>{b.desc}</small>
                  <em>{b.fx}</em>
                </span>
                <span className="op">+${b.p.toLocaleString("en-US")}/mo</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 05 (numbered 03 in solo): Loadout & Blueprint */}
        <section className="step" id="st-load">
          <div className="sh">
            <span className="n">03</span>
            <h2>Loadout</h2>
          </div>
          <p className="hint">
            Itemized, and a ceiling. No hidden microtransactions. We confirm the
            final number after reviewing your materials.
          </p>
          <div className="toggle" id="bill" hidden>
            <button type="button" id="b-mo" className="on">
              Monthly
            </button>
            <button type="button" id="b-yr">
              Annual <em>−10%</em>
            </button>
          </div>
          <div className="bp" id="bp">
            <div className="bl">
              <span className="l">
                <i style={{ background: "var(--fg)" }}></i>
                {`Mission · ${currentQuest.hero}`}
              </span>
              <span className="n">
                {"$" + q.T.base.toLocaleString("en-US")}
              </span>
            </div>
            <div className="bl mut">
              <span className="l">
                <i style={{ background: "var(--dim)" }}></i>
                {"Mission included"}
              </span>
              <span className="n">incl.</span>
            </div>
            {q.lines.map((l) => (
              <div key={l.name} className="bl">
                <span className="l">
                  <i style={{ background: l.c }}></i>
                  {l.name}
                </span>
                <span className="n">{"+$" + l.p.toLocaleString("en-US")}</span>
              </div>
            ))}
            <div className="bl total">
              <span>Estimated fixed fee</span>
              <span className="n">{"$" + q.total.toLocaleString("en-US")}</span>
            </div>
          </div>
          <button className="fu wide" type="button" data-formup="">
            {soloTier.fu}
          </button>
          <p className="fine">
            Fast kickoff · Senior lead on every build · IP transfers on
            delivery.
            <br />
            Prototype: prices illustrative, nothing is sent.
          </p>
        </section>
      </aside>

      {/* Character Sheet Card */}
      <section className="card glass" id="card" aria-label="Character sheet">
        <div className="hd">
          <span id="chd">Character</span>
          <span id="cid">LV {level}</span>
        </div>
        <div className="bd">
          <canvas
            id="patch"
            aria-hidden="true"
            height="132"
            width="132"
          ></canvas>
          <div className="cn" id="cn">
            {currentQuest.hero}
          </div>
          <div className="cc" id="cc">
            {currentQuest.cls}
          </div>
          <div className="stats" id="stats">
            {stats.map(([code, name, val]) => (
              <div key={code} className="stat">
                <span title={name}>{`${code} · ${name}`}</span>
                <span className="bar">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <i key={idx} className={idx < val ? "on" : ""} />
                  ))}
                </span>
                <b>{val}</b>
              </div>
            ))}
          </div>
          <div className="party" id="party"></div>
          <div className="motto">
            <span>Motto</span>
            <q id="motto">{TIERS[state.tier].motto}</q>
          </div>
        </div>
      </section>

      {/* Boxart Visual Branding */}
      <div className="boxart" id="boxart">
        <div>
          <h1 className="title">
            Assemble your
            <br />
            <span>creative</span> department.
          </h1>
          <div className="fp">
            Server: Concepful · Senior lead on every build · Four encounters to
            clear
          </div>
        </div>
        <div className="burst">
          No pay
          <br />
          to win.
          <br />
          Priced
          <br />
          up front.
        </div>
      </div>
    </>
  );
}
