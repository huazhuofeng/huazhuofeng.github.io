/**
 * Cloudflare Worker for DeepSeek Proxy & Rate Limiting
 * 
 * Setup Instructions:
 * 1. Create a new Worker in Cloudflare Dashboard.
 * 2. Copy this code into the worker.
 * 3. Set Environment Variables (Settings -> Variables):
 *    - DEEPSEEK_API_KEY: Your actual DeepSeek API Key (sk-...)
 *    - VIP_PASSWORD: The password for VIP access (e.g., "mysecretvip")
 *    - ALLOWED_ORIGIN: Your website domain (e.g., "https://huazhuofeng.top")
 * 4. Deploy!
 */

const RATE_LIMIT_COUNT = 5; // Messages per IP per day
const RATE_LIMIT_WINDOW = 86400; // 24 hours in seconds

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    if (!url.pathname.endsWith("/chat")) {
      return new Response("Not Found", { status: 404 });
    }

    try {
      return await handleChat(request, env);
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(env) }
      });
    }
  }
};

async function handleChat(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  let apiKey = env.DEEPSEEK_API_KEY;
  let isGuest = true;

  // 1. Check Auth Type
  if (authHeader.startsWith("Bearer sk-")) {
    // User provided their own key
    apiKey = authHeader.replace("Bearer ", "");
    isGuest = false;
  } else if (authHeader.startsWith("Password ")) {
    // User provided VIP password
    const password = authHeader.replace("Password ", "");
    if (password === env.VIP_PASSWORD) {
      isGuest = false; // VIP uses system key but no rate limit
    } else {
      return new Response(JSON.stringify({ error: "Invalid VIP Password" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(env) }
      });
    }
  }

  // 2. Rate Limiting (For Guests Only)
  if (isGuest) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const limitKey = `rate_limit:${ip}`;
    
    // Note: For a real production app, use Cloudflare KV or Durable Objects.
    // For this simple example, we are using a naive approach or assuming low volume.
    // Since Workers are stateless, in-memory rate limiting doesn't work well across multiple isolates.
    // However, for a personal site, we can use the "Cache API" as a poor man's KV for rate limiting.
    
    const currentUsage = await getRateLimit(limitKey);
    if (currentUsage >= RATE_LIMIT_COUNT) {
      return new Response(JSON.stringify({ 
        error: "Daily limit reached. Please login as VIP or enter your own API Key." 
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders(env) }
      });
    }
    
    // Increment usage (fire and forget)
    await incrementRateLimit(limitKey, currentUsage);
  }

  // 3. Proxy to DeepSeek
  const body = await request.json();
  
  // Enforce model to prevent abuse if needed, or allow user choice
  const payload = {
    ...body,
    model: "deepseek-chat", // Force model
    stream: true
  };

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  // Stream response back
  const { readable, writable } = new TransformStream();
  response.body.pipeTo(writable);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...corsHeaders(env)
    }
  });
}

// --- Helpers ---

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function handleOptions(request, env) {
  return new Response(null, {
    headers: corsHeaders(env)
  });
}

// Simple Rate Limit using Cache API (Ephemeral, per colo)
// Ideally replace this with Cloudflare KV for global consistency
async function getRateLimit(key) {
  const cache = caches.default;
  const url = `http://fake-rate-limit/${key}`;
  const response = await cache.match(url);
  if (!response) return 0;
  return parseInt(await response.text());
}

async function incrementRateLimit(key, current) {
  const cache = caches.default;
  const url = `http://fake-rate-limit/${key}`;
  const next = current + 1;
  const response = new Response(next.toString(), {
    headers: { "Cache-Control": `public, max-age=${RATE_LIMIT_WINDOW}` }
  });
  // Wait for cache put
  await cache.put(url, response);
}
