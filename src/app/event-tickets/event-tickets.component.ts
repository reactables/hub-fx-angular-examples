import { Component } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Action, Reducer, HubFactory } from '@hub-fx/core';
import { EventTypes, FetchPricePayload } from '../Models/EventTypes';
import { TicketService } from '../ticket.service';
import { Observable } from 'rxjs';

// Actions
export const SELECT_EVENT = 'SELECT_EVENT';
export const selectEvent = (event: EventTypes): Action<EventTypes> => ({
  type: SELECT_EVENT,
  payload: event,
});

export const SET_QTY = 'SET_QTY';
export const setQty = (qty: number): Action<number> => ({
  type: SET_QTY,
  payload: qty,
});

export const FETCH_PRICE_SUCCESS = 'FETCH_PRICE_SUCCESS';
export const fetchPriceSuccess = (price: number): Action<number> => ({
  type: FETCH_PRICE_SUCCESS,
  payload: price,
});

export const FETCH_PRICE = 'FETCH_PRICE';
export const fetchPrice = (
  payload: FetchPricePayload,
  getPrice: (payload: FetchPricePayload) => Observable<number>
): Action<FetchPricePayload, number> => ({
  type: FETCH_PRICE,
  payload,
  scopedEffects: {
    effects: [
      (actions$) =>
        actions$.pipe(
          switchMap(({ payload }) => getPrice(payload as FetchPricePayload)),
          map((price) => fetchPriceSuccess(price))
        ),
    ],
  },
});

// Reducers
interface ControlState {
  selectedEvent: EventTypes | null;
  qty: number;
}

const initialControlState: ControlState = {
  selectedEvent: null,
  qty: 0,
};

const controlReducer: Reducer<ControlState> = (
  state = initialControlState,
  action
) => {
  switch (action?.type) {
    case SELECT_EVENT:
      return {
        ...state,
        selectedEvent: action.payload as EventTypes,
      };
    case SET_QTY:
      return {
        ...state,
        qty: action.payload as number,
      };
    default:
      return state;
  }
};

interface PriceState {
  calculating: boolean;
  price: number | null;
}

const initialPriceState = {
  calculating: false,
  price: null,
};

const priceReducer: Reducer<PriceState> = (state = initialPriceState) => {};

@Component({
  selector: 'app-event-tickets',
  templateUrl: './event-tickets.component.html',
  styleUrls: ['./event-tickets.component.scss'],
})
export class EventTicketsComponent {}
