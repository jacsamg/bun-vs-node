import { Elysia } from 'elysia';

const app = new Elysia();
const port = 80;

app.get('/test/json', (ctx) => {
  ctx.set.status = 200;
  ctx.set.headers['x-powered-by'] = 'Elysia';

  return { success: true };
});

app.listen(port, () => {

  console.log(`Elysia: server listening in port '${port}'`);
});