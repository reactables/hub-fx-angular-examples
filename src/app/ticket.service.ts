import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventTypes, FetchPricePayload } from '@hub-fx/examples';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private prices = {
    [EventTypes.ChiliCookOff]: 20,
    [EventTypes.ItchyAndScratchyMovie]: 40,
    [EventTypes.GrammarRodeo]: 50,
  };

  constructor() {}

  getPrice({ event, qty }: FetchPricePayload) {
    return of(this.prices[event] * qty).pipe(delay(1000));
  }
}
