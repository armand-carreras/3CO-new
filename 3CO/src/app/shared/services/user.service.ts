import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { RequestsService } from './requests.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<User> = new BehaviorSubject<User>(
    {
      avatarImg: '/assets/avatar/male-avatar.png',
      email: 'guest@3co.com',
      name: 'Guest User',
      password: 'pass',
      scans: 0,
      rewards: 0
    }
  );
  private isGuest: boolean = true;

  private password: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private storage: StorageService) { }

  
  get isUserGuest() {
    return this.isGuest;
  }

  set setUserNotGuest( toggle: boolean ) {
    this.isGuest = toggle;
  }




  //Set user value
  public setUser(user: User) {
    this.user.next(user);
    this.storage.set('user', user);
  }

  //Get User value
  public getUser(): Observable<User> {
    return this.user.asObservable();
  }

  public updateUser(user: User) {
    console.log('user updated to: ', user);
    this.user.next(user);
  }

  public getPassword() {
    return this.password.value;
  }
  public setPassword(pass: string) {
    this.password.next(pass)
  }
}
