import { Component } from '@angular/core';
import { TicketService } from '../ticket.service';
import { RxEventTickets, EventTypes } from '@hub-fx/examples';

// For implementation and tests
// https://github.com/hub-fx/hub-fx/tree/main/packages/examples/src/EventTickets

@Component({
  selector: 'app-event-tickets',
  templateUrl: './event-tickets.component.html',
  styleUrls: ['./event-tickets.component.scss'],
})
export class EventTicketsComponent {
  eventTickets = RxEventTickets(TicketService.getPrice);

  setQty(event: Event) {
    this.eventTickets.actions.setQty(+(<HTMLInputElement>event.target).value);
  }

  selectEvent(event: Event) {
    this.eventTickets.actions.selectEvent(
      (<HTMLSelectElement>event.target).value as EventTypes
    );
  }
}
