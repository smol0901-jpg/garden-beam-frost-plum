/** Organization clock — Moscow, no DST. */
export const ORG_TZ = "Europe/Moscow";
export const MOSCOW_OFFSET = "+03:00";
export const GRACE_MINUTES = 5;

export function zonedYmd(date = new Date(), timeZone = ORG_TZ): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const pick = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "00";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export function zonedHm(date = new Date(), timeZone = ORG_TZ): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const pick = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "00";
  return `${pick("hour")}:${pick("minute")}`;
}

export function zonedHms(date = new Date(), timeZone = ORG_TZ): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const pick = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "00";
  return `${pick("hour")}:${pick("minute")}:${pick("second")}`;
}

export function parseHm(value: string): [number, number] {
  const [h, m] = value.split(":").map((n) => Number(n));
  return [h || 0, m || 0];
}

export function hhmm(value: string): string {
  if (!value) return "—";
  return value.slice(0, 5);
}

/** Interpret a civil date + clock time as an instant in Moscow. */
export function moscowInstant(ymd: string, hm: string): Date {
  const time = hm.length >= 8 ? hm.slice(0, 8) : `${hm.slice(0, 5)}:00`;
  return new Date(`${ymd}T${time}${MOSCOW_OFFSET}`);
}

export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Monday of the week containing ymd (ISO, week starts Monday). */
export function mondayOf(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay(); // 0 Sun
  const offset = day === 0 ? -6 : 1 - day;
  return addDays(ymd, offset);
}

export function shiftMinutes(start: string, end: string, breakMin: number): number {
  const [sh, sm] = parseHm(start);
  const [eh, em] = parseHm(end);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return Math.max(0, mins - Math.max(0, breakMin));
}

export function minutesBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.max(0, Math.round((b - a) / 60000));
}

export function formatDuration(mins: number): string {
  const sign = mins < 0 ? "−" : "";
  const abs = Math.abs(Math.round(mins));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m} мин`;
  if (m === 0) return `${sign}${h} ч`;
  return `${sign}${h} ч ${m} мин`;
}

export function weekdayShort(ymd: string): string {
  const names = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const [y, m, d] = ymd.split("-").map(Number);
  return names[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export function weekdayLong(ymd: string): string {
  const names = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  const [y, m, d] = ymd.split("-").map(Number);
  return names[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export function formatDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export function formatDayShort(ymd: string): string {
  const [, m, d] = ymd.split("-");
  return `${d}.${m}`;
}

export function isoToHm(iso: string): string {
  return zonedHm(new Date(iso));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export const MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
