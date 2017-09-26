import {Component, EventEmitter, Event, Prop} from '@stencil/core';
import { MuseClient } from 'muse-js';

@Component({
  tag: 'st-muse',
  styleUrl: 'st-muse.scss'
})
export class MuseComponent {
  @Prop() enableAux: boolean;
  @Event() eegReadingsReceived: EventEmitter;
  @Event() telemetryDataReceived: EventEmitter;
  @Event() accelerometerDataReceived: EventEmitter;

  async connect() {
      let client = new MuseClient();
      client.enableAux = this.enableAux;
      await client.connect();
      await client.start();
      client.eegReadings.subscribe(reading => {
          this.eegReadingsReceived.emit(reading);
      });
      client.telemetryData.subscribe(telemetry => {
          this.telemetryDataReceived.emit(telemetry);
      });
      client.accelerometerData.subscribe(acceleration => {
          this.accelerometerDataReceived.emit(acceleration);
      });
  }

  render() {
    return (
      <button onClick={()=> this.connect() }>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
          <g>
            <path d="M 18.199219 7.199219 L 11 0 L 11 9.5 L 7 5.5 L 5.601563 7 L 10.601563 12 L 5.601563 17 L 7 18.398438 L 11 14.398438 L 11 24 L 18.199219 16.800781 L 13.5 12 Z M 15.300781 7.199219 L 13 9.601563 L 13 5 Z M 15.300781 16.800781 L 13 19.101563 L 13 14.5 Z"></path>
          </g>
        </svg> Connect
      </button>
    );
  }
}
