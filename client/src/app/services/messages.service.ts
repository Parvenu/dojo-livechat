import { Injectable } from '@angular/core';
import { Message } from '../types/message.type';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private mockMessages: Message[] = [
    { id: 'a', message: '1er test', sender: 'unPseudo' },
    { id: 'b', message: ' une response', sender: 'pseudob' },
    { id: 'c', message: 'test teste st', sender: 'unPseudo' },
    { id: 'd', message: 'ouiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', sender: 'ofjrheigh' },
  ];
  constructor() {}
  public getMessages() {
    return of(this.mockMessages) as Observable<Message[]>;
  }
}
