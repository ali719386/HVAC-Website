/**
 * Analytics event helper. Pushes to window.dataLayer ONLY when the layout enabled analytics
 * (config.analytics.gtmId set). Otherwise a no-op: no script, no cookies, no network requests.
 * Never pass personal data (names, phones, emails) as params.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __analyticsEnabled?: boolean;
  }
}

export type TrackEvent = "form_start" | "step_complete" | "form_submit" | "click_to_call" | "click_to_whatsapp";

export function track(event: TrackEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !window.__analyticsEnabled) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
