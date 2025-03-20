import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private webSocketMessagesSubject = new Subject();
  public get webSocketMessages$() {
    return this.webSocketMessagesSubject.asObservable();
  }
  constructor() {
    const socket = io('http://localhost:8080');
    socket.on('connect', function () {
      console.log('Connected');

      socket.emit('events', { test: 'test' });
      socket.emit('identity', 0, (response: any) => console.log('Identity:', response));
    });
    socket.on('events', function (data) {
      console.log('event', data);
    });
    socket.on('exception', function (data) {
      console.log('event', data);
    });
    socket.on('disconnect', function () {
      console.log('Disconnected');
    });
    /*
    console.log('avant');
    this.webSocket = new Socket({ url: 'http://localhost:8080' });
    console.log('pendant');
    this.webSocket.connect();
    console.log('apres');
    this.webSocket.on('connected', () => console.log('connected'));
    this.webSocket.on('error', (e) => console.log('error', e));
    */
    // this.initEventListeners();
    // this.webSocket.send('events', 'test');
  }

  /* private initEventListeners() {
    this.webSocket
      .fromEvent('message')
      .pipe(
        tap((data: any) => {
          if (data?.message !== undefined) {
            this.webSocketMessagesSubject.next(data.message);
          }
        }),
      )
      .subscribe();
  }
  */
}
