You are a senior full-stack technical auditor and product analyst.

I have just inherited this project and I do not understand its structure yet. It appears to be a web project connected to a headless WordPress backend, but you must verify everything from the codebase itself.

Your task is to inspect the entire repository carefully and create two Markdown files in the project root:

1. `checkpoint.md`
2. `PRD.md`
3. `ARCHITECTURE.md`

Document:

- Complete system architecture
- Frontend architecture
- WordPress architecture
- API architecture
- Data flow diagrams (Mermaid)
- Folder ownership
- Component hierarchy
- Route hierarchy
- Technical debt
- Refactoring opportunities
- Suggested future architecture

Assume the next developer has never seen this project before.

Important rules:

* Do not delete, rename, move, or modify any existing project files.
* Only create or update `checkpoint.md`, `PRD.md`, and `ARCHITECTURE.md`.
* Do not expose or print secrets from `.env`, config files, API keys, tokens, passwords, private URLs, or credentials.
* If you find sensitive values, mention only the variable/key names and where they are used, without revealing values.
* Base your conclusions only on actual files, imports, configs, package scripts, API calls, routes, components, and code references.
* If something is unclear, mark it as `Unknown` or `Needs confirmation`.
* Do not assume the stack. Detect it from the repository.

First, perform a full project discovery:

* Detect the tech stack:

  * Framework: Next.js, React, Vue, Nuxt, Astro, Laravel, plain PHP, etc.
  * Runtime/package manager: npm, pnpm, yarn, bun, composer, etc.
  * Styling: Tailwind, SCSS, CSS Modules, styled-components, etc.
  * CMS/API layer: WordPress REST API, WPGraphQL, custom API, direct PHP, etc.
  * State management, form libraries, auth libraries, analytics, SEO tools, build tools.
* Read package/config files:

  * `package.json`
  * lock files
  * `next.config.*`, `vite.config.*`, `astro.config.*`, `nuxt.config.*`
  * `tsconfig.json`, `jsconfig.json`
  * `tailwind.config.*`
  * `.env.example`
  * deployment configs
  * Docker files
  * CI/CD files
  * WordPress/PHP/composer files if found
* Map the folder structure.
* Identify active source folders and dead/legacy folders.
* Identify routes/pages/templates.
* Identify reusable components.
* Identify API clients and WordPress integration points.
* Identify custom post types, taxonomies, menus, media handling, preview mode, revalidation, caching, SEO/meta handling if present.
* Identify build/deployment scripts.
* Identify code quality problems, broken imports, duplicate files, unused files, inconsistent patterns, missing environment variables, security risks, performance risks, SEO risks, and maintainability issues.
* If possible, run safe read-only commands such as:

  * list files
  * inspect scripts
  * dependency analysis
  * typecheck/lint/build only if available and safe
* Do not run destructive commands.
* Do not install packages unless absolutely necessary and only if the environment already supports it.
* If commands fail, document the exact command and the failure summary.

Now create `checkpoint.md` with this structure:

# Project Checkpoint

## 1. Executive Summary

Short summary of what this project appears to be, current condition, and confidence level.

## 2. Detected Tech Stack

Table:

* Area
* Detected Technology
* Evidence/File
* Confidence

## 3. Repository Structure

Explain the main folders and what each one does.

## 4. Active Files & Folders

List files/folders that appear actively used and why.

## 5. Unused / Legacy / Suspicious Files & Folders

List files/folders that may be unused, duplicated, outdated, experimental, or safe-to-review.
Do not say “delete” unless there is strong evidence.
Use labels:

* Keep
* Review
* Probably Remove
* Do Not Touch Yet

## 6. WordPress / Headless CMS Integration

Explain:

* API type: REST, GraphQL, unknown
* API endpoints found
* Content types used
* Taxonomies/categories/tags
* Media/image handling
* Menus/navigation
* SEO/meta data
* Preview/draft support
* Authentication if any
* Environment variables needed

## 7. Routing / Pages Map

Table:

* Route/Page
* Source File
* Purpose
* Data Source
* Status

## 8. Components Map

Group major components by feature/layout/shared/ui.

## 9. Data Flow

Explain how data moves from WordPress/API to frontend pages/components.

## 10. Environment Variables

List variable names only, never values.
Table:

* Variable Name
* Used In
* Purpose
* Required?
* Notes

## 11. Build, Run & Deploy

Document:

* Available scripts
* Local run command
* Build command
* Deployment hints
* Known blockers

## 12. Current Problems

Group by:

* Critical
* High
* Medium
* Low

For each issue include:

* Problem
* Evidence
* Impact
* Suggested fix

## 13. Security / Secrets Review

Mention exposed risks without revealing secrets.

## 14. Performance / SEO Review

Current status, risks, and quick wins.

## 15. Recommended Cleanup Plan

Phased plan:

* Phase 1: Safe documentation and verification
* Phase 2: Fix broken setup/build
* Phase 3: Remove confirmed dead code
* Phase 4: Refactor and improve architecture

## 16. Handover Notes

What the next developer needs to know immediately.

## 17. Unknowns / Questions

List missing information that needs confirmation from the previous developer/client.

Now create `PRD.md` with this structure:

# Product Requirements Document

## 1. Product Overview

Infer what the product/website is from the codebase. If unclear, state assumptions.

## 2. Goals

Product goals based on the current implementation.

## 3. Target Users

Infer likely user personas from routes/content/features.

## 4. Core Features

List current and expected features.

## 5. Content Model

Document WordPress-driven content:

* Post types
* Taxonomies
* Pages
* Menus
* Media
* SEO fields
* Custom fields/ACF if detected

## 6. User Journeys

Describe main journeys, for example:

* Visitor browses homepage
* Visitor opens blog/article
* Visitor browses category/service/product
* Visitor submits form/contact
* Admin updates content in WordPress

## 7. Functional Requirements

Use IDs:

* FR-001
* FR-002
  Each requirement should include:
* Requirement
* Source/Evidence
* Priority
* Status

## 8. Non-Functional Requirements

Include:

* Performance
* SEO
* Accessibility
* Security
* Responsiveness
* Maintainability
* Analytics
* Localization if detected

## 9. Pages / Sitemap

Map all discovered routes/pages.

## 10. Integrations

List:

* WordPress
* Analytics/GTM
* Forms
* Email
* Payment
* Search
* Maps
* Any third-party APIs

## 11. Analytics & Tracking

Document detected events, pixels, GTM, GA, Meta Pixel, etc.

## 12. SEO Requirements

Document metadata, sitemap, robots, schema, OG images, canonical URLs, redirects.

## 13. Admin / CMS Requirements

What the WordPress admin must support for content editing.

## 14. Technical Architecture

Explain frontend, backend/CMS, API layer, rendering mode, caching, hosting/deployment.

## 15. Risks & Open Questions

Product and technical risks.

## 16. Roadmap

Suggested roadmap:

* Immediate
* Short-term
* Medium-term
* Long-term

## 17. Acceptance Criteria

Clear criteria for saying the project is ready for continued development.

Final output:

* Create/update `checkpoint.md`
* Create/update `PRD.md`
* At the end, summarize briefly what you created and list the most critical findings.
