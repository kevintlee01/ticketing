import { Publisher, OrderCancelledEvent, Subjects } from "@ktltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
