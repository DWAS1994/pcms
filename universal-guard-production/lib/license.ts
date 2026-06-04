import crypto from "crypto";

export function generateLicenseKey() {
  const raw = crypto.randomBytes(18).toString("hex").toUpperCase();
  return [
    raw.slice(0, 6),
    raw.slice(6, 12),
    raw.slice(12, 18),
    raw.slice(18, 24),
    raw.slice(24, 30),
    raw.slice(30, 36)
  ].join("-");
}

export function getLicenseExpiry() {
  const days = Number(process.env.LICENSE_DURATION_DAYS || "365");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}
