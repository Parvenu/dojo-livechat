import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Message } from './types/message.type';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { WebsocketService } from './services/websocket.service';

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
  providers: [WebsocketService, {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' }}], // removing the "hint" section under our mat-input
})
export class AppComponent implements OnInit {
  public pseudoInputCtrl!: FormControl<string>;
  public messageInputCtrl!: FormControl<string>;
  public messages$!: Observable<Message[]>;
  title = 'livechat';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<{ messages: { messages: Message[] } }>,
    private readonly wsService: WebsocketService,
  ) {}

  public ngOnInit() {
    this.messages$ = this.store.select(({ messages }) => messages.messages).pipe(tap(console.log));
    this.pseudoInputCtrl = this.formBuilder.control<string>('Moi', { nonNullable: true });
    this.messageInputCtrl = this.formBuilder.control<string>('', { nonNullable: true });
    this.fetchMessages();
  }

  public sendMessage() {
    const message = {
      id: new Date().toISOString(), // just for testing pruposes FIXME
      sender: this.pseudoInputCtrl.value,
      message: this.messageInputCtrl.value,
    };
    console.log(message);
    this.messageInputCtrl.reset();
  }

  private fetchMessages() {
    this.wsService.webSocketMessages$.subscribe(console.log);
  }
}
