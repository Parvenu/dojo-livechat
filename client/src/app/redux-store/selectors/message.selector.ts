import { createSelector } from '@ngrx/store';
import { messagesFeature } from '../reducers/message.reducer';

export const selectMessageListViewModel = createSelector(messagesFeature.selectMessages, (messages) => ({
  messages,
}));
