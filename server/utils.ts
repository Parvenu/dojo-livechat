import { ChatMessage, SocketMessage, SocketMessageBody } from 'message.type'

export function parseToJson(message: ArrayBuffer, decoder: TextDecoder): object | undefined {
  try {
    return JSON.parse(decoder.decode(message))
  } catch (error) {
    console.error('Unable to parse to JSON')
  }
}

export function isSocketMessageGuard(message: any | SocketMessage): message is SocketMessage {
  if ('type' in message && 'body' in message) return true
  return false
}

export function isChatMessage(messageBody: SocketMessageBody): messageBody is ChatMessage {
  if (typeof messageBody.id === 'string' && 'nickname' in messageBody && 'message' in messageBody) return true
  return false
}

// functions to help us generate random usernames
export function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(9999))
}

export function createName(randomInt, SOCKETS) {
  return SOCKETS.find((ws) => ws['name'] === `user-${randomInt}`)
    ? createName(getRandomInt(), SOCKETS)
    : `user-${randomInt}`
}
