# KSL Business Solutions — Website

Official website for **KSL Business Solutions Sdn. Bhd.**  
Built with React + Vite.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 📁 Project Structure

```
ksl-site/
├── index.html                    ← HTML entry point
├── package.json
├── vite.config.js
├── public/
│   ├── admin/                    ← ⭐ Decap CMS admin panel (/admin)
│   │   ├── index.html            ← loads Decap from CDN
│   │   └── config.yml            ← collections / fields / GitHub backend
│   ├── downloads/                ← Public downloadable files
│   └── images/                   ← Public images + CMS-uploaded images
└── src/
    ├── main.jsx                  ← React root mount
    ├── App.jsx                   ← Main layout — assembles all sections
    ├── content/                  ← ⭐ Editable JSON content (CMS-managed)
    │   ├── hero.json
    │   ├── stats.json
    │   ├── services.json
    │   ├── products.json
    │   ├── caseStudies.json
    │   ├── partners.json
    │   ├── careers.json
    │   └── footer.json
    ├── styles/
    │   └── global.css            ← CSS variables, resets, responsive breakpoints
    ├── constants/
    │   └── contact.js            ← ⭐ Contact info (phone, email, address, WhatsApp)
    ├── assets/                   ← ⭐ All static files — images, logos, icons
    │   ├── assets.js             ← ⭐ Central asset registry (edit paths here)
    │   ├── logos/
    │   │   ├── ksl_logo.png      ← Main company logo
    │   │   └── partners/
    │   │       ├── mdot.png          ← [ Replace with real logo ]
    │   │       ├── alfex.png         ← [ Replace with real logo ]
    │   │       ├── autocount.png     ← [ Replace with real logo ]
    │   │       ├── sitegiant.png     ← [ Replace with real logo ]
    │   │       └── superprintz.png   ← [ Replace with real logo ]
    │   └── images/
    │       ├── case-networking.jpg   ← [ Replace with real project photo ]
    │       └── case-plugin.jpg       ← [ Replace with real project photo ]
    └── components/
        ├── ParticleBackground.jsx ← Canvas particle animation + mouse interaction
        ├── Nav.jsx                ← Fixed header (hidden on hero, appears on scroll)
        ├── Hero.jsx               ← Full-screen hero with particle BG + pause button
        ├── Stats.jsx              ← Key numbers bar
        ├── Partners.jsx           ← Partner logo strip (with placeholders)
        ├── Services.jsx           ← 6-card services grid
        ├── CaseStudies.jsx        ← 2 case study cards
        ├── Products.jsx           ← 4-card product grid
        ├── Careers.jsx            ← Join the team CTA
        ├── Footer.jsx             ← Full footer with contact details
        └── ContactModal.jsx       ← Popup with WhatsApp / Email / Facebook buttons
```

---

## 🛠️ Admin Content Manager (`/admin`)

The homepage is now driven by a **Decap CMS** admin panel at:

```
https://ksleow.com/admin
```

Editors log in with **GitHub** and edit the homepage through a friendly form.
Saving publishes a commit to `main` → Vercel rebuilds → changes go live in ~30 seconds.

### Editable sections
Hero · Stats Bar · Services · Products · Case Studies · Partners · Careers · Footer.
Each section corresponds to one JSON file under [`src/content/`](src/content/).

### Image uploads
Files uploaded through the CMS land in [`public/images/`](public/images/) and are
referenced from the rendered page as `/images/<filename>`. They are committed
to the repo, so they're versioned alongside the content.

### One-time setup (already done — kept here for reference)

1. **Create a GitHub OAuth App** at <https://github.com/settings/developers>
   - Application name: `KSL Content Manager`
   - Homepage URL: `https://ksleow.com`
   - Authorization callback URL: `https://YOUR-WORKER.workers.dev/callback`
2. **Add two Worker env vars** in the Cloudflare dashboard:
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
3. **Set the Worker URL** in [`public/admin/config.yml`](public/admin/config.yml) → `backend.base_url`.
4. **Invite admins** as collaborators on the GitHub repo (Settings → Collaborators).
   Anyone with write access to `main` can log in and edit content.

---

## ✏️ How to Update Content

> **For non-developer admins:** use `/admin` (see section above).
> The notes below are for developers editing files directly.

### Contact Information
Edit **one file** — `src/constants/contact.js`:
```js
export const CONTACT = {
  address:  "No. 9, 2nd Floor, Taman Zabidin, ...",
  email:    "Support@ksleow.com.my",
  phone:    "017-905 2323",
  whatsapp: "60179052323",
  facebook: "https://www.facebook.com/ksleowbs",
};
```
All components (Nav, Footer, Modal) automatically use these values.

### Replace Partner Logos
1. Drop the real logo PNG/SVG into `src/assets/logos/partners/`
2. Name it exactly as shown in the folder structure (e.g. `mdot.png`)
3. Done — the `Partners` component will automatically display the image

### Replace Case Study Photos
1. Drop the photo into `src/assets/images/`
2. Name it `case-networking.jpg` or `case-plugin.jpg`
3. The placeholder icon disappears automatically

### Replace the Main Logo
Swap out `src/assets/logos/ksl_logo.png` with the new file (keep the same filename).

### Add / Remove Services
Edit `src/content/services.json` — or use the admin panel.

### Add / Remove Products
Edit `src/content/products.json` — or use the admin panel.

### Other section content
All editable homepage copy lives in `src/content/`:
`hero.json`, `stats.json`, `services.json`, `products.json`,
`caseStudies.json`, `partners.json`, `careers.json`, `footer.json`.

---

## 🎨 Theme Colors

All colors are defined as CSS variables in `src/styles/global.css`:

| Variable        | Value     | Used for              |
|-----------------|-----------|------------------------|
| `--brand`       | `#2f315a` | Primary navy blue      |
| `--brand-light` | `#3d4075` | Hover states           |
| `--gold`        | `#c9a84c` | Accent / labels        |
| `--gold-light`  | `#e8c97a` | Hero tagline text      |
| `--white`       | `#ffffff` | Backgrounds            |
| `--light-bg`    | `#f5f5f8` | Section alternates     |
| `--muted`       | `#6b6f91` | Body / secondary text  |

---

## 🌐 Deployment

This site builds to a standard static bundle.  
Compatible with: **GitHub Pages**, **Netlify**, **Vercel**, **any static host**.

```bash
npm run build
# Output folder: dist/
```

For GitHub Pages, set the base in `vite.config.js`:
```js
export default defineConfig({
  base: "/your-repo-name/",
  plugins: [react()],
});
```
