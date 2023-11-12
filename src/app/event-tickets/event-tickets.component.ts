import { Component } from '@angular/core';
import { TicketService } from '../ticket.service';
import { EventTickets, EventTypes } from '@hub-fx/examples';

@Component({
  selector: 'app-event-tickets',
  templateUrl: './event-tickets.component.html',
  styleUrls: ['./event-tickets.component.scss'],
})
export class EventTicketsComponent {
  constructor(private ticketService: TicketService) {}

  eventTickets = EventTickets(
    this.ticketService.getPrice.bind(this.ticketService)
  );

  setQty(event: Event) {
    this.eventTickets.actions.setQty(+(<HTMLInputElement>event.target).value);
  }

  selectEvent(event: Event) {
    this.eventTickets.actions.selectEvent(
      (<HTMLSelectElement>event.target).value as EventTypes
    );
  }
}
