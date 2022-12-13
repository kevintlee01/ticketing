import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { Order } from "../../../models/order";
import { OrderCancelledEvent, OrderStatus } from "@ktltickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'fake_ticket_id'
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, data, msg }
}

it('replicates the order info', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
