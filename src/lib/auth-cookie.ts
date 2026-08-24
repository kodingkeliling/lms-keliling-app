/** Single source of truth for the auth cookie name used across the app. */
export const COOKIE_NAME = "token";

/**
 * Non-httpOnly indicator cookie — readable by JS via document.cookie.
 * Set alongside COOKIE_NAME on login, cleared on logout.
 * Used only as a fast client-side signal ("is a session likely active?")
 * to skip the navbar skeleton for users with no session at all.
 * Never trust this for security — the real auth is always COOKIE_NAME.
 */
export const SESSION_INDICATOR_COOKIE = "has_session";
