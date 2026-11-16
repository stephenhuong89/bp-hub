/* CVC hub relay (Cloudflare Worker).
   Holds the company's Anthropic key and the email key so staff never see them. Staff only need the passcode.
   Set these under the Worker's Settings > Variables and Secrets (type: Secret):
     HUB_PASSCODE       the passcode you give staff
     ANTHROPIC_API_KEY  the Anthropic key (sk-ant-...)
     RESEND_API_KEY     optional, only for sending reports by email
   Nothing secret is written in this file. */
const ALLOWED = ["https://stephenhuong89.github.io", "http://localhost:8123"];

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ALLOWED[0],
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-hub-pass, anthropic-version, anthropic-beta",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function reply(status, obj, origin) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", ...cors(origin) } });
}
function forward(upstream, origin) {
  const h = new Headers(cors(origin));
  h.set("content-type", upstream.headers.get("content-type") || "application/json");
  return new Response(upstream.body, { status: upstream.status, headers: h });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "", path = new URL(req.url).pathname;
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (origin && !ALLOWED.includes(origin)) return reply(403, { error: { message: "This site is not allowed to use the relay." } }, origin);
    if (!env.HUB_PASSCODE || req.headers.get("x-hub-pass") !== env.HUB_PASSCODE) return reply(401, { error: { message: "Wrong passcode." } }, origin);

    if (path === "/ping") return reply(200, { ok: true, email: !!env.RESEND_API_KEY }, origin);

    if (path === "/v1/messages" && req.method === "POST") {
      const headers = { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": req.headers.get("anthropic-version") || "2023-06-01" };
      const beta = req.headers.get("anthropic-beta"); if (beta) headers["anthropic-beta"] = beta;
      return forward(await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: req.body }), origin);
    }

    if (path === "/email" && req.method === "POST") {
      if (!env.RESEND_API_KEY) return reply(501, { error: { message: "Email is not set up on the relay." } }, origin);
      return forward(await fetch("https://api.resend.com/emails", { method: "POST", headers: { "content-type": "application/json", "Authorization": "Bearer " + env.RESEND_API_KEY }, body: req.body }), origin);
    }
    return reply(404, { error: { message: "Not found." } }, origin);
  }
};
