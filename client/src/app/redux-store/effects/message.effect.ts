import { Injectable } from '@angular/core'
import { catchError, exhaustMap, map, of } from 'rxjs'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { MessagesApiActions } from '../actions/message.action'
@Injectable()
export class MessageEffects {
  constructor(private actions$: Actions) {}
}
