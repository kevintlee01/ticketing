import { Publisher } from '@ktltickets/common';
import { TicketCreatedEvent } from '@ktltickets/common';
import { Subjects } from '@ktltickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

}
