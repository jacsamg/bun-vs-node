import { Elysia } from 'elysia';

const app = new Elysia();

app.post('/test/json', () => {
  return { success: true };
});

app.listen(3000, () => {
  console.log("Elysia: server listening in port '3000'");
});