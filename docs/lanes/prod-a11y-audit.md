# Accessibility Audit Report (Home Page)

**Audit Date:** 2026-11-26T17:29:55.414Z  
**Target:** Home Page (`/`) on production build (`NEXT_PUBLIC_E2E` unset)  
**Viewports Tested:** `1280x800` and `390x800` (Story Mode `y=0` and App Mode `y=9240`)  
**Method:** Automated Playwright DOM & pixel-median measurements (`run_a11y_audit.mjs`).

---

## 1. Focus Visibility (Playwright `Tab` Traversal)

### 1280x800 — Story Mode (`y=0`)

- **Elements visited:** 12
- **Elements with no visible focus indicator:** 0

| #   | Tag       | ID      | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                      | Visible Indicator |
| :-- | :-------- | :------ | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------- | :---------------- |
| 1   | `<a>`     | `-`     | `body.font-sans > a.sr-only.focus:not-sr-only`              | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 2   | `<a>`     | `-`     | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 3   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | Classes                                                      | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 4   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | How it works                                                 | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 5   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | Plans                                                        | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 6   | `<a>`     | `-`     | `header#top > nav.navl.glass > a.fu`                        | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 7   | `<aside>` | `panel` | `aside#panel`                                               | Server: Concepful · Creative Department as a ServiceAssemble | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 8   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 9   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 10  | `<a>`     | `-`     | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 11  | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 12  | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |

### 1280x800 — App Mode (`y=9240`)

- **Elements visited:** 27
- **Elements with no visible focus indicator:** 0

| #   | Tag        | ID  | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                            | Visible Indicator |
| :-- | :--------- | :-- | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------------- | :---------------- |
| 1   | `<a>`      | `-` | `body.font-sans.app > a.sr-only.focus:not-sr-only`          | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 2   | `<a>`      | `-` | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 3   | `<button>` | `-` | `div#seg > button.on`                                       | Mission SOLO · PROJECT                                       | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 4   | `<button>` | `-` | `div#seg > button`                                          | Full Crew PARTY · ENGAGEMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 5   | `<button>` | `-` | `div#seg > button`                                          | Full Force RAID · DEPARTMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 6   | `<button>` | `-` | `header#top > div.tr.glass > button.fu`                     | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 7   | `<button>` | `-` | `div#tiers > button.tier.on`                                | MISSIONSOLO · PROJECT $4,000 One mission, one hero. Fixed fe | `solid 2px rgb(255, 127, 166)` | `rgb(238, 0, 78) 0px 0px 0px 1px inset` | PASS              |
| 8   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | MOST POPULAR FULL CREW from $7,200/mo                        | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 9   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | FULL FORCE from $9,500/mo                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 10  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt.on`     | Brand identity Logo, system, guidelines. SUMMONS · LASER DOL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 11  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Website or landing page Site, landing page, dashboard or doc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 12  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | UI/UX & product design Flows, screens, clickable prototype.  | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 13  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Pitch or sales deck Investor, sales or keynote deck. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 14  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Campaign & copy Messaging, headlines, campaign copy. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 15  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Motion piece Animation, reel or launch video. SUMMONS · REEL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 16  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | 3D visualization Models, renders, product visuals. SUMMONS · | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 17  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Prototype & fabrication 3D-printed prototype or physical moc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 18  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | AI workflow setup One workflow, built and handed off. SUMMON | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 19  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Custom skin Custom illustration set. ADDS · PAINT JOB +$1,50 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 20  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Companion pet A short animated cut of the work. ADDS · CAMER | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 21  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Haste Priority rush, 12-hour turnaround. ADDS · AFTERBURNERS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 22  | `<button>` | `-` | `section#st-load > button.fu.wide`                          | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 23  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 24  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 25  | `<a>`      | `-` | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 26  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 27  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |

### 390x800 — Story Mode (`y=0`)

- **Elements visited:** 9
- **Elements with no visible focus indicator:** 0

| #   | Tag       | ID      | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                      | Visible Indicator |
| :-- | :-------- | :------ | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------- | :---------------- |
| 1   | `<a>`     | `-`     | `body.font-sans > a.sr-only.focus:not-sr-only`              | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 2   | `<a>`     | `-`     | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 3   | `<a>`     | `-`     | `header#top > nav.navl.glass > a.fu`                        | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 4   | `<aside>` | `panel` | `aside#panel`                                               | Server: Concepful · Creative Department as a ServiceAssemble | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 5   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 6   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 7   | `<a>`     | `-`     | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 8   | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 9   | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |

### 390x800 — App Mode (`y=9240`)

- **Elements visited:** 26
- **Elements with no visible focus indicator:** 0

| #   | Tag        | ID  | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                            | Visible Indicator |
| :-- | :--------- | :-- | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------------- | :---------------- |
| 1   | `<a>`      | `-` | `body.font-sans.app > a.sr-only.focus:not-sr-only`          | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 2   | `<a>`      | `-` | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 3   | `<button>` | `-` | `div#seg > button.on`                                       | Mission SOLO · PROJECT                                       | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 4   | `<button>` | `-` | `div#seg > button`                                          | Full Crew PARTY · ENGAGEMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 5   | `<button>` | `-` | `div#seg > button`                                          | Full Force RAID · DEPARTMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 6   | `<button>` | `-` | `div#tiers > button.tier.on`                                | MISSIONSOLO · PROJECT $4,000 One mission, one hero. Fixed fe | `solid 2px rgb(255, 127, 166)` | `rgb(238, 0, 78) 0px 0px 0px 1px inset` | PASS              |
| 7   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | MOST POPULAR FULL CREW from $7,200/mo                        | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 8   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | FULL FORCE from $9,500/mo                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 9   | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt.on`     | Brand identity Logo, system, guidelines. SUMMONS · LASER DOL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 10  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Website or landing page Site, landing page, dashboard or doc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 11  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | UI/UX & product design Flows, screens, clickable prototype.  | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 12  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Pitch or sales deck Investor, sales or keynote deck. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 13  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Campaign & copy Messaging, headlines, campaign copy. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 14  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Motion piece Animation, reel or launch video. SUMMONS · REEL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 15  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | 3D visualization Models, renders, product visuals. SUMMONS · | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 16  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Prototype & fabrication 3D-printed prototype or physical moc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 17  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | AI workflow setup One workflow, built and handed off. SUMMON | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 18  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Custom skin Custom illustration set. ADDS · PAINT JOB +$1,50 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 19  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Companion pet A short animated cut of the work. ADDS · CAMER | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 20  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Haste Priority rush, 12-hour turnaround. ADDS · AFTERBURNERS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 21  | `<button>` | `-` | `section#st-load > button.fu.wide`                          | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 22  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 23  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 24  | `<a>`      | `-` | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 25  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 26  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |

---

## 2. Text Contrast (Transparent-Text Screenshot Median Background)

All text was made transparent (`color: transparent !important`), each text node's bounding box was screenshotted against the composited page (including WebGL `#gl` and backdrop-filter), the median RGB of the box pixels was computed, and WCAG 2.1 contrast ratio was calculated against the node's real computed `color`. Failures are `< 4.5:1` (`< 3.0:1` for large text: `>= 24px` or `>= 18.66px` bold).

### 1280x800 — Story Mode (`y=0`)

- **Visible text nodes measured:** 81
- **Contrast failures:** 4

| Tag   | ID  | Class | Text             | Font       | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :---- | :-- | :---- | :--------------- | :--------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<a>` | `-` | `fu`  | Start your build | 13px / 600 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Start your build | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Build yours      | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Choose your plan | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 1280x800 — App Mode (`y=9240`)

- **Visible text nodes measured:** 188
- **Contrast failures:** 21

| Tag      | ID  | Class   | Text                                             | Font         | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :------- | :-- | :------ | :----------------------------------------------- | :----------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<span>` | `-` | `n`     | 01                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 41)` | **4.06:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `badge` | Most popular                                     | 9.5px / 400  | `rgb(26, 18, 6)`     | `rgb(21, 22, 44)` | **1.04:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 02                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 41)` | **4.06:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Grid Manta                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(23, 25, 45)` | **3.9:1**  | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pixel Owl                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pitch Hawk                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Broadcast Jelly                                  | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Reel Dragonfly                                   | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Prism Turtle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Forge Beetle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Quad Drone                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Paint job                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(24, 26, 46)` | **3.86:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Camera drone follows                             | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Afterburners                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 03                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 42)` | **4.05:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `l`     | Mission · Laser Dolphin                          | 12.5px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<p>`    | `-` | `fine`  | Prototype: prices illustrative, nothing is sent. | 11.5px / 400 | `rgb(114, 117, 154)` | `rgb(28, 30, 58)` | **3.65:1** | 4.5:1     | FAIL   |
| `<div>`  | `-` | `burst` | up front.                                        | 11px / 400   | `rgb(26, 18, 6)`     | `rgb(28, 31, 59)` | **1.15:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Start your build                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Build yours                                      | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Choose your plan                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 390x800 — Story Mode (`y=0`)

- **Visible text nodes measured:** 65
- **Contrast failures:** 8

| Tag   | ID  | Class | Text             | Font       | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :---- | :-- | :---- | :--------------- | :--------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<a>` | `-` | `fu`  | Start your build | 13px / 600 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Start your build | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 01               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(29, 23, 47)` | **3.9:1**  | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 02               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 22, 42)` | **4.02:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 03               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 04               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Build yours      | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Choose your plan | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 390x800 — App Mode (`y=9240`)

- **Visible text nodes measured:** 156
- **Contrast failures:** 23

| Tag      | ID  | Class   | Text                                             | Font         | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :------- | :-- | :------ | :----------------------------------------------- | :----------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<span>` | `-` | `n`     | 01                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `badge` | Most popular                                     | 9.5px / 400  | `rgb(26, 18, 6)`     | `rgb(21, 22, 43)` | **1.04:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 02                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Grid Manta                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pixel Owl                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pitch Hawk                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Broadcast Jelly                                  | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Reel Dragonfly                                   | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Prism Turtle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Forge Beetle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Quad Drone                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Paint job                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Camera drone follows                             | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Afterburners                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 03                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<p>`    | `-` | `fine`  | Prototype: prices illustrative, nothing is sent. | 11.5px / 400 | `rgb(114, 117, 154)` | `rgb(26, 27, 53)` | **3.77:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Start your build                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 01                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(23, 24, 48)` | **3.92:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 02                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 23, 44)` | **3.99:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 03                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 04                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Build yours                                      | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Choose your plan                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

---

## 3. Reduced Motion (`prefers-reduced-motion`)

### 1280x800 — `document.getAnimations()`

- **`reducedMotion: 'no-preference'` (1 animations):**
  - `swap` on `div#groups` (playState: `finished`)
- **`reducedMotion: 'reduce'` (0 animations):**
  - _(none)_

### 390x800 — `document.getAnimations()`

- **`reducedMotion: 'no-preference'` (1 animations):**
  - `swap` on `div#groups` (playState: `finished`)
- **`reducedMotion: 'reduce'` (0 animations):**
  - _(none)_

### Stylesheet `@media (prefers-reduced-motion)` Rules (6 rules)

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
@media (prefers-reduced-motion: reduce) {
  #gl {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fu,
  .navl a.fu {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  #groups.swap {
    animation-duration: auto;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
    animation-name: none;
    animation-range: normal;
    animation-timeline: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fu,
  .tier,
  .opt {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  #st-ship.swap,
  #st-buffs.swap {
    animation: auto ease 0s 1 normal none running none;
  }
}
```

### Source Hits for `prefers-reduced-motion` (`src/`)

```text
src/components/configurator/ConfiguratorShell.tsx:48:        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:111:  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:114:      ? window.matchMedia("(prefers-reduced-motion: reduce)")
src/engine/createEngine.ts:395:    // Respect prefers-reduced-motion:
src/engine/models/uUnits.ts:1841:          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
src/engine/world/BackgroundManager.ts:177:      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/styles/base.css:15:@media (prefers-reduced-motion: no-preference) {
src/styles/configurator-shell.css:26:@media (prefers-reduced-motion: reduce) {
src/styles/configurator.css:444:@media (prefers-reduced-motion: reduce) {
src/styles/configurator.css:1233:@media (prefers-reduced-motion: reduce) {
src/styles/header.css:158:@media (prefers-reduced-motion: reduce) {
src/styles/scene.css:29:@media (prefers-reduced-motion: reduce) {
```

### Source Hits for `matchMedia` (`src/`)

```text
src/components/configurator/ConfiguratorShell.tsx:48:        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:111:  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:113:    typeof window !== "undefined" && window.matchMedia
src/engine/createEngine.ts:114:      ? window.matchMedia("(prefers-reduced-motion: reduce)")
src/engine/models/uUnits.ts:1840:        (typeof window !== "undefined" && window.matchMedia
src/engine/models/uUnits.ts:1841:          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
src/engine/world/BackgroundManager.ts:176:      window.matchMedia &&
src/engine/world/BackgroundManager.ts:177:      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```
