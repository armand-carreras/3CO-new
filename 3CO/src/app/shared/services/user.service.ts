import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { RequestsService } from './requests.service';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Badge } from './badge.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<User> = new BehaviorSubject<User>(
    {
      avatarImg: '/assets/avatar/3_CO_sin_letras.png',
      email: 'guest@3co.com',
      name: 'Guest User',
      password: '',
      scans: 0,
      rewards: 0
    }
  );
  private token: BehaviorSubject<string> = new BehaviorSubject('');
  private userBadges: BehaviorSubject<Badge[]> = new BehaviorSubject<Badge[]>( [] );
  private userLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isGuest: boolean = true;

  private password: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private storage: StorageService, private http: HttpClient) {  }

  
  get isUserGuest() {
    return this.isGuest;
  }

  //Set user value
  public setUser(user: User) {
    if(user) {
      if(!user.avatarImg || user.avatarImg === ''){
        user.avatarImg = 'assets/avatar/unisex_avatar.png'
      }
      this.user.next(user);
      this.storage.set('user', user);
    }
  }

  public async loadUser(token: string) {
    this.token.next(token);
    const fetchedUser = await this.fetchUser();
    this.setUser(fetchedUser);
    console.log('--------- Fetching User:', fetchedUser);

    if(fetchedUser) {this.userLoaded.next(true)} else {this.userLoaded.next(false)}
    return fetchedUser;
}

  
  //Get User value
  public getUserValue(): User {
    return this.user.getValue();
  }

  public setToken(token: string) {
    this.token.next(token);
  }

  public setUserNotGuest(bool: boolean) {
    this.isGuest = bool;
  }

  public storeGender(gender: string) {
    this.storage.set('user_gender', gender);
  }
  public getUserGender() {
    return this.storage.get('user_gender');
  }


  public getPassword() {
    return this.password.value;
  }
  public setPassword(pass: string) {
    this.password.next(pass)
  }

  public updateScans(numberOfScannedLabels: number) {
    let user = this.user.getValue();
    const actualScans = user.scans || 0;
    user.scans = actualScans + numberOfScannedLabels;
    this.user.next(user); 
  }

  public setUserBadges(userBadgeInfo: Badge[]) {
    this.userBadges.next(userBadgeInfo);
  }
  public getUserBadges(): Badge[] {
    return this.userBadges.getValue();
  }

  /**
   * Function to GET user from Server
   * @method GET
   * @returns User
   */
  public fetchUser(): Promise<User> {
    const heads: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${this.token.getValue()}`);
    return firstValueFrom(this.http.get<UserResponse>(`${environment.paths.base_api}${environment.paths.post_get_user}`, {headers: heads})
      .pipe(
        tap((res)=>{
          console.log('-------- Result fetching user', JSON.stringify(res));
          //setUser
          this.setUserBadges(res.badges);
        }),
        map((res)=>{
          const user: User = {name: res.name, email: res.email, scans: res.total_scans, rewards: res.badges.length, avatarImg: 'assets/avatar/unisex_avatar.png'};
          this.user.next(user);
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('--------- Error while fetching Users:', error.status, error.statusText);
          return throwError(() => new Error(`Error while fetching Users: ${error.status} ${error.statusText}`));
        })
      )
    )
  }

  /**
   * Function to update user on server
   * @method PUT
   * @params name?: string, email?: string, password?: string
   */
  public async updateUserDetails(name?: string, email?: string, password?: string): Promise<any> {
    const heads: HttpHeaders = new HttpHeaders()
        .append('Authorization', `Bearer ${this.token.getValue()}`)
        .append('Content-Type', 'application/json');

    // Dynamically construct the body object
    const body: { name?: string; email?: string; password?: string } = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password && password !== '') body.password = password;

    // Perform the PUT request
    await firstValueFrom(this.http.put(`${environment.paths.base_api}${environment.paths.post_get_user}`, body, { headers: heads })
    .pipe(
        tap(async (res) => {
          console.log('Update Response:', res)
        })/* ,
        catchError((error: HttpErrorResponse) => {
            console.error('Error updating user details:', error);
            return throwError(() => new Error(' Failed to update user: ${error.statusText}' ));
        }) */
    ));
    const fetchedUser = await this.fetchUser();
    this.setUser(fetchedUser);
}

  /* public fetchBadges(): Promise<Badge[]> {
    const heads = new HttpHeaders().append('Authorization', `Bearer ${this.token.getValue()}`);
    return firstValueFrom(
      this.http.get<{ badges: Badge[] }>(`${environment.paths.base_api}${environment.paths.user_badges}`, { headers: heads }).pipe(
        tap((result) => {
          console.log('-------- Result fetching Badges', JSON.stringify(result));
          if(result?.badges){
            this.userBadges.next(result.badges);
          } else {
            this.userBadges.next([]);
          }
        }),
        map((res) => res.badges),
        catchError((error: HttpErrorResponse) => {
          console.error('--------- Error while fetching Badges:', error.status, error.statusText);
          return throwError(() => new Error(`Error while fetching Badges: ${error.status} ${error.statusText}`));
        })
      )
    );
  } */

  /* public fetchScans() {
    const heads = new HttpHeaders().append('Authorization', `Bearer ${this.token.getValue()}`);
    return firstValueFrom(
      this.http.get<UserScanInfo>(`${environment.paths.base_api}${environment.paths.user_scans}`, { headers: heads }).pipe(
        tap((result) => {
          console.log('-------- Result fetching Scans', JSON.stringify(result));
          this.userScans.next(result);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('--------- Error while fetching Scans:', error.status, error.statusText);
          if(error.status === 404){
            this.userScans.next({scans:[], count:0})
          }
          return throwError(() => new Error(`Error while fetching Scans: ${error.status} ${error.statusText}`));
        })
      )
    );
  } */

}


export interface UserScanInfo {
  scans: string[];
  count: number;
}

export interface UserResponse {
  name: string,
  email: string,
  total_scans: number,
  badges: Badge[]
}