import mongoose from 'mongoose';
import express, { Request, Response } from 'express';

import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError
} from '@ktltickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new BadRequestError('Order ID is invalid');
  }

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
