import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessagesService } from '../../services/messages.service';
import { MessagesApiActions } from '../actions/message.action';
@Injectable()
export class MessageEffects {
  public loadMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MessagesApiActions.loadMessages),
      exhaustMap(() =>
        this.messagesService.getMessages().pipe(
          map((messages) => MessagesApiActions.retrievedMessagesList({ messages })),
          catchError((error: { message: string }) =>
            of(MessagesApiActions.errorLoadingMessages({ errorMsg: error.message })),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private messagesService: MessagesService,
  ) {}
}
