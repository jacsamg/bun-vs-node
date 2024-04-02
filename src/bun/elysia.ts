import { Elysia } from 'elysia';

const port = 81;

new Elysia()
  .get('/test/json', (ctx) => {
    ctx.set.status = 200;
    ctx.set.headers['x-powered-by'] = 'Elysia';

    return { success: true };
  }).listen(port, () => {
    console.log(process.env.NODE_ENV);
    console.log(`Elysia: server listening in port '${port}'`);
  });