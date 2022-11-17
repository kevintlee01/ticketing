import { Message } from 'node-nats-streaming';
import { Listener } from '@ktltickets/common';
import { Subjects } from '@ktltickets/common';
import { TicketCreatedEvent } from '@ktltickets/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
