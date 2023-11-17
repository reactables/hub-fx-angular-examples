import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventTypes, FetchPricePayload } from '@hub-fx/examples';

export class TicketService {
  static prices = {
    [EventTypes.ChiliCookOff]: 20,
    [EventTypes.ItchyAndScratchyMovie]: 40,
    [EventTypes.GrammarRodeo]: 50,
  };

  constructor() {}

  static getPrice({ event, qty }: FetchPricePayload) {
    return of(TicketService.prices[event] * qty).pipe(delay(1000));
  }
}
