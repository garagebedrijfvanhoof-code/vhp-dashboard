import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "vhp-data", consistency: "strong" });
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "key required" }), { status: 400 });
  }

  // GET — data laden
  if (req.method === "GET") {
    const data = await store.get(key, { type: "json" });
    return new Response(JSON.stringify({ value: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  // POST — data opslaan
  if (req.method === "POST") {
    const body = await req.json();
    await store.setJSON(key, body.value);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/storage" };
