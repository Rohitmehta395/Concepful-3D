import { BUFFS, GEAR, QUESTS, TIERS } from "@/content";

/**
 * ConfiguratorShell Component (Phase 6.1b)
 *
 * Renders the static default-state DOM shell for tier=solo:
 * - #panel with steps 01 (mode), 02 (pick mission/gear), 03 (flagship, hidden), 04 (buffs, hidden), 03 (loadout/blueprint)
 * - #card with hero Laser Dolphin character sheet and initial stats
 * - #boxart with title, server lead, and burst badge
 *
 * Rendered as React Server Components using static domain data from src/content.
 */
export function ConfiguratorShell() {
  const soloTier = TIERS.solo;
  const squadTier = TIERS.squad;
  const combineTier = TIERS.combine;
  const defaultQuest = QUESTS[0] ?? {
    id: "brand",
    name: "Brand identity",
    desc: "Logo, system, guidelines.",
    hero: "Laser Dolphin",
    cls: "Striker",
    p: 0,
  };

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
            <button
              type="button"
              className="tier on"
              data-tier="solo"
              aria-pressed="true"
            >
              <span>
                <span className="t">{soloTier.name}</span>
                <span className="k">{soloTier.sub}</span>
              </span>
              <span className="p">
                ${soloTier.base.toLocaleString("en-US")}
                <small></small>
              </span>
              <span className="d">{soloTier.d}</span>
            </button>
            <button
              type="button"
              className="tier mini"
              data-tier="squad"
              aria-pressed="false"
            >
              <span className="badge">Most popular</span>
              <span>
                <span className="t">{squadTier.name}</span>
                <span className="k">{squadTier.sub}</span>
              </span>
              <span className="p">
                from ${squadTier.base.toLocaleString("en-US")}
                <small>/mo</small>
              </span>
              <span className="d">{squadTier.d}</span>
            </button>
            <button
              type="button"
              className="tier mini"
              data-tier="combine"
              aria-pressed="false"
            >
              <span>
                <span className="t">{combineTier.name}</span>
                <span className="k">{combineTier.sub}</span>
              </span>
              <span className="p">
                from ${combineTier.base.toLocaleString("en-US")}
                <small>/mo</small>
              </span>
              <span className="d">{combineTier.d}</span>
            </button>
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
                {QUESTS.map((q) => {
                  const isDefault = q.id === "brand";
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`opt${isDefault ? " on" : ""}`}
                      data-mission={q.id}
                      aria-pressed={isDefault ? "true" : "false"}
                    >
                      <span className="ck" aria-hidden="true"></span>
                      <span className="ot">
                        <b>{q.name}</b>
                        <small>{q.desc}</small>
                        <em>
                          Summons · {q.hero}{" "}
                          <span className="dom">{q.cls.toUpperCase()}</span>
                        </em>
                      </span>
                      <span className="op">
                        {q.p ? `+$${q.p.toLocaleString("en-US")}` : "incl."}
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
                {GEAR.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="opt"
                    data-extra={e.id}
                    aria-pressed="false"
                  >
                    <span className="ck" aria-hidden="true"></span>
                    <span className="ot">
                      <b>{e.name}</b>
                      <small>{e.desc}</small>
                      <em>Adds · {e.fx}</em>
                    </span>
                    <span className="op">+${e.p.toLocaleString("en-US")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="nudge" id="nudge">
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
                <i style={{ background: "var(--fg)" }}></i>Mission ·{" "}
                {defaultQuest.hero}
              </span>
              <span className="n">
                ${soloTier.base.toLocaleString("en-US")}
              </span>
            </div>
            <div className="bl mut">
              <span className="l">
                <i style={{ background: "var(--dim)" }}></i>Mission included
              </span>
              <span className="n">incl.</span>
            </div>
            <div className="bl total">
              <span>Estimated fixed fee</span>
              <span className="n">
                ${soloTier.base.toLocaleString("en-US")}
              </span>
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
          <span id="cid">LV 12</span>
        </div>
        <div className="bd">
          <canvas
            id="patch"
            aria-hidden="true"
            height="132"
            width="132"
          ></canvas>
          <div className="cn" id="cn">
            {defaultQuest.hero}
          </div>
          <div className="cc" id="cc">
            Class: {defaultQuest.cls} · {defaultQuest.name}
          </div>
          <div className="stats" id="stats">
            <div className="stat">
              <span title="Strategy">INT · Strategy</span>
              <span className="bar">
                <i className="on"></i>
                <i className="on"></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
              </span>
              <b>2</b>
            </div>
            <div className="stat">
              <span title="Design">DEX · Design</span>
              <span className="bar">
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
              </span>
              <b>7</b>
            </div>
            <div className="stat">
              <span title="Production">STR · Production</span>
              <span className="bar">
                <i className="on"></i>
                <i className="on"></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
              </span>
              <b>2</b>
            </div>
            <div className="stat">
              <span title="Operations">STA · Operations</span>
              <span className="bar">
                <i className="on"></i>
                <i className="on"></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
              </span>
              <b>2</b>
            </div>
            <div className="stat">
              <span title="Speed">SPD · Speed</span>
              <span className="bar">
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className="on"></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
                <i className=""></i>
              </span>
              <b>6</b>
            </div>
          </div>
          <div className="party" id="party"></div>
          <div className="motto">
            <span>Motto</span>
            <q id="motto">{soloTier.motto}</q>
          </div>
        </div>
      </section>

      {/* Boxart Visual Title & Badge */}
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
