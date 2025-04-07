import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { io } from 'socket.io-client';
@Injectable()
export class WebsocketService {
  private webSocketMessagesSubject = new Subject();
  public get webSocketMessages$() {
    return this.webSocketMessagesSubject.asObservable();
  }
  constructor() {

const MESSAGE_ENUM = Object.freeze({
  SELF_CONNECTED: "SELF_CONNECTED",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  CLIENT_MESSAGE: "CLIENT_MESSAGE"
})

const ws = new WebSocket('ws://localhost:3000');
ws.onopen = evt => {
  ws.onmessage = evt => {
    let msg = JSON.parse(evt.data);
    switch (msg.type) {
      case MESSAGE_ENUM.CLIENT_MESSAGE:
        console.log(`${msg.sender} says: ${msg.body}`);
        break;
      case MESSAGE_ENUM.CLIENT_CONNECTED:
        console.log(`${msg.body.name} has joined the chat.`);
        break;
      case MESSAGE_ENUM.CLIENT_DISCONNECTED:
        console.log(`${msg.body.name} has left the chat.`);
        break;
      case MESSAGE_ENUM.SELF_CONNECTED:
        console.log(`You are connected! Your username is ${msg.body.name}`);
        break;
      default:
        console.log("Unknown message type.");
    }
  }
}
    // const socket = io('http://localhost:8080');
    // socket.on('connect', function () {
    //   console.log('Connected');
    //   socket.emit('ping')
    //   socket.emit('chat');
    // });
    // socket.on('message', (data) => {
    //   console.log('message', data);
    //   this.webSocketMessagesSubject.next(data)
    // });
    // socket.on('exception', function (data) {
    //   console.log('event', data);
    // });
    // socket.on('disconnect', function () {
    //   console.log('Disconnected');
    // });
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
