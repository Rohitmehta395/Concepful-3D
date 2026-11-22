"use client";

import { BUFFS, GEAR, OBJECTIVES, QUESTS, TIERS, type TierId } from "@/content";
import { fmt } from "@/domain/labels";
import { useConfigurator } from "./ConfiguratorProvider";
import { ENCD } from "./encounters";

/**
 * ConfiguratorShell Component (Phase 6.3b - Squad Tier Interactivity)
 *
 * Renders the configurator DOM shell with solo and squad tier interactivity:
 * - #panel with steps 01 (mode), 02 (pick mission/objective), 03 (flagship, hidden in solo/squad), 04 (buffs, hidden in solo/squad), 03/05 (loadout/blueprint)
 * - #card with live header (#chd), level (#cid), hero/squad name (#cn), class/leader (#cc), stats (#stats), party frames (#party), and motto (#motto)
 * - #boxart with title, server lead, and burst badge
 *
 * Wired to ConfiguratorProvider (useReducer + configReducer + quote + domain label helpers).
 */
export function ConfiguratorShell() {
  const {
    state,
    dispatch,
    q,
    currentQuest,
    level,
    stats,
    exOn,
    heroName,
    priceLabel,
    cardHeaderDesc,
    cardClassDesc,
    party,
  } = useConfigurator();

  const solo = state.tier === "solo";
  const raid = state.tier === "combine";

  const baseLineItem = solo
    ? `Mission · ${currentQuest.hero}`
    : `${q.T.name} · ${q.T.sub.split(" · ")[1]}`;

  return (
    <>
      <aside className="panel glass" id="panel">
        <div className="intro">
          <div className="eyebrow">
            Server: Concepful · Creative Department as a Service
          </div>
          <div className="mt">Assemble your creative department.</div>
          <p id="intro-p">{TIERS[state.tier].pitch}</p>
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
                const p =
                  !tItem.one && state.billing === "yr"
                    ? Math.round(tItem.base * 0.9)
                    : tItem.base;
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

        {/* Step 02: Pick Mission / Objective / Department */}
        <section className="step" id="st-pick">
          <div className="sh">
            <span className="n">02</span>
            <h2 id="lo-h">
              {solo ? "Mission" : raid ? "Department" : "Objective"}
            </h2>
          </div>
          <p className="hint" id="lo-hint">
            {solo
              ? "Pick a mission. It summons your hero."
              : raid
                ? "Full Force runs every objective at once. You and your lead set the priorities each month."
                : "Pick what you’re trying to do. The party forms around it, and specialists are confirmed at kickoff."}
          </p>
          <div id="groups" className="swap">
            {solo ? (
              <>
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
                              <span className="dom">
                                {qItem.cls.toUpperCase()}
                              </span>
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
                      const on = exOn(e.id);
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
                            {"+$" + e.p.toLocaleString("en-US")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : !raid ? (
              <>
                <div className="grp">
                  <div className="gh">
                    <i style={{ background: "var(--red)" }}></i>
                    <b>Objectives</b>
                    <span>Pick one or more</span>
                  </div>
                  <div className="opts" id="squad-objs">
                    {OBJECTIVES.map((o) => {
                      const enc = ENCD[o.id];
                      const on = state.objectives.has(o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`opt${on ? " on" : ""}`}
                          data-obj={o.id}
                          aria-pressed={on}
                          onClick={() =>
                            dispatch({
                              type: "TOGGLE_OBJECTIVE",
                              objectiveId: o.id,
                            })
                          }
                        >
                          <span className="ck" aria-hidden="true"></span>
                          <span className="ot">
                            <b>{o.name}</b>
                            <span className="say">{o.say}</span>
                            <small>{o.desc}</small>
                            <em>{`Encounter · ${enc.team} vs ${enc.boss}`}</em>
                          </span>
                          <span className="op">incl.</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grp">
                  <div className="gh">
                    <i style={{ background: "var(--ops)" }}></i>
                    <b>Always in your party</b>
                  </div>
                  <div className="lock" style={{ borderStyle: "solid" }}>
                    <span>
                      <b>Nexus</b> runs project management. <b>Hub</b> runs your
                      Context™ workspace and links every unit.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="collapsed">
                <div className="lock" style={{ borderStyle: "solid" }}>
                  <span>
                    <b>Everything in Full Crew, all at once.</b> All four
                    objectives, plus Nexus and Hub.
                  </span>
                </div>
                <div className="incl">
                  {OBJECTIVES.map((o) => (
                    <span key={o.id}>
                      <i>✓</i>
                      {o.name}
                    </span>
                  ))}
                  <span>
                    <i>✓</i>Project management
                  </span>
                  <span>
                    <i>✓</i>Context™ workspace
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`nudge${solo && state.extras.size >= 2 ? " show" : ""}`}
            id="nudge"
          >
            <span>Bigger mission than one hero can carry? Bring a party.</span>
            <button
              type="button"
              data-tier="squad"
              onClick={() => dispatch({ type: "SET_TIER", tier: "squad" })}
            >
              Form a Full Crew
            </button>
          </div>
        </section>

        {/* Step 03: Flagship (visible only in combine/raid) */}
        <section className="step swap" id="st-ship" hidden={!raid}>
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

        {/* Step 04: Raid buffs (visible only in combine/raid) */}
        <section className="step swap" id="st-buffs" hidden={!raid}>
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
                className={`opt${state.buffs.has(b.id) ? " on" : ""}`}
                data-buff={b.id}
                aria-pressed={state.buffs.has(b.id)}
                onClick={() => dispatch({ type: "TOGGLE_BUFF", buffId: b.id })}
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

        {/* Loadout & Blueprint (numbered 05 in raid, 03 in solo/squad) */}
        <section className="step" id="st-load">
          <div className="sh">
            <span className="n">{raid ? "05" : "03"}</span>
            <h2>Loadout</h2>
          </div>
          <p className="hint">
            Itemized, and a ceiling. No hidden microtransactions. We confirm the
            final number after reviewing your materials.
          </p>
          <div className="toggle" id="bill" hidden={solo}>
            <button
              type="button"
              id="b-mo"
              className={state.billing === "mo" ? "on" : ""}
              onClick={() => dispatch({ type: "SET_BILLING", billing: "mo" })}
            >
              Monthly
            </button>
            <button
              type="button"
              id="b-yr"
              className={state.billing === "yr" ? "on" : ""}
              onClick={() => dispatch({ type: "SET_BILLING", billing: "yr" })}
            >
              Annual <em>−10%</em>
            </button>
          </div>
          <div className="bp" id="bp">
            <div className="bl">
              <span className="l">
                <i style={{ background: "var(--fg)" }}></i>
                {baseLineItem}
              </span>
              <span className="n">
                {fmt(q.T.base) + (q.T.one ? "" : "/mo")}
              </span>
            </div>
            <div className="bl mut">
              <span className="l">
                <i style={{ background: "var(--dim)" }}></i>
                {solo
                  ? "Mission included"
                  : raid
                    ? "Objectives, support & flagship included"
                    : "Objectives & support included"}
              </span>
              <span className="n">incl.</span>
            </div>
            {q.lines.map((l) => (
              <div key={l.name} className="bl">
                <span className="l">
                  <i style={{ background: l.c }}></i>
                  {l.name}
                </span>
                <span className="n">
                  {"+" + fmt(l.p) + (q.T.one ? "" : "/mo")}
                </span>
              </div>
            ))}
            {q.disc > 0 && (
              <div className="bl save">
                <span>Annual billing</span>
                <span className="n">−{fmt(q.disc)}/mo</span>
              </div>
            )}
            <div className="bl total">
              <span>Estimated {q.T.one ? "fixed fee" : "monthly"}</span>
              <span className="n">{priceLabel}</span>
            </div>
            {q.T.min && (
              <div className="bl mut">
                <span>{q.T.min}</span>
                <span className="n">{raid ? "flagship incl." : ""}</span>
              </div>
            )}
          </div>
          <button className="fu wide" type="button" data-formup="">
            {q.T.fu}
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
          <span id="chd">{cardHeaderDesc}</span>
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
            {heroName}
          </div>
          <div className="cc" id="cc">
            {cardClassDesc}
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
          <div className="party" id="party">
            {party && (
              <>
                <div className="ph">
                  <span>Party frames</span>
                  <span>
                    {party.total}/{party.total}
                  </span>
                </div>
                {party.frames.map((f) => (
                  <div key={f.id} className="pf">
                    <i style={{ background: f.badgeBg }}>{f.badge}</i>
                    <div>
                      <div className="nm">
                        {f.name}
                        <small>{f.roleName}</small>
                      </div>
                      <div className="bars">
                        <span>
                          <b
                            style={{
                              width: `${f.hp}%`,
                              background: "#4CC58A",
                            }}
                          ></b>
                        </span>
                        <span>
                          <b
                            style={{
                              width: `${f.mp}%`,
                              background: "#5A8FE0",
                            }}
                          ></b>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {party.moreCount > 0 && (
                  <div className="more">
                    +{party.moreCount} more in the party
                  </div>
                )}
              </>
            )}
          </div>
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
