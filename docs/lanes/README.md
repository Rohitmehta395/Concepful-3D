# Parallel Feature Lanes (Concepful 3D)

This directory contains specifications and contract documents for concurrent multi-agent development lanes on Concepful 3D.

## Execution Waves

- **Wave 0**: `p0` (baseline decoupling & contracts), `next` (Next.js security upgrade, merged), `prod` (metadata, error pages, docs, accessibility audit)
- **Wave 1**: `combine` (squad/combine tier UI, buffs, flagship parity), `modal` (lead intake modal, validation & flow), `enc` (encounter stage 3D visuals), `raid` (raid stage 3D flagship visuals), `overlay` (3D overlay HUD elements)
- **Wave 2**: `integrator` (cross-lane merge, request application, final validation)

## Lane Topology & Port Assignments

| Lane         | Branch            | Port | Description                                      |
| :----------- | :---------------- | :--- | :----------------------------------------------- |
| `p0`         | `lane/p0`         | 3100 | Architectural decoupling & contracts baseline    |
| `next`       | `lane/next`       | 3101 | Next.js security upgrade, merged                 |
| `prod`       | `lane/prod`       | 3102 | Metadata, error pages, docs, accessibility audit |
| `combine`    | `lane/combine`    | 3111 | Combine tier UI, buffs, flagship parity          |
| `modal`      | `lane/modal`      | 3112 | Guild lead capture modal validation & flow       |
| `enc`        | `lane/enc`        | 3113 | 3D Encounter stage procedural animation          |
| `raid`       | `lane/raid`       | 3114 | 3D Raid stage flagship visualization             |
| `overlay`    | `lane/overlay`    | 3115 | 3D/DOM canvas post-processing & overlay          |
| `integrator` | `lane/integrator` | 3120 | Lane integration, conflict resolution & merge    |

## Rules of Engagement

1. **Strict File Ownership**: Never modify files outside your lane's ownership table defined in [CONTRACT.md](./CONTRACT.md).
2. **Dedicated clone (git clone, never git worktree)**: Each lane operates in a separate clone at `D:\Projects\Pete\lanes\<LANE>` on its designated port. Free ports only by PID (`taskkill /F /PID`).
3. **No External Regression**: All lanes must preserve passing baseline tests (`tests/reference-parity.test.ts`) and pixel parity protocols.
4. **Requests & Blockers**: If a lane requires changes to a file owned by another lane or core, log the request in `docs/lanes/<LANE>-requests.md` without editing forbidden files.
