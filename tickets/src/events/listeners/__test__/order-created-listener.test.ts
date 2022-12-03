import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@ktltickets/common";
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  // create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  // create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toDateString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg }
}

it('sets userId of ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // fetch ticket by ID
  const updatedTicket = await Ticket.findById(ticket.id);

  // assert ticket orderId
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // assert ack is called
  expect(msg.ack).toHaveBeenCalled();
});
