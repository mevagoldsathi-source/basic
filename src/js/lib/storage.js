/** localStorage that never throws — Safari private mode, blocked cookies, etc. */
const KEY_PREFIX = "mevagold.";

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(KEY_PREFIX + key); } catch {}
  }
};
