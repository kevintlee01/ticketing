import { Publisher, Subjects, TicketUpdatedEvent } from '@ktltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
