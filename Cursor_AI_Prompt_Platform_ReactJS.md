# Cursor Master Prompt — React AI Prompt Discovery and Creation Platform

Prepared: 31 October 2026

Reference: https://promptpin.in/
Reference detail page reviewed: https://promptpin.in/cinematic/aesthetic-cafe-photo-prompt-for-girls/

## How to use this file

1. Open your project folder in Cursor and select Agent mode.
2. Paste the MASTER PROMPT below, or put this file in the project root and ask: "Read Cursor_AI_Prompt_Platform_ReactJS.md and implement its master prompt, starting with Phase 1."
3. Let Cursor finish and verify each phase before moving to the next. Keep the visual design consistent across phases.
4. Replace the working brand name, supply your own preview assets, and add API credentials when ready. The first phase must run without paid AI credentials.

The reference review found a dark purple interface, compact header, category tabs, search, a masonry image gallery, pinned/template badges, pagination, and prompt detail pages with a preview, copy button, instructions, and related content. The reviewed detail page primarily guides users to copy a prompt and use it in another AI tool. The integrated generation studio below is an added product requirement, not a claim about the reference site's implementation.

---

# MASTER PROMPT — START

Act as a senior React engineer, product designer, and full-stack developer. Build a polished, mobile-first AI prompt platform using React.js. Implement the application with working code, original content, a coherent design system, and meaningful interactions.

Working brand: Promptora. Make the brand, logo, colors, domain, and social links centrally configurable. This is a placeholder name, not a statement of domain or trademark availability.

## 1. Product vision and reference fidelity

Use https://promptpin.in/ as the visual and interaction reference. Review its homepage, gallery, categories, and at least one prompt detail page if browsing is available. Inspect desktop and mobile if your tools support both. If browsing is unavailable, use the reference notes in this brief and state that limitation.

Closely reproduce the reference's core composition and browsing rhythm:
- Deep dark background with charcoal-purple surfaces.
- Purple active states and clear white typography.
- Compact navigation followed by category chips and search.
- A dense, image-first masonry gallery with rounded cards.
- Mixed portrait, square, and landscape preview shapes.
- Small badges over previews.
- A clear prompt detail experience built around the preview and copy action.
- Category and collection landing pages and related prompts.

Create original branding, original prompts, original explanatory text, and owned or properly licensed media. Match the reference's visual structure while giving this product a more polished mobile interface.

Visitors should reach useful prompts immediately. Avoid a tall marketing hero that pushes the gallery below the fold. Use a short headline such as "Find a look. Make it yours." and one sentence explaining the product.

The core journey is:
Discover an example → view its prompt → customize fields → copy it into an external AI tool OR generate inside this app through a configured API → save or download the result.

Support three content areas:
1. Image prompts: portraits, festival looks, cinematic photography, products, fashion, interiors, thumbnails, and illustrations.
2. Video prompts: short-form clips, image-to-video motion, product reveals, history scenes, explainers, and camera movements.
3. Work prompts: writing, study, coding, marketing, presentations, and everyday productivity.

The site should feel like a visual discovery product, rather than a generic corporate AI dashboard.

## 2. Implementation stack and project constraints

Frontend:
- React.js with Vite, JavaScript, and JSX. Do not silently replace React/Vite with Next.js.
- React Router for URL-based pages and navigation.
- Tailwind CSS with CSS variables for design tokens.
- Accessible Radix-based components or compatible shadcn-style components.
- Lucide icons.
- Motion for lightweight transitions, respecting reduced-motion settings.
- TanStack Query for remote data.
- Zustand only for small pieces of shared interface state where useful.
- React Hook Form and Zod for meaningful form validation.

Backend, introduced after the frontend is approved by functional checks:
- Node.js and Express.
- MySQL with Prisma, using versions compatible with the actual environment.
- Object storage for uploads and generated files.
- A worker queue for long-running generation; Redis/BullMQ is an acceptable default.
- Server-side provider adapters so the UI is independent of one AI vendor.

Check the repository and its instructions before changing files. Preserve existing useful work. If starting from an empty folder, create a clean client/server structure with sensible shared validation contracts. Use current stable, mutually compatible package versions and official documentation. Do not invent package APIs.

Phase 1 must start with one documented development command and no external API credentials. Use a repository abstraction so sample data can be replaced by the backend without rewriting UI components.

## 3. Design system

Default appearance:
- Page background: approximately #101018.
- Raised surfaces: approximately #1B1928.
- Secondary surfaces: approximately #242137.
- Accent: violet around #8B5CF6.
- Secondary accent: a restrained pink around #EC4899.
- Main text: near #F5F3FF.
- Muted text: a contrast-checked lavender-gray.
- Borders: subtle translucent purple-gray.
- Card radius: 16–20px; button radius: 10–14px; chips: fully rounded.
- Use a readable modern sans-serif font; bundle or load it efficiently.
- Use a consistent spacing scale and a clearly defined type scale.

Verify text and control contrast. Use subtle gradients only for emphasis, such as the main create button. Avoid excessive glow, continuous animation, and translucent text over busy media.

Provide light mode as a complete alternative and persist the preference, initially respecting the system setting. Include polished focus, disabled, loading, empty, hover, pressed, error, and success states.

Desktop content should use the available width with an approximate 1440px maximum. Add a compact footer with categories, collections, help, and legal links.

## 4. Mobile-first layout — highest priority

Build the mobile layout intentionally, starting at 360px width.

Mobile:
- Compact sticky header, approximately 56–64px tall, with logo, search access, and profile/menu.
- A short title followed by a full-width search field.
- Horizontally scrollable content-type and category chips.
- A two-column masonry gallery with approximately 10px gaps and 12–16px side padding.
- A one-column option for users who prefer larger previews; use a single column on extremely narrow screens.
- Fixed bottom navigation: Explore, Categories, Create, Saved, Profile.
- Visually emphasize Create without obscuring other navigation items.
- Reserve enough content padding for bottom navigation and safe-area insets.
- Use touch targets of at least 44px; important inputs should use at least 16px text.
- No interaction may rely on hover.
- Use accessible bottom sheets for filters, collections, and compact settings.
- Prompt details are full-screen on mobile, with an appropriately sized preview and a sticky bottom action area for Copy and Customize/Create.
- If the keyboard opens, keep the focused input and relevant controls reachable.
- Preserve scroll position when returning from details to the feed.
- Keep scrollable chips from causing page-wide horizontal overflow.

Desktop:
- Header navigation and a prominent search field.
- Responsive 3–5-column gallery depending on width and available card size.
- Prompt detail route with a two-column preview/editor arrangement.
- Studio controls and result previews side by side when space permits.
- Use an optional desktop detail overlay only if the canonical detail URL remains directly accessible.

Use progressive enhancement for swipe-to-dismiss; always include visible close buttons and working browser back navigation. Do not allow sticky elements to overlap the footer, actions, text, or mobile safe areas.

## 5. Public pages and routes

Implement:
- / — Explore.
- /images — Image prompt feed.
- /videos — Video prompt feed.
- /work — Work prompt feed.
- /trending — Measured or manually curated trends, clearly distinguished.
- /categories — Category directory.
- /category/:slug — Category feed.
- /collections — Editorial collections.
- /collection/:slug — Collection detail.
- /prompt/:slug — Canonical prompt detail.
- /search?q=... — Search results with shareable filter state.
- /create — Creation studio, optionally prefilled from a prompt.
- /saved — Bookmarks and user collections.
- /history — User's generated results.
- /profile — Account settings.
- /login and /register.
- /submit — Submit a prompt for review.
- /admin and its content management subroutes.
- /about, /contact, /privacy, and /terms.
- A useful 404 route.

Keep gallery state in query parameters where appropriate: content type, category, tool, aspect ratio, sort, and search query. Refreshing or sharing a filtered URL should preserve the result. Search results and filters should work together, with clear active-filter chips and Reset.

## 6. Explore, search, and gallery behavior

Homepage order:
1. Compact header.
2. One-line headline and short explanation.
3. Search.
4. Images / Videos / Work tabs.
5. Category chips.
6. A compact curated collection strip.
7. Prompt gallery and sort/filter controls.

Make every visible control functional:
- Debounced search across title, tags, category, and prompt text.
- Search suggestions with keyboard support, recent searches, and a Clear option.
- A filter sheet with category, supported tool, aspect ratio, reference-image requirement, and sort.
- Sort options such as Curated, Newest, Most copied, and Most saved.
- A clear result count and helpful empty state with Reset filters.
- Load-more or cursor pagination; preserve the route and loaded position on return.
- Skeletons on initial load and inline loading states for later pages.

Cards:
- Media preview with actual width/height or aspect-ratio metadata.
- Image/Video/Work type indicator.
- Optional New, Featured, or Curated badge.
- Concise title that remains readable on mobile.
- Category and supported-tool metadata.
- Visible Save and Quick Copy actions with accessible labels.
- Card open action must not be triggered by nested action buttons.
- Saved state and copy feedback must update immediately.
- Hover preview for video on desktop and explicit tap-to-play on mobile.
- Only play media when visible, with muted playback, a poster, controls where needed, and reduced-motion handling.
- Never autoplay all feed videos simultaneously.

Build masonry with stable ordering and keyboard access. Use a robust grid or measured implementation that preserves logical reading order. Do not create a visual column order that makes keyboard focus jump unpredictably.

## 7. Prompt detail and customization

Include:
- Breadcrumbs and a clear Back control.
- Large image, video, or work-output preview.
- Title, description, category, tags, and supported tools.
- Reference-image requirement and aspect ratio.
- Full readable prompt, with Expand/Collapse for long content.
- Optional negative prompt, shown only when relevant to the chosen workflow.
- Copy prompt, Save, Share, and Customize/Create actions.
- Tool-specific usage steps written in plain language.
- Related prompts based on type/category/tags.
- A report-content action and source/asset attribution when applicable.

Add editable variable fields when the template contains placeholders:
    {{subject}}, {{outfit}}, {{location}}, {{lighting}}, {{style}},
    {{aspect_ratio}}, {{language}}, {{duration}}, {{camera_motion}}

Define variable types, labels, defaults, allowed values, validation, and optional help text. Only show fields actually used by that template. Render a live final-prompt preview. The copied and submitted text must be the resolved prompt, with validation that required placeholders are filled.

Support:
- Reset to defaults.
- Copy final prompt with reliable success/error feedback and a manual-copy fallback.
- Native Web Share where supported, otherwise Copy link.
- A useful aspect-ratio preview.
- A before/after slider only for items with a genuine paired source/result.
- Instructions in English and Hindi. Changing instruction language must not silently modify the actual prompt language.

For external AI tools, provide "Copy prompt" and "Open [tool]" as explicit separate actions. Open only configured official destinations. Do not claim a prompt or image was transferred automatically when it was only copied.

## 8. Creation studio and honest generation behavior

Clearly separate:
A. Copy and use externally.
B. Generate inside this app using an available provider.

Studio modes:
- Text to image.
- Image to image/reference-based image, if supported.
- Text to video.
- Image to video, if supported.
- Work/text output, if a text provider is configured.

Inputs:
- Editable prompt and optional template fields.
- Provider/model selector from a capability registry.
- Reference-image upload with preview, replace, remove, progress, and validation.
- Aspect ratio.
- Output size/quality and image count where supported.
- Video duration and other video controls only when supported.
- Optional advanced controls, hidden by default.

Use a capability registry for every provider/model: supported tasks, upload requirements, allowed ratios, sizes, durations, parameter ranges, asynchronous behavior, and availability. Do not display controls that the selected adapter cannot support.

Actual model IDs, endpoints, capabilities, costs, and access must be verified against the provider's current official documentation when implementing live integration. A consumer subscription in an external AI app does not automatically provide API access.

Generation state:
idle → validating → queued → processing → succeeded / failed / cancelled, with cancellation shown only when actually supported.

Show:
- Clear queued and processing text.
- Honest progress states rather than invented percentages.
- Errors with actionable retry messages.
- Output gallery with view, download, regenerate, reuse prompt, and save.
- Prompt, settings, and creation time stored with each job.
- Credit or cost estimate only when backed by configured pricing.

DEMO MODE:
- Must work without API keys.
- Display a clear Demo mode label.
- Use preloaded sample outputs marked as sample previews.
- If a simulated job is used, identify it as a demo simulation and do not imply the sample was generated from the user's prompt.
- Do not simulate provider billing, fake payments, or real account authentication.
- Let users explore customization, copying, saving, and the studio layout.
- Do not invent current API limits or provider prices.

LIVE MODE:
- Call providers only from the backend.
- Never place provider secrets in frontend source, localStorage, client logs, or VITE_-prefixed environment variables.
- Validate requests server-side and require an account for paid generation.
- Rate-limit and cap request size, output count, and concurrent jobs.
- Use idempotency to prevent duplicate jobs on repeated taps.
- If implementing credits, use an authoritative transactional ledger with reserve/settle/release behavior and idempotent failure refunds.
- Poll the local job API with backoff or use authenticated server events.
- Verify provider webhooks before processing, if webhooks are used.
- Reconcile callbacks and polling so each result and charge is applied once.
- Do not call a provider from the frontend or depend on a consumer website's undocumented endpoints.

Implement one documented image adapter first. Keep additional providers and video adapters explicitly unconfigured until verified and connected. The video UI and demo workflow should still be complete. List any live functionality that remains dependent on credentials.

## 9. Saved items, accounts, history, and collections

Anonymous visitors can browse, copy, and save bookmarks locally without signing in. Make it clear that these saves are on the current device.

After real authentication:
- Sync saved prompts and user collections with the server.
- Merge guest saves by prompt ID without duplicates.
- Let users create, rename, and delete their own collections.
- Add or remove prompts from collections.
- Show generation history, status, outputs, and reuse actions.
- Allow account display-name and avatar changes.
- Provide data deletion controls appropriate to the implemented backend.

Use localStorage only for small preferences, guest bookmark IDs, and harmless local interface state. Do not use it as the production database for published content, users, API keys, paid credits, uploaded images, or generation history.

Implement a clear auth adapter so demo identity cannot be mistaken for production authentication. In live mode, use secure server-managed sessions with HttpOnly cookies, appropriate SameSite/Secure settings, CSRF protections for state-changing requests, and server-enforced authorization.

## 10. Dynamic data and content management

Treat the CMS/API as the source of truth in live mode. The initial seed dataset is for development and demo.

Prompt record:
- id, slug, title, shortDescription.
- contentType: image / video / work.
- categoryId, tags, language.
- promptTemplate and optional negativePrompt.
- variables with schema and defaults.
- preview media: URL, alt text, width, height, format, optional poster/duration.
- optional paired source/result assets.
- supportedTools and task capabilities.
- requiresReferenceImage, supportedAspectRatios.
- usage steps and tips.
- authorId and source/asset license metadata.
- status: draft / pending / scheduled / published / rejected / archived.
- publishedAt, updatedAt, featured state.
- real aggregated views, copies, and saves, when measured.

Also model:
User, Session, Role, Category, Tag, Prompt, PromptVariable, MediaAsset,
EditorialCollection, CollectionItem, Bookmark, UserCollection,
UserCollectionItem, Submission, Report, GenerationJob, GenerationOutput,
ProviderConfiguration, AnalyticsEvent, SiteSetting, and AdminAuditLog.
Add a credit ledger only if credit-based billing is actually implemented.

Use relational constraints, unique slugs, appropriate indexes, ownership checks, and migrations. Private uploads and generated results must remain private by default. Store secrets outside content tables and redact them in logs and admin screens.

Suggested API resources:
- GET /api/prompts
- GET /api/prompts/:slug
- GET /api/categories
- GET /api/collections and /api/collections/:slug
- GET /api/search/suggestions
- POST /api/events with abuse controls
- Bookmark and user-collection CRUD
- GET /api/providers/capabilities
- POST /api/uploads
- POST /api/generation-jobs
- GET /api/generation-jobs/:id
- GET /api/me/history
- Auth/session endpoints
- Role-protected admin CRUD and moderation endpoints

Return consistent validation errors and pagination metadata. Paginate database queries. Validate filters and sort names on the server.

## 11. Admin dashboard

Implement a responsive, server-authorized admin area:
- Prompt list with search, type/category/status filters, and pagination.
- Add/edit/preview/publish/archive prompts.
- Variable-field editor with immediate final-prompt preview.
- Preview-image upload and optional video-poster upload.
- Category/tag and editorial-collection management.
- Draft, review, scheduled publication, and rejection workflows.
- Submission and report moderation.
- Featured placement and curated collection ordering.
- Provider availability display, without exposing secrets.
- Basic metrics from real events: views, copies, saves, and generation outcomes.
- Site settings: branding, contact address, navigation, and social links.
- Audit records for meaningful administrative changes.

An admin page hidden by frontend routing is not secure. Enforce roles in every backend admin endpoint. A production deployment must not seed a known default admin password. Document a controlled bootstrap command.

Scheduled publishing requires an actual server scheduler/worker, not a timer in an open browser tab.

For Phase 1, admin editing may use a clearly labeled demo repository. Document that demo edits are local and non-production.

## 12. Initial content and media

Provide 60 distinct, usable, original prompts:
- 36 image prompts.
- 12 video prompts.
- 12 work prompts.

Image coverage:
- Indian festive portraits and couples.
- Cinematic, street, café, and retro photography.
- Professional headshots.
- Product photography and home interiors.
- Social thumbnails and editorial illustrations.

Video coverage:
- Portrait motion.
- Product reveal.
- Ancient/history storytelling.
- Food close-up.
- Cinematic travel.
- Simple explainer or camera-movement ideas.

Work coverage:
- YouTube script outline.
- Study timetable.
- Banking-exam revision.
- Interview preparation.
- Blog outline.
- Social content planning.
- Professional email.
- Coding explanation.
- Presentation outline.
- Product description.
- Spreadsheet-formula assistance.
- Meeting summary.

At least 12 examples should demonstrate detailed structured prompting and useful editable variables. Every remaining record must still contain a complete, meaningful prompt and appropriate usage steps.

Do not describe these samples as today's verified viral trends. Use "Curated inspiration" unless live measurement exists. Keep seed engagement counts at zero or label them as demo metrics. Do not invent testimonials, creators, customer totals, or popularity claims.

Media quality matters:
- Use relevant owned, generated, or properly licensed assets with recorded attribution.
- Use stable local assets when available.
- Do not hotlink the reference site's media.
- Do not show the same placeholder portrait across dozens of unrelated cards.
- If exact-match output previews are unavailable, clearly label representative images as illustrative previews.
- Work cards can use locally created typographic output previews.
- A missing asset must show an attractive, useful fallback.

## 13. Trends, analytics, and search quality

Separate editorial curation from observed popularity:
- Editorial: admin-selected featured prompts and collections.
- Popularity: calculated from real eligible events over a stated time window.
- Freshness: based on actual publication time.

Start with a simple explainable ranking based on unique copies/saves, recency, and optional editorial placement. Deduplicate easy repeated events, apply sensible caps, and never let unrestricted client-submitted counts control ranking directly.

Collect only necessary analytics. Avoid logging reference photos, full private prompts, secrets, or personal data. Provide consent controls where required by the chosen analytics setup.

Support typo-tolerant or fuzzy search in the demo dataset. For live MySQL, begin with indexed full-text search and compatible filters; make any limitations explicit rather than promising a search engine that has not been implemented.

## 14. Performance and accessibility

- Build for mobile networks and mid-range Android phones.
- Use responsive image sources, modern formats, correct dimensions, and image fallback.
- Load above-the-fold media deliberately; lazy-load below-the-fold content.
- Avoid layout shift.
- Use posters and metadata-only loading for feed videos.
- Code-split routes and expensive studio/admin modules.
- Keep gallery interactions responsive with at least 500 records.
- Avoid expensive whole-page animations and large unnecessary dependencies.
- Provide semantic headings, button labels, alt text, keyboard access, and visible focus.
- Dialogs and sheets must trap focus, close with Escape, and restore focus appropriately.
- Respect reduced motion and avoid flashing effects.
- Provide readable error messages and status announcements.
- Verify touch behavior and content overflow across viewport sizes.

Aim for strong Core Web Vitals and a Lighthouse performance score around 90+ on representative public pages. Report measured results with test conditions; do not claim a score you did not measure.

## 15. SEO and public publishing

Use human-readable slugs, descriptive titles, meta descriptions, canonical URLs, and share previews.

For public prompt/category/collection routes, implement real build-time prerendering or a compatible React SSR strategy so a direct HTTP response contains meaningful page content and route metadata. A client-only title update is insufficient for dependable social previews. Keep the React.js requirement.

If full prerendering requires the later backend/content pipeline, describe the gap explicitly and implement it before calling the site public-launch ready. Exclude private pages from caching/prerendering.

Generate sitemap.xml from actual published canonical content and provide robots.txt. Ensure direct route refresh works with hosting rewrites. Avoid indexing internal search, duplicate filter combinations, drafts, admin, saved items, profiles, and generation histories.

Use structured data only for applicable content and actual visible facts. Do not invent reviews, ratings, or unsupported rich-result promises. Provide helpful category text and original usage instructions rather than automatically creating thin pages.

## 16. Uploads, authorization, and content handling

- Validate upload type by actual file signature as well as declared metadata.
- Apply upload limits, pixel/dimension limits, and decoding safeguards.
- Remove unneeded image metadata from uploaded photos.
- Use private object storage and short-lived authorized access for personal uploads.
- Restrict server-side external fetches to approved provider/storage destinations.
- Escape user content and sanitize any supported rich text.
- Validate IDs and enforce object ownership server-side.
- Rate-limit uploads, auth, and generation.
- Add cleanup rules for temporary uploads and deleted outputs.
- Provide a concise permission/consent notice for uploaded likeness references and a report mechanism.
- Keep payment collection out of the MVP unless explicitly requested. If plans are displayed, identify them as planned and do not add a fake checkout.

## 17. Delivery phases

Do not stop after producing a plan. Implement working increments. Keep a concise project status file so progress can continue in another Cursor session.

PHASE 1 — Complete interactive frontend:
- Design tokens and responsive shell.
- Explore gallery, search, filters, categories, and collection routes.
- Prompt details and editable variables.
- Copy/share/save behaviors.
- Creation studio with transparent demo mode.
- Demo saved items/history/admin screens.
- Original seed content and relevant sample media.
- English/Hindi instruction support.
- Working route refresh in development.
- Mobile and desktop visual checks.

Finish this phase with a fully usable demonstration. Do not get stuck waiting for API credentials.

PHASE 2 — Real application backend:
- Express/MySQL/Prisma and migrations.
- Database seed and controlled admin bootstrap.
- Real sessions, roles, bookmarks, user collections, and history.
- CMS CRUD and moderation.
- Authenticated uploads and private media access.
- Server-driven filtering, search, pagination, and scheduled publishing.
- Replace demo repositories with API repositories.

PHASE 3 — Live generation:
- Capability registry and one verified image provider.
- Server-side secrets.
- Worker queue, job persistence, retries, deduplication, and error handling.
- Optional credit accounting if required.
- Connect video/text providers only when documented APIs and credentials are available.
- Keep unavailable providers visibly unconfigured.
- Verify a real end-to-end generation only if credentials and authorization are present; otherwise document the exact missing setup.

PHASE 4 — Launch preparation:
- Public-route prerendering/SSR and metadata.
- Sitemap, robots, accessibility, and performance review.
- Responsive visual polish.
- Production environment examples without secrets.
- Static frontend + Node server deployment instructions.
- Docker Compose for local MySQL/Redis development.
- Backup and media-retention notes.
- Build and critical-flow test results.

After each phase, report what works, how to run it, what was verified, and what still requires configuration. Continue to the next phase where tools and configuration permit, without repeatedly asking about routine implementation choices.

## 18. Verification and acceptance criteria

Use meaningful critical-flow checks, rather than tests that only mirror components.

Verify:
1. Search + category + content-type filters combine correctly and survive URL refresh.
2. A gallery card opens the correct canonical detail route.
3. Editing variables changes exactly the prompt copied/submitted.
4. Unfilled required variables are caught.
5. Saving/bookmarking persists appropriately; guest merge does not duplicate records.
6. Share and copy fallback work.
7. Mobile bottom navigation, sticky detail actions, dialogs, and keyboard focus do not overlap content.
8. No broken preview assets or page-wide horizontal overflow at 360, 390, 768, and 1440px widths.
9. A job cannot be double-submitted by repeated taps.
10. Failed jobs and insufficient credits, if implemented, recover correctly.
11. Unauthorized users cannot access admin operations or another user's private job/media.
12. Direct route refresh and public metadata work outside client-side navigation.
13. Production builds complete with no unresolved imports.
14. Demo output is clearly labeled and never presented as real generation.
15. No secrets appear in the built frontend.

Run the production build and relevant tests. Inspect actual rendered pages if browser tools are available. Report checks honestly and identify unrun checks.

Deliver:
- Working source code, not isolated snippets.
- README with exact install, development, build, migration, seed, and deployment commands.
- .env.example files with placeholders and clear client/server separation.
- Concise architecture and API notes.
- Seed data and asset-attribution records.
- A feature-status table separating demo, live, and unconfigured functionality.
- Screenshots of the implemented mobile Explore, prompt detail, and studio pages if your environment supports them.

Start by inspecting the repository, write a brief implementation plan, and immediately implement Phase 1. Prioritize visual fidelity, a beautiful two-column mobile feed, excellent preview assets, and complete copy/customize/save flows.

# MASTER PROMPT — END

---

## Optional follow-up: visual refinement

After Cursor finishes Phase 1, paste:

"Review the implemented app at 360px, 390px, 768px, and 1440px. Compare the gallery composition and dark/purple visual direction with promptpin.in. Improve image selection, spacing, typography, card proportions, mobile chip scrolling, bottom navigation, and prompt-detail actions. Preserve the working interactions. Fix overflow, inconsistent contrast, placeholder-looking areas, and awkward empty states. Run the build, verify the key user flows, and show the final mobile views."

## Optional follow-up: complete a partially finished build

If Cursor stops because of session limits, paste:

"Read Cursor_AI_Prompt_Platform_ReactJS.md and the project status file. Inspect what is already implemented. Continue from the first incomplete phase, preserve the established design, and verify the current implementation before adding more features. Do not restart the project."

