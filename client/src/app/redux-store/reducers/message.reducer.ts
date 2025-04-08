import { createFeature, createReducer, on } from '@ngrx/store'
import { SocketMessage } from '../../types/message.type'
import { MessagesApiActions } from '../actions/message.action'

export interface MessagesState {
  messages: SocketMessage[]
}

export const initialState: MessagesState = {
  messages: [],
}

export const messagesFeature = createFeature({
  name: 'messages',
  reducer: createReducer(
    initialState,
    on(MessagesApiActions.retrievedMessagesList, (state, { messages }) => {
      return { messages: state.messages.concat(messages) }
    }),
  ),
})

export const { name, reducer, selectMessagesState, selectMessages } = messagesFeature
