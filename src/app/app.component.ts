import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { auth } from 'firebase';

export interface Item { message: string, name: string; }

@Component({
  selector: 'cq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: Observable<Item[]>;
  name: any;
  chatMessage: string = '';

  constructor(public _afauth: AngularFireAuth, public _afdb: AngularFireDatabase){

    this.items = _afdb.list<Item>('/messages', ref => ref.limitToLast(50)).valueChanges();

    this._afauth.authState.subscribe(auth => {
      if (auth) {
        this.name = auth.displayName;
      }
    })
  }

  login() {
    this._afauth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this._afauth.auth.signOut();
  }

  chatSend(theirMessage: string) {
    const itemsRef = this._afdb.list<Item>('/messages');
    itemsRef.push({ message: theirMessage, name: this.name });
    this.chatMessage = '';
  }

}
