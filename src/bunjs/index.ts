import { Elysia } from 'elysia';

const app = new Elysia();
const port = 80;

app.post('/test/json', () => {
  return { success: true };
});

app.listen(port, () => {
  console.log(`Elysia: server listening in port '${port}'`);
});