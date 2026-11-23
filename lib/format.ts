const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export const formatUsd = (value: number) => usd.format(value);
export const formatNumber = (value: number) => num.format(value);
export const formatDate = (iso: string) => date.format(new Date(`${iso}T00:00:00Z`));

/** Normalizes a US phone number to E.164 (+1XXXXXXXXXX). Returns null if invalid. */
export function normalizeUsPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return null;
  // NANP: area code and exchange cannot start with 0 or 1.
  if (/^[01]/.test(ten) || /^[01]/.test(ten.slice(3))) return null;
  return `+1${ten}`;
}

export function formatUsPhone(e164: string): string {
  const d = e164.replace(/\D/g, "").slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const isValidZip = (zip: string) => /^\d{5}$/.test(zip.trim());
