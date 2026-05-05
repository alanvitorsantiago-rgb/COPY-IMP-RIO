// ─── Storage Helpers ──────────────────────────────────────────────────────────
const APP_KEY = "imperio_copy_v3";

export const store = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(`${APP_KEY}_${key}`)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(`${APP_KEY}_${key}`, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(`${APP_KEY}_${key}`); } catch {} },
};

export function getUsers() { return store.get("users") || {}; }
export function saveUsers(u) { store.set("users", u); }

export function getHistory(uid) { return store.get(`hist_${uid}`) || []; }
export function saveHistory(uid, h) { store.set(`hist_${uid}`, h); }

export function getLibrary(uid) { return store.get(`lib_${uid}`) || []; }
export function saveLibrary(uid, l) { store.set(`lib_${uid}`, l); }

export function getUsage(uid) {
  const d = store.get(`usage_${uid}`) || {};
  const today = new Date().toDateString();
  if (d.date !== today) return 0;
  return d.count || 0;
}
export function incUsage(uid) {
  const today = new Date().toDateString();
  store.set(`usage_${uid}`, { date: today, count: getUsage(uid) + 1 });
}

export function getWeekActivity(uid) {
  const hist = getHistory(uid);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const dateStr = d.toLocaleDateString("pt-BR");
    const count = hist.filter(h => h.date === dateStr).length;
    days.push({ label, count });
  }
  return days;
}
