import { Hono } from 'hono';

const app = new Hono();

app.get('/test/json', (c) => {
  c.status(200);
  c.header("x-powered-by", "Hono");

  return c.json({ success: true });
});

export default {
  port: 82,
  fetch: app.fetch,
}; 