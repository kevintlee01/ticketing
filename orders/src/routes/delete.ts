import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError
} from '@ktltickets/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new BadRequestError('Order ID is invalid');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };

it.todo('emits an order cancelled event');
