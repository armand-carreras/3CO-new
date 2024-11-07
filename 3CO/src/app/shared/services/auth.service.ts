import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import * as crypto from 'crypto-js';
import { LoadingController } from '@ionic/angular';

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

  private isGuest: boolean = true;

  constructor(
    private router: Router,
    private toastServ: ToastService,
    private http: HttpClient,
    private storage: StorageService,
    private userService: UserService,
    private loadController: LoadingController
  ) {
    this.loadToken();
  }


  get isUserGuest() {
    return this.isGuest;
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
    const hashPassword = crypto.SHA256(password).toString();
    const body = {'email': email, 'password': hashPassword};
    this.userService.setPassword(password);

    return this.http.post<{token: string}>(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders }
    ).pipe(
      tap((res)=> {
        console.log("Resource from login: ",res);
        this.setToken(res.token);
        this.isGuest = false;
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
  public async register(user: string, email: string, password: string): Promise<any> {
    const URL = environment.paths.base_api+environment.paths.post_get_user;
    const hashPassword = crypto.SHA256(password).toString();
    const body = {
      "name": user,
      "email": email,
      "password": hashPassword
    };
    
    console.log('Starting Registration');

    const loader = await this.loadController.create({message:'Registering'});
    loader.present();

    return await firstValueFrom(this.http.post<User>(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders, observe: 'response' }
    ).pipe(
      tap(async (res)=>{
          console.log('Successfull Registration', res);
          // Redirect to login page after successful registration
          (await (this.toastServ.setToast('Successfull registration','success',600))).present();
          this.router.navigate(['auth/login'], {queryParams: {email: email, password: password}});
      }),
      catchError(async error=>{
        console.error(error);
        (await (this.toastServ.setToast('Error while trying to register try again','danger',600))).present();
      }),
    )).finally(()=>loader.dismiss());
  }

}


const key = crypto.enc.Hex.parse(environment.passphrase);
const iv = crypto.enc.Hex.parse(environment.AESiv);
// encrypt
export const aesEncryptor = crypto.algo.AES.createEncryptor(key, { iv: iv });
export const aesDecryptor = crypto.algo.AES.createDecryptor(key, { iv: iv });