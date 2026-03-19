(() => {
  const AUTH_STORAGE_KEY = 'aikongkong_auth_session_v2';
  const PAGE_STATE_STORAGE_KEY = 'aikongkong_page_state_v2';
  const LEGACY_ENTRY_SESSION_KEY = 'aikongkong_entry_session_v1';
  const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

  function safeParse(raw) {
    if (!raw || typeof raw !== 'string') return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function toDigits(value) {
    return String(value || '').replace(/[^0-9]/g, '');
  }

  function normalizeSession(session, options = {}) {
    if (!session || typeof session !== 'object') return null;

    const ttlMs = Number(options.ttlMs || session.ttlMs || DEFAULT_SESSION_TTL_MS);
    const now = Date.now();
    const savedAt = String(session.savedAt || session.loggedAt || new Date(now).toISOString());
    const expiresAt = String(
      session.expiresAt
      || new Date(now + ttlMs).toISOString()
    );
    const role = String(session.role || '').trim();

    if (!['admin', 'customer', 'installer'].includes(role)) return null;

    return {
      role,
      loggedIn: true,
      remember: Boolean(session.remember),
      adminId: String(session.adminId || '').trim(),
      customerId: String(session.customerId || '').trim(),
      contractNo: String(session.contractNo || '').trim(),
      name: String(session.name || '').trim(),
      phone: toDigits(session.phone || ''),
      savedAt,
      expiresAt
    };
  }

  function isExpired(session) {
    const expiresAt = new Date(String(session?.expiresAt || '')).getTime();
    if (!expiresAt) return false;
    return Date.now() > expiresAt;
  }

  function writeLegacySession(session) {
    try {
      sessionStorage.setItem(LEGACY_ENTRY_SESSION_KEY, JSON.stringify(session));
    } catch (_) {}
  }

  function clearLegacySession() {
    try {
      sessionStorage.removeItem(LEGACY_ENTRY_SESSION_KEY);
    } catch (_) {}
  }

  function loadAuthSession() {
    const stored = safeParse(localStorage.getItem(AUTH_STORAGE_KEY))
      || safeParse(sessionStorage.getItem(AUTH_STORAGE_KEY))
      || safeParse(sessionStorage.getItem(LEGACY_ENTRY_SESSION_KEY));

    const session = normalizeSession(stored);
    if (!session || isExpired(session)) {
      clearAuthSession();
      return null;
    }

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (_) {}
    writeLegacySession(session);
    return session;
  }

  function saveAuthSession(session, options = {}) {
    const normalized = normalizeSession(session, options);
    if (!normalized) return null;

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
    } catch (_) {}
    writeLegacySession(normalized);
    return normalized;
  }

  function clearAuthSession() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (_) {}
    clearLegacySession();
  }

  function bootstrapSession(options = {}) {
    const session = loadAuthSession();
    if (!session) {
      return { ok: Boolean(options.allowGuest), session: null, reason: 'missing' };
    }

    const allowedRoles = Array.isArray(options.allowedRoles) ? options.allowedRoles : [];
    if (allowedRoles.length && !allowedRoles.includes(session.role)) {
      return { ok: false, session, reason: 'role_mismatch' };
    }

    return { ok: true, session, reason: '' };
  }

  function readAllPageState() {
    return safeParse(localStorage.getItem(PAGE_STATE_STORAGE_KEY)) || {};
  }

  function savePageState(pageKey, partialState) {
    if (!pageKey) return {};
    const allState = readAllPageState();
    allState[pageKey] = {
      ...(allState[pageKey] || {}),
      ...(partialState || {}),
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(PAGE_STATE_STORAGE_KEY, JSON.stringify(allState));
    return allState[pageKey];
  }

  function restorePageState(pageKey, defaults = {}) {
    if (!pageKey) return { ...defaults };
    const allState = readAllPageState();
    return {
      ...defaults,
      ...((allState && allState[pageKey]) || {})
    };
  }

  function clearPageState(pageKey) {
    if (!pageKey) return;
    const allState = readAllPageState();
    delete allState[pageKey];
    localStorage.setItem(PAGE_STATE_STORAGE_KEY, JSON.stringify(allState));
  }

  function readReturnToUrl() {
    const raw = String(new URLSearchParams(location.search).get('returnTo') || '').trim();
    if (!raw) return '';

    try {
      const decoded = decodeURIComponent(raw);
      const url = new URL(decoded, location.href);
      if (url.origin !== location.origin) return '';
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {
      return '';
    }
  }

  function withReturnTo(url, currentUrl = `${location.pathname}${location.search}${location.hash}`) {
    try {
      const nextUrl = new URL(url, location.href);
      nextUrl.searchParams.set('returnTo', encodeURIComponent(currentUrl));
      return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    } catch (_) {
      return url;
    }
  }

  function safeNavigateBack(fallbackUrl, options = {}) {
    const returnTo = options.returnTo || readReturnToUrl();
    if (returnTo) {
      location.href = returnTo;
      return;
    }

    const fallback = String(fallbackUrl || './index.html?manual=1');
    if (history.length > 1) {
      const referrer = String(document.referrer || '').trim();
      if (!referrer) {
        history.back();
        return;
      }
      try {
        const refUrl = new URL(referrer, location.href);
        if (refUrl.origin === location.origin) {
          history.back();
          return;
        }
      } catch (_) {}
    }

    location.href = fallback;
  }

  function restoreScroll(scrollY) {
    const y = Number(scrollY || 0);
    if (!Number.isFinite(y) || y <= 0) return;
    requestAnimationFrame(() => {
      setTimeout(() => window.scrollTo(0, y), 30);
    });
  }

  window.IkongkongSession = {
    AUTH_STORAGE_KEY,
    PAGE_STATE_STORAGE_KEY,
    LEGACY_ENTRY_SESSION_KEY,
    DEFAULT_SESSION_TTL_MS,
    loadAuthSession,
    saveAuthSession,
    clearAuthSession,
    bootstrapSession,
    savePageState,
    restorePageState,
    clearPageState,
    safeNavigateBack,
    readReturnToUrl,
    withReturnTo,
    restoreScroll
  };
})();
