# Student Resources Hub — Vercel + Render Deployment

## 1. Vercel (Frontend)

Create a Vercel project from this GitHub repository.

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Add this Environment Variable:

```text
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Do not add a trailing `/` to `VITE_API_URL`.

The `frontend/vercel.json` file already contains the SPA rewrite needed for React Router refreshes.

## 2. Render (Backend)

Create a **Web Service** from the same GitHub repository.

- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add these environment variables in Render:

```text
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
```

Render provides `PORT` automatically. The backend uses `process.env.PORT || 5000`, so no hard-coded production port is required.

## 3. MongoDB Atlas

In Atlas Network Access, allow the Render service to connect. For a simple Render deployment, `0.0.0.0/0` can be used if your security policy allows it; use stronger network restrictions when available.

## 4. Cloudinary

Create the Cloudinary environment variables in Render only. Never put Cloudinary secrets in the frontend or Vercel variables.

## 5. Gemini

Put the Gemini API key in Render only. The frontend should call your backend AI route rather than exposing the key in browser code.

## 6. Final test

After both services deploy:

1. Open `https://YOUR-RENDER-SERVICE.onrender.com/` — it should show the backend running message.
2. Open `https://YOUR-RENDER-SERVICE.onrender.com/api/test` — it should return JSON with `success: true`.
3. Open the Vercel URL.
4. Test Login/Register.
5. Test Notes/PYQ/Syllabus/E-books.
6. Test resource search and branch filters.
7. Test bookmark and notification features.
8. Test file upload from an admin account.
9. Test AI Question Paper/Study Assistant.
10. Refresh a nested frontend URL such as `/notes` or `/dashboard`; it should not show a Vercel 404.

## Important

Do not commit `.env` files or API keys. Only commit the `.env.example` templates.
