import request from 'supertest';

import { app } from '../../src/app';

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);
};

it('can fetch a list of tickets', async () => {
  await createTicket('title1', 10);
  await createTicket('title2', 15);
  await createTicket('title3', 20);

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3)
});
