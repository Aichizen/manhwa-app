(() => {
  const API_BASE = "https://story-about-us-api.aichinose219.workers.dev";
  const tg = window.Telegram?.WebApp;
  let user = null;
  let initData = "";
  let initialized = false;

  if (tg) { tg.ready(); tg.expand(); }
  initData = tg?.initData || "";

  async function authenticate() {
    if (!initData) throw new Error("Buka aplikasi melalui Telegram untuk login.");
    const response = await fetch(`${API_BASE}/api/auth/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || "Login Telegram gagal.");
    user = data.user;
    sessionStorage.setItem("storyAboutUsAccountMode", "telegram");
    initialized = true;
    window.dispatchEvent(new CustomEvent("story-account-change", { detail: { user } }));
    return user;
  }

  async function init() {
    if (sessionStorage.getItem("storyAboutUsAccountMode") === "telegram" && initData) {
      try { await authenticate(); } catch (error) {
        user = null;
        sessionStorage.setItem("storyAboutUsAccountMode", "guest");
        window.dispatchEvent(new CustomEvent("story-account-change", { detail: { user: null, error } }));
      }
    } else {
      initialized = true;
      user = null;
    }
    return user;
  }

  function guest() {
    user = null;
    sessionStorage.setItem("storyAboutUsAccountMode", "guest");
    initialized = true;
    window.dispatchEvent(new CustomEvent("story-account-change", { detail: { user: null } }));
  }

  async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});
    if (user && initData) headers.set("Authorization", `tma ${initData}`);
    return fetch(url, { ...options, headers });
  }

  window.ReaderAccount = {
    init, login: authenticate, guest, apiFetch,
    get user() { return user; },
    get authenticated() { return Boolean(user && initData); },
    get initialized() { return initialized; },
    get hasTelegramData() { return Boolean(initData); }
  };
})();