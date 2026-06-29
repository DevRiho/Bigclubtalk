# Big Club Talk Product Blueprint

## Logo Analysis

The uploaded Big Club Talk logo was not present in the workspace at implementation time. The design system below uses a provisional sports-media palette designed for a white-first editorial product and is centralized in Tailwind/CSS tokens so it can be replaced after logo color extraction.

Required logo extraction workflow when the asset is available:

1. Sample dominant colors from the full logo, wordmark, icon mark, and any accent strokes.
2. Normalize to hex, RGB, HSL, and contrast-safe foreground pairs.
3. Map colors into semantic roles: brand primary, brand secondary, breaking, pitch, ink, muted, border, surface.
4. Validate WCAG AA contrast for navigation, buttons, labels, and ticker states.

## Provisional Brand Colors

| Token | Hex | Role |
| --- | --- | --- |
| `brand.ink` | `#101820` | Headlines, navigation, editorial text |
| `brand.red` | `#E10600` | Breaking news, primary CTA, live labels |
| `brand.blue` | `#0057FF` | Links, analysis, match intelligence |
| `brand.gold` | `#FFB000` | Transfer centre, premium highlights |
| `brand.green` | `#00875A` | Confirmed deals, success states |
| `brand.white` | `#FFFFFF` | Dominant background |
| `neutral.50` | `#F7F8FA` | Section bands |
| `neutral.200` | `#E5E7EB` | Rules, borders |
| `neutral.600` | `#4B5563` | Secondary text |
| `neutral.900` | `#111827` | Body contrast |

## Typography

- Display: `Bebas Neue`, condensed uppercase sports headline treatment.
- Editorial/headlines: `Oswald`, compact and authoritative.
- Body/interface: `Inter`, readable and production-safe.
- Article body: `Georgia`, for long-form editorial rhythm.

## UI System

- Background: white-dominant with light neutral section bands.
- Radius: 4-8px for cards and controls.
- Layout: editorial columns, asymmetric feature blocks, dense but readable news lists.
- Motion: restrained Framer Motion for ticker, hero reveal, section transitions.
- Buttons: bold, compact, icon-friendly, high-contrast.
- Cards: used only for repeated stories, authors, clubs, and dashboard panels.

## Core Page Wireframes

### Public

- Home: masthead, hero lead article, right-side live stack, animated ticker, trending mosaic, transfer centre, club rail, latest feed, writers, newsletter, footer.
- Article detail: hero image, category rail, headline, dek, byline, share/bookmark/like actions, article body, tags, comments, related articles.
- Category: editorial lead story, filtered article stream, popular side rail.
- Search: query bar, filter chips for tags/category/author, paginated results.
- Author profile: bio, follow action, posts, social links.
- Auth: register, login, email OTP verification, forgot password, reset password.

### Authenticated User

- Reader library: bookmarks, liked articles, followed authors, notifications.
- Comment management: edit/delete own comments and replies.

### Author

- Author dashboard: article metrics, drafts, published posts.
- Post editor: title, slug, excerpt, cover image upload, category, tags, content, status, featured flag.

### Admin

- Overview analytics: users, posts, views, comments, popular articles.
- User management: role changes, active/suspended states.
- Post management: publish/unpublish, feature, delete.
- Category management.
- Comment moderation.
- Newsletter subscriber management.

## MongoDB Collections

- Users
- Posts
- Categories
- Comments
- Likes
- Bookmarks
- Followers
- Notifications
- NewsletterSubscribers

## API Endpoint Surface

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Posts

- `GET /api/posts`
- `GET /api/posts/featured`
- `GET /api/posts/trending`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/view`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/bookmark`

### Comments

- `GET /api/posts/:postId/comments`
- `POST /api/posts/:postId/comments`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`
- `POST /api/comments/:id/like`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

### Authors

- `GET /api/authors`
- `GET /api/authors/:id`
- `POST /api/authors/:id/follow`

### Search

- `GET /api/search?q=&tag=&category=&author=&page=&limit=`

### Newsletter

- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`
- `GET /api/newsletter/subscribers`

### Admin

- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/posts`
- `GET /api/admin/comments`

## Development Roadmap

1. Foundation: monorepo, Vite frontend, Express API, shared env docs, lint/build scripts.
2. Data model: Mongoose schemas, indexes, relationships, seed-free production defaults.
3. Auth: JWT access tokens, refresh token rotation, OTP email verification, password reset.
4. Publishing: CRUD, Cloudinary upload adapter, categories, tags, draft/publish states.
5. Reading experience: homepage, article detail, category/search pages, engagement.
6. Community: threaded comments, likes, bookmarks, follows, notifications.
7. Admin: analytics and moderation workflows.
8. Deployment: Vercel frontend, Render API, MongoDB Atlas, env hardening.
