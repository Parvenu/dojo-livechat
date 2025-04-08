export type ChatMessage = {
  id: string
  message: string
  nickname?: string
}

export type SocketMessage = {
  type: MESSAGE_ENUM
  body: ChatMessage
}

export enum MESSAGE_ENUM {
  SELF_CONNECTED = 'SELF_CONNECTED',
  CLIENT_CONNECTED = 'CLIENT_CONNECTED',
  CLIENT_DISCONNECTED = 'CLIENT_DISCONNECTED',
  CLIENT_MESSAGE = 'CLIENT_MESSAGE',
}
