import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { SocketMessage } from '../../types/message.type'
export const MessagesApiActions = createActionGroup({
  source: 'Messages API',
  events: {
    'Load messages': emptyProps(),
    'Retrieved Messages List': props<{ messages: ReadonlyArray<SocketMessage> }>(),
    'Error Loading Messages': props<{ errorMsg: string }>(),
  },
})
