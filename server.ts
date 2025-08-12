import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/api/games',async c => {
  try {
    const { handle } = await import("./endpoints/games_GET.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games',async c => {
  try {
    const { handle } = await import("./endpoints/games_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.get('/api/games/notes',async c => {
  try {
    const { handle } = await import("./endpoints/games/notes_GET.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/notes',async c => {
  try {
    const { handle } = await import("./endpoints/games/notes_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.delete('/api/games/notes',async c => {
  try {
    const { handle } = await import("./endpoints/games/notes_DELETE.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.get('/api/games/solutions',async c => {
  try {
    const { handle } = await import("./endpoints/games/solutions_GET.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/solutions',async c => {
  try {
    const { handle } = await import("./endpoints/games/solutions_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.delete('/api/games/solutions',async c => {
  try {
    const { handle } = await import("./endpoints/games/solutions_DELETE.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/solutions/generate',async c => {
  try {
    const { handle } = await import("./endpoints/games/solutions/generate_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/rawg_search',async c => {
  try {
    const { handle } = await import("./endpoints/games/rawg_search_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/rawg_details',async c => {
  try {
    const { handle } = await import("./endpoints/games/rawg_details_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/import_from_rawg',async c => {
  try {
    const { handle } = await import("./endpoints/games/import_from_rawg_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/delete',async c => {
  try {
    const { handle } = await import("./endpoints/games/delete_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.post('/api/games/status',async c => {
  try {
    const { handle } = await import("./endpoints/games/status_POST.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.get('/api/dashboard/stats',async c => {
  try {
    const { handle } = await import("./endpoints/dashboard/stats_GET.ts");
    let request = c.req.raw;
    const response = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.json({ error: "Error loading endpoint code: " + e.message }, 500)
  }
})
app.use('/*', serveStatic({ root: './dist' }))
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/api")) {
    return next();
  }
  return serveStatic({ path: "./dist/index.html" })(c, next);
});
serve({ fetch: app.fetch, port: 3344 });
console.log("Running at http://localhost:3344")
      