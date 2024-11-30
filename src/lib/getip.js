export function getClientIp(req) {
  const ip =
    req.ip ||
    req.headers.get("x-real-client-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1";

  const cleanIp = ip.replace(/^::ffff:/, "");

  return cleanIp;
}