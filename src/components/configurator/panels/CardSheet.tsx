"use client";

import { TIERS } from "@/content";
import { useConfigurator } from "../ConfiguratorProvider";

export function CardSheet() {
  const {
    state,
    level,
    stats,
    heroName,
    cardHeaderDesc,
    cardClassDesc,
    party,
  } = useConfigurator();

  return (
    <section className="card glass" id="card" aria-label="Character sheet">
      <div className="hd">
        <span id="chd">{cardHeaderDesc}</span>
        <span id="cid">LV {level}</span>
      </div>
      <div className="bd">
        <canvas id="patch" aria-hidden="true" height="132" width="132"></canvas>
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
                <div className="more">+{party.moreCount} more in the party</div>
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
  );
}
