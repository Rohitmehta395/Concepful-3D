# Accessibility Audit Report (Home Page)

**Audit Date:** 2026-11-23T16:06:42.335Z  
**Target:** Home Page (`/`)  
**Viewports Tested:** Desktop (`1280x800`) and Mobile (`390x800`)  
**Audit Scope:** AUDIT ONLY (no src edits, no fixes applied) per Lane Prod specification.

---

## 1. Landmarks

| Viewport   | Element / Tag | Role      | ID             | Label / Accessible Description                  |
| :--------- | :------------ | :-------- | :------------- | :---------------------------------------------- |
| `1280x800` | `<header>`    | `header`  | `top`          | _(none)_                                        |
| `1280x800` | `<nav>`       | `nav`     | `-`            | "Primary"                                       |
| `1280x800` | `<aside>`     | `aside`   | `panel`        | _(none)_                                        |
| `1280x800` | `<section>`   | `section` | `card`         | "Character sheet"                               |
| `1280x800` | `<main>`      | `main`    | `main`         | _(none)_                                        |
| `1280x800` | `<section>`   | `section` | `intro`        | "YOUR CREATIVE DEPARTMENT, ON DEMAND."          |
| `1280x800` | `<section>`   | `section` | `classes`      | "ONE GOAL: TO PROVIDE A DIFFERENT PERSPECTIVE." |
| `1280x800` | `<section>`   | `section` | `how-it-works` | "FAST ISN'T LUCK. IT'S LOGISTICS."              |
| `1280x800` | `<section>`   | `section` | `rules`        | "THE FINE PRINT, UP FRONT."                     |
| `1280x800` | `<section>`   | `section` | `plans`        | "WHEREVER YOU ARE, WE FIT IN."                  |
| `1280x800` | `<section>`   | `section` | `outro`        | "STOP HIRING. START CREATING."                  |
| `1280x800` | `<section>`   | `section` | `build`        | "Build your department"                         |
| `1280x800` | `<footer>`    | `footer`  | `-`            | _(none)_                                        |
| `1280x800` | `<form>`      | `form`    | `pilot`        | _(none)_                                        |
| `390x800`  | `<header>`    | `header`  | `top`          | _(none)_                                        |
| `390x800`  | `<nav>`       | `nav`     | `-`            | "Primary"                                       |
| `390x800`  | `<aside>`     | `aside`   | `panel`        | _(none)_                                        |
| `390x800`  | `<section>`   | `section` | `card`         | "Character sheet"                               |
| `390x800`  | `<main>`      | `main`    | `main`         | _(none)_                                        |
| `390x800`  | `<section>`   | `section` | `intro`        | "YOUR CREATIVE DEPARTMENT, ON DEMAND."          |
| `390x800`  | `<section>`   | `section` | `classes`      | "ONE GOAL: TO PROVIDE A DIFFERENT PERSPECTIVE." |
| `390x800`  | `<section>`   | `section` | `how-it-works` | "FAST ISN'T LUCK. IT'S LOGISTICS."              |
| `390x800`  | `<section>`   | `section` | `rules`        | "THE FINE PRINT, UP FRONT."                     |
| `390x800`  | `<section>`   | `section` | `plans`        | "WHEREVER YOU ARE, WE FIT IN."                  |
| `390x800`  | `<section>`   | `section` | `outro`        | "STOP HIRING. START CREATING."                  |
| `390x800`  | `<section>`   | `section` | `build`        | "Build your department"                         |
| `390x800`  | `<footer>`    | `footer`  | `-`            | _(none)_                                        |
| `390x800`  | `<form>`      | `form`    | `pilot`        | _(none)_                                        |

---

## 2. Heading Outline

| Viewport   | Tag    | Level | ID                     | Text                                            | Visible |
| :--------- | :----- | :---- | :--------------------- | :---------------------------------------------- | :------ |
| `1280x800` | `<h2>` | H2    | `-`                    | ""                                              | true    |
| `1280x800` | `<h2>` | H2    | `lo-h`                 | ""                                              | true    |
| `1280x800` | `<h2>` | H2    | `-`                    | "Flagship"                                      | false   |
| `1280x800` | `<h2>` | H2    | `-`                    | "Raid buffs"                                    | false   |
| `1280x800` | `<h2>` | H2    | `-`                    | ""                                              | true    |
| `1280x800` | `<h1>` | H1    | `-`                    | "ASSEMBLE YOUR CREATIVE DEPARTMENT."            | true    |
| `1280x800` | `<h1>` | H1    | `hero-heading`         | "YOUR CREATIVE DEPARTMENT, ON DEMAND."          | true    |
| `1280x800` | `<h2>` | H2    | `classes-heading`      | "ONE GOAL: TO PROVIDE A DIFFERENT PERSPECTIVE." | true    |
| `1280x800` | `<h2>` | H2    | `how-it-works-heading` | "FAST ISN'T LUCK. IT'S LOGISTICS."              | true    |
| `1280x800` | `<h2>` | H2    | `rules-heading`        | "THE FINE PRINT, UP FRONT."                     | true    |
| `1280x800` | `<h2>` | H2    | `plans-heading`        | "WHEREVER YOU ARE, WE FIT IN."                  | true    |
| `1280x800` | `<h2>` | H2    | `outro-heading`        | "STOP HIRING. START CREATING."                  | true    |
| `1280x800` | `<h3>` | H3    | `m-h`                  | "Your build is ready."                          | false   |
| `1280x800` | `<h3>` | H3    | `d-h`                  | "Welcome to the server"                         | false   |
| `390x800`  | `<h2>` | H2    | `-`                    | ""                                              | true    |
| `390x800`  | `<h2>` | H2    | `lo-h`                 | ""                                              | true    |
| `390x800`  | `<h2>` | H2    | `-`                    | "Flagship"                                      | false   |
| `390x800`  | `<h2>` | H2    | `-`                    | "Raid buffs"                                    | false   |
| `390x800`  | `<h2>` | H2    | `-`                    | ""                                              | true    |
| `390x800`  | `<h1>` | H1    | `-`                    | "Assemble yourcreative department."             | false   |
| `390x800`  | `<h1>` | H1    | `hero-heading`         | "YOUR CREATIVE DEPARTMENT, ON DEMAND."          | true    |
| `390x800`  | `<h2>` | H2    | `classes-heading`      | "ONE GOAL: TO PROVIDE A DIFFERENT PERSPECTIVE." | true    |
| `390x800`  | `<h2>` | H2    | `how-it-works-heading` | "FAST ISN'T LUCK. IT'S LOGISTICS."              | true    |
| `390x800`  | `<h2>` | H2    | `rules-heading`        | "THE FINE PRINT, UP FRONT."                     | true    |
| `390x800`  | `<h2>` | H2    | `plans-heading`        | "WHEREVER YOU ARE, WE FIT IN."                  | true    |
| `390x800`  | `<h2>` | H2    | `outro-heading`        | "STOP HIRING. START CREATING."                  | true    |
| `390x800`  | `<h3>` | H3    | `m-h`                  | "Your build is ready."                          | false   |
| `390x800`  | `<h3>` | H3    | `d-h`                  | "Welcome to the server"                         | false   |

---

## 3. Images Without Accessible Description

| Viewport   | Element | ID  | Class | Alt / Aria-Label | Accessible |
| :--------- | :------ | :-- | :---- | :--------------- | :--------- |
| `1280x800` | `<img>` | `-` | `-`   | _(missing)_      | false      |
| `390x800`  | `<img>` | `-` | `-`   | _(missing)_      | false      |

---

## 4. Interactive Buttons / Links Without Accessible Name

| Viewport   | Tag        | ID  | Class       | Text / Description | Has Name |
| :--------- | :--------- | :-- | :---------- | :----------------- | :------- |
| `1280x800` | `<button>` | `-` | `tier on`   | ""                 | false    |
| `1280x800` | `<button>` | `-` | `tier mini` | ""                 | false    |
| `1280x800` | `<button>` | `-` | `tier mini` | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt on`    | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `opt`       | ""                 | false    |
| `1280x800` | `<button>` | `-` | `fu wide`   | ""                 | false    |
| `390x800`  | `<button>` | `-` | `tier on`   | ""                 | false    |
| `390x800`  | `<button>` | `-` | `tier mini` | ""                 | false    |
| `390x800`  | `<button>` | `-` | `tier mini` | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt on`    | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `opt`       | ""                 | false    |
| `390x800`  | `<button>` | `-` | `fu wide`   | ""                 | false    |

---

## 5. Form Inputs Without Label

| Viewport   | Tag      | Type | ID  | Label Found                       | Has Label |
| :--------- | :------- | :--- | :-- | :-------------------------------- | :-------- |
| `1280x800` | _(none)_ | -    | -   | All inputs have associated labels | true      |
| `390x800`  | _(none)_ | -    | -   | All inputs have associated labels | true      |

---

## 6. Text Contrast (WCAG 2.1 AA Compliance)

Flagged nodes failing contrast thresholds (< 4.5:1 for normal text, < 3.0:1 for large text):

| Viewport   | Tag   | Parent Class | Font Size / Weight | Foreground         | Background      | Contrast Ratio | Threshold | Status |
| :--------- | :---- | :----------- | :----------------- | :----------------- | :-------------- | :------------- | :-------- | :----- |
| `1280x800` | `<a>` | `fu`         | 13px / 600         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `1280x800` | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `1280x800` | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `1280x800` | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<a>` | `fu`         | 13px / 600         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<i>` | ``           | 18px / 400         | `rgb(238,0,78)`    | `rgb(20,22,39)` | **4.04:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<i>` | ``           | 18px / 400         | `rgb(238,0,78)`    | `rgb(20,22,39)` | **4.04:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<i>` | ``           | 18px / 400         | `rgb(238,0,78)`    | `rgb(20,22,39)` | **4.04:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<i>` | ``           | 18px / 400         | `rgb(238,0,78)`    | `rgb(20,22,39)` | **4.04:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |
| `390x800`  | `<a>` | `fu`         | 14px / 400         | `rgb(255,255,255)` | `rgb(238,0,78)` | **4.43:1**     | 4.5:1     | FAIL   |

---

## 7. Focus Visibility (Sequential Tab Traversal)

Elements with no visible focus style change:

| Viewport   | Tag        | ID  | Text / Selector | Has Visible Focus Change | Details         |
| :--------- | :--------- | :-- | :-------------- | :----------------------- | :-------------- |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `1280x800` | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |
| `390x800`  | `<button>` | `-` | ""              | false                    | No style change |

---

## 8. Behaviour of CSS Animations Under `prefers-reduced-motion`

### Viewport 1280x800

- Detected media query rules matching `prefers-reduced-motion`: **5**

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

@media (prefers-reduced-motion: reduce) {
  #gl { transition: none; }
}

@media (prefers-reduced-motion: reduce) {
  .fu, .navl a.fu { transition: none; }
}

@media (prefers-reduced-motion: reduce) {
  #groups.swap { animation-duration: auto; animation-timing-function: ease; animation-delay: 0s; animation-i

@media (prefers-reduced-motion: reduce) {
  .fu, .tier, .opt { transition: none; }
}
```

### Viewport 390x800

- Detected media query rules matching `prefers-reduced-motion`: **5**

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

@media (prefers-reduced-motion: reduce) {
  #gl { transition: none; }
}

@media (prefers-reduced-motion: reduce) {
  .fu, .navl a.fu { transition: none; }
}

@media (prefers-reduced-motion: reduce) {
  #groups.swap { animation-duration: auto; animation-timing-function: ease; animation-delay: 0s; animation-i

@media (prefers-reduced-motion: reduce) {
  .fu, .tier, .opt { transition: none; }
}
```
