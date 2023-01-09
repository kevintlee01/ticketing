import { Subjects, Publisher, PaymentCreatedEvent } from "@ktltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}