import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventTicketsComponent } from './event-tickets/event-tickets.component';

@NgModule({
  declarations: [AppComponent, EventTicketsComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
