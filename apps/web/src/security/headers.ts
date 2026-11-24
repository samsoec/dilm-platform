export type CspMode = "report-only" | "enforce";

export type SecurityHeader = { key: string; value: string };

const GA_SCRIPT_HOSTS = ["https://www.googletagmanager.com"];
const GA_CONNECT_HOSTS = [
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://www.googletagmanager.com",
];
const GA_IMG_HOSTS = [
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
];

export function cspMode(raw: string | undefined): CspMode {
  return raw === "enforce" ? "enforce" : "report-only";
}

export function buildCsp(options: { dev?: boolean } = {}): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", ...GA_SCRIPT_HOSTS];
  if (options.dev) scriptSrc.push("'unsafe-eval'");
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${GA_IMG_HOSTS.join(" ")}`,
    "font-src 'self' data:",
    `connect-src 'self' ${GA_CONNECT_HOSTS.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export function securityHeaders(
  options: { mode?: CspMode; dev?: boolean } = {},
): SecurityHeader[] {
  const mode = options.mode ?? "report-only";
  const csp = buildCsp({ dev: options.dev });
  return [
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
    {
      key:
        mode === "enforce"
          ? "Content-Security-Policy"
          : "Content-Security-Policy-Report-Only",
      value: csp,
    },
  ];
}

export function withSecurityHeaders<T extends Response>(response: T): T {
  const headers = securityHeaders({
    mode: cspMode(process.env.CSP_MODE),
    dev: process.env.NODE_ENV !== "production",
  });
  for (const { key, value } of headers) {
    response.headers.append(key, value);
  }
  return response;
}
