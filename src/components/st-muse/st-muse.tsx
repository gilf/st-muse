import {Component, EventEmitter, Event, Prop, State, Method} from '@stencil/core';
import { MuseClient } from 'muse-js';
import {} from 'rxjs/add/operator/takeUntil';

@Component({
    tag: 'st-muse',
    styleUrl: 'st-muse.scss'
})
export class MuseComponent {
    @Prop() enableAux: boolean;
    @State() connected: boolean;
    @Event() eegReadingsReceived: EventEmitter;
    @Event() telemetryDataReceived: EventEmitter;
    @Event() accelerometerDataReceived: EventEmitter;

    client: MuseClient;

    @Method()
    async connect() {
        if (!this.client) {
            this.client = new MuseClient();
            this.client.connectionStatus.subscribe(connected => {
                this.connected = connected;
            });
        }

        this.client.enableAux = this.enableAux;

        await this.client.connect();
        await this.client.start();

        let disconnected = this.client.connectionStatus.filter(isConnected => !isConnected);

        this.client.eegReadings
            .takeUntil(disconnected)
            .subscribe(reading => {
                this.eegReadingsReceived.emit(reading);
            });

        this.client.telemetryData
            .takeUntil(disconnected)
            .subscribe(telemetry => {
                this.telemetryDataReceived.emit(telemetry);
            });

        this.client.accelerometerData
            .takeUntil(disconnected)
            .subscribe(acceleration => {
                this.accelerometerDataReceived.emit(acceleration);
            });
    }

    @Method()
    disconnect() {
        if (this.client) {
            this.client.disconnect();
        }
    }

    render() {
        return (
            <button onClick={()=> this.connected ? this.disconnect() : this.connect() }>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1" width="20px" height="20px">
                    <g>
                        <path d="M 18.199219 7.199219 L 11 0 L 11 9.5 L 7 5.5 L 5.601563 7 L 10.601563 12 L 5.601563 17 L 7 18.398438 L 11 14.398438 L 11 24 L 18.199219 16.800781 L 13.5 12 Z M 15.300781 7.199219 L 13 9.601563 L 13 5 Z M 15.300781 16.800781 L 13 19.101563 L 13 14.5 Z"></path>
                    </g>
                </svg> <span>{this.connected ? 'Disconnect' : 'Connect'}</span>
            </button>
        );
    }
}
