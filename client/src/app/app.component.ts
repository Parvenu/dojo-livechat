import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field'
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { ChatMessage, MESSAGE_ENUM, SocketMessage } from './types/message.type'
import { filter, Observable, take, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { CommonModule } from '@angular/common'
import { WebsocketService } from './services/websocket.service'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [WebsocketService, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } }], // removing the "hint" section under our mat-input
})
export class AppComponent implements OnInit {
  public pseudoInputCtrl!: FormControl<string>
  public messageInputCtrl!: FormControl<string>
  public messages$!: Observable<SocketMessage[]>
  public MESSAGE_ENUM = MESSAGE_ENUM
  private defaultNickname = 'Anon'
  title = 'livechat'
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<{ messages: { messages: SocketMessage[] } }>,
    private readonly wsService: WebsocketService,
  ) {}

  public ngOnInit() {
    this.messages$ = this.store.select(({ messages }) => messages.messages)
    this.pseudoInputCtrl = this.formBuilder.control<string>(this.defaultNickname, { nonNullable: true })
    this.messageInputCtrl = this.formBuilder.control<string>('', { nonNullable: true })
    this.messages$
      .pipe(
        filter((msg) => msg.length > 0 && msg[0].type === MESSAGE_ENUM.SELF_CONNECTED),
        take(1),
        tap((messages) => this.pseudoInputCtrl.setValue(messages[0]?.body?.nickname || this.defaultNickname)),
      )
      .subscribe()
    this.wsService.connect()
  }

  public sendMessage() {
    const message = {
      id: new Date().toISOString(), // just for testing pruposes FIXME
      nickname: this.pseudoInputCtrl.value,
      message: this.messageInputCtrl.value,
    }
    this.wsService.send(message)
    this.messageInputCtrl.reset()
  }
}
