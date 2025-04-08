import { createName, getRandomInt, isChatMessage, isSocketMessageGuard, parseToJson } from './utils'
import { MESSAGE_ENUM, SocketMessage, SocketUser } from './message.type'
import { App, WebSocket, SHARED_COMPRESSOR } from 'uWebSockets.js'
import { v4 } from 'uuid'

const app = App()

const decoderUTF8 = new TextDecoder('utf-8')

const SOCKETS: (WebSocket<unknown> & SocketUser)[] = []

app.ws('/', {
  compression: SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 10,
  maxBackpressure: 1024,
  open(ws: WebSocket<unknown> & SocketUser) {
    ws.id = v4()
    ws.username = createName(getRandomInt(), SOCKETS)

    console.log('WebSocket opened')

    ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED)
    ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED)
    ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE)

    SOCKETS.push(ws)
    // indicate message type so the client can filter with a switch statement later on
    let selfMsg: SocketMessage = {
      type: MESSAGE_ENUM.SELF_CONNECTED,
      body: {
        id: ws.id,
        nickname: ws.username,
      },
    }

    let pubMsg: SocketMessage = {
      type: MESSAGE_ENUM.CLIENT_CONNECTED,
      body: {
        id: ws.id,
        nickname: ws.username,
      },
    }

    // send to connecting socket only
    ws.send(JSON.stringify(selfMsg))

    // send to *all* subscribed sockets
    app.publish(MESSAGE_ENUM.CLIENT_CONNECTED, JSON.stringify(pubMsg))
  },
  message(ws: WebSocket<unknown> & SocketUser, message: ArrayBuffer, isBinary) {
    const clientMsg = parseToJson(message, decoderUTF8)

    if (clientMsg === undefined) return
    if (!isSocketMessageGuard(clientMsg)) {
      ws.send(`Client message must be in "SocketMessage" format :
        {
          "type": MESSAGE_ENUM,
          "body": {
            "id": string,
            "nickname": string
          }
        }`)
      console.error('Client message must be in "SocketMessage" format', clientMsg)
      return
    }

    let serverMsg = {}

    console.log('Received message:', clientMsg, isBinary)

    switch (clientMsg.type) {
      case MESSAGE_ENUM.CLIENT_MESSAGE:
        if (!isChatMessage(clientMsg.body)) {
          ws.send(`Chat message must be in this format :
            {
              "type": ${MESSAGE_ENUM.CLIENT_MESSAGE},
              "body": {
                "id": string,
                "nickname": string,
                "message": string
              }
            }`)
          return
        }
        serverMsg = {
          type: MESSAGE_ENUM.CLIENT_MESSAGE,
          sender: ws.username,
          body: clientMsg.body,
        }

        app.publish(MESSAGE_ENUM.CLIENT_MESSAGE, JSON.stringify(serverMsg))
        break
      default:
        console.log('Unknown message type.')
    }
  },
  close(ws: WebSocket<unknown> & { id: string; username: string }) {
    SOCKETS.find((socket, index) => {
      if (socket && socket.id === ws.id) {
        SOCKETS.splice(index, 1)
      }
    })

    let pubMsg = {
      type: MESSAGE_ENUM.CLIENT_DISCONNECTED,
      body: {
        id: ws.id,
        nickname: ws.username,
      },
    }

    app.publish(MESSAGE_ENUM.CLIENT_DISCONNECTED, JSON.stringify(pubMsg))
    console.log('WebSocket closed')
  },
})

app.listen(3000, (socket) => {
  if (socket) {
    console.log('Server listening on port 3000')
  } else {
    console.log('Failed to listen on port 3000')
  }
})
