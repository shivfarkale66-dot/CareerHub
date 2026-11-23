// One place for the backend address.
//
//  - On your PC (npm run dev): leave VITE_API_URL empty. Requests to /api go through the
//    Vite proxy (vite.config.js) to http://localhost:8081, so there are no CORS problems.
//  - When hosting: set VITE_API_URL to your backend address before building,
//    for example VITE_API_URL=https://careerhub-api.onrender.com   (no slash at the end)
export const API_BASE = String(import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// Optional TURN server for interview calls (needed on the internet, see DEPLOY.md)
export const TURN = {
  url: import.meta.env.VITE_TURN_URL || "",
  username: import.meta.env.VITE_TURN_USERNAME || "",
  credential: import.meta.env.VITE_TURN_CREDENTIAL || "",
};