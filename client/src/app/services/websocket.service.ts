import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { MessagesApiActions } from '../redux-store/actions/message.action'
import { ChatMessage, MESSAGE_ENUM } from '../types/message.type'
@Injectable()
export class WebsocketService {
  private ws!: WebSocket
  private webSocketMessagesSubject = new Subject()
  public get webSocketMessages$() {
    return this.webSocketMessagesSubject.asObservable()
  }
  constructor(private readonly store: Store) {}

  public connect() {
    this.ws = new WebSocket('ws://localhost:3000')
    this.ws.onopen = (evt) => {
      this.ws.onmessage = (evt) => {
        let msg = JSON.parse(evt.data)
        switch (msg.type) {
          case MESSAGE_ENUM.CLIENT_MESSAGE:
            this.store.dispatch(MessagesApiActions.retrievedMessagesList({ messages: [msg] }))
            break
          case MESSAGE_ENUM.CLIENT_CONNECTED:
            this.store.dispatch(
              MessagesApiActions.retrievedMessagesList({
                messages: [
                  {
                    type: MESSAGE_ENUM.CLIENT_CONNECTED,
                    body: {
                      id: msg.id,
                      nickname: msg.body.nickname,
                      message: `${msg.body.nickname} has joined the chat.`,
                    },
                  },
                ],
              }),
            )
            break
          case MESSAGE_ENUM.CLIENT_DISCONNECTED:
            this.store.dispatch(
              MessagesApiActions.retrievedMessagesList({
                messages: [
                  {
                    type: MESSAGE_ENUM.CLIENT_DISCONNECTED,
                    body: {
                      id: msg.id,
                      nickname: msg.body.nickname,
                      message: `${msg.body.nickname} has left the chat.`,
                    },
                  },
                ],
              }),
            )
            break
          case MESSAGE_ENUM.SELF_CONNECTED:
            this.store.dispatch(
              MessagesApiActions.retrievedMessagesList({
                messages: [
                  {
                    type: MESSAGE_ENUM.SELF_CONNECTED,
                    body: { id: msg.id, nickname: msg.body.nickname, message: `You are connected !` },
                  },
                ],
              }),
            )
            break
          default:
            console.log('Unknown message type.')
        }
      }
    }
  }

  public send(message: ChatMessage) {
    const payload = {
      type: MESSAGE_ENUM.CLIENT_MESSAGE,
      body: {
        id: message.id,
        message: message.message,
        nickname: message.nickname,
      },
    }
    this.ws.send(new TextEncoder().encode(JSON.stringify(payload)))
  }
}
