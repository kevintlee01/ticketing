import request from 'supertest';

import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  // make a request to build an order with ticket created
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // make sure order is cancelled 
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  const user = global.signin();

  // make a request to build an order with ticket created
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
