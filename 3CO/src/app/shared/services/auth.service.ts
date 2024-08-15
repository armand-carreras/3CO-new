import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private postHeaders: HttpHeaders = new HttpHeaders({
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  private token: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private router: Router,
    private toastServ: ToastService,
    private http: HttpClient,
    private storage: StorageService,
    private userService: UserService
  ) {
    this.loadToken();
  }

  get token$() {
    return this.token.asObservable();
  }
  get tokenValue(): string {
    return this.token.getValue();
  }

  getToken() {
    return this.token.value;
  }

  async loadToken() {
    const token = await this.storage.getToken() || '';
    if(token){
      this.token.next(token);
    }
  }

  async setToken(token: string) {
    if(token!==null && token!==undefined && token!== ''){
      console.log('Setting up Token', token);
      this.token.next(token);
      this.storage.storeToken(token);
    } else {
      console.log('Something went wrong, try again!');
    }
  }

  /**
     * @description  Login for users
     * @method POST
     * @param email Email of the user
     * @param password Password of the user
     */
  public login(email: string, password: string): Observable<string> {
    const URL = environment.paths.base_api+environment.paths.login;
    const body = {'email': email, 'password':password};
    this.userService.setPassword(password);
    return this.http.post<{token: string}>(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders }
    ).pipe(
      tap((res)=> {
        console.log("Resource from login: ",res);
        this.setToken(res.token);
      }),
      map((res)=> res.token)
    );
  }

  /**
   * @description  Register for users
   * @method POST
   * @param user Username of the user
   * @param email Email of the user
   * @param password Password of the user
   */
  public register(user: string, email: string, password: string): Observable<any> {
    const URL = environment.paths.base_api+environment.paths.post_get_user;
    const body = {
      "name": user,
      "email": email,
      "password": password
    };
    
    console.log('Starting Registration');
    return this.http.post<User>(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders, observe: 'response' }
    ).pipe(
      tap(async (res)=>{
        if(res.status === 201){
          console.log('Successfull Registration');
          // Redirect to login page after successful registration
          (await (this.toastServ.setToast('Successfull registration','success',1200))).present();
          this.router.navigate(['auth/login'], {queryParams: {email: email, password: password}});
        } else {

        }
      }),
      catchError(async error=>{
        console.error(error);
        (await (this.toastServ.setToast('Error while trying to register try again','danger',1200))).present();
      })
    );
  }

}
