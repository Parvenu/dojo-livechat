import { createFeature, createReducer, on } from '@ngrx/store';
import { Message } from '../../types/message.type';
import { MessagesApiActions } from '../actions/message.action';

export interface MessagesState {
  messages: Message[];
}

export const initialState: MessagesState = {
  messages: [
    { id: 'a', message: '1er test', sender: 'unPseudo' },
    { id: 'b', message: ' une response', sender: 'pseudob' },
    { id: 'c', message: 'test teste st', sender: 'unPseudo' },
    { id: 'd', message: 'ouiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', sender: 'ofjrheigh' },
  ],
};

export const messagesFeature = createFeature({
  name: 'messages',
  reducer: createReducer(
    initialState,
    on(MessagesApiActions.retrievedMessagesList, (state, { messages }) => {
      return { messages: state.messages.concat(messages) };
    }),
  ),
});

export const { name, reducer, selectMessagesState, selectMessages } = messagesFeature;
