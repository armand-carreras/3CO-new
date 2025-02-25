import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import * as crypto from 'crypto-js';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private postHeaders: HttpHeaders = new HttpHeaders({
    'Accept': '*/*',
    'Content-Type': 'application/json',
  });

  private userToken: BehaviorSubject<string> = new BehaviorSubject('');
  private userLoggedIn: boolean = false;
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

  get token() {
    return this.userToken.getValue();
  }

  get isLoggedIn() {
    return this.userLoggedIn;
  }

  getToken() {
    return this.userToken.value;
  }

  async loadToken() {
    const token = await this.storage.getToken() || '';
    if(token){
      this.userToken.next(token);
    }
  }

  public async setAsGuest() {
    this.isGuest = true;
    try {
      const isGuestInServer = await this.storage.isGuestInServer()
      if(!isGuestInServer) {
        console.log('Guest not registered, proceding to register device');
        await this.setGuestInServer();
        await this.storage.setGuestInServer();
      }
      this.userLoggedIn = true;
      this.storage.storeKeepMeLoggedIn(false);
    } catch(error) {
      console.error(error);
    }
  }

  public setAsRegularUser() {
    this.isGuest = false;
  }

  public setAsLoggedIn() {
    this.userLoggedIn = true;
  }
  public async logoutUser() {
    this.userLoggedIn = false;
    this.userService.setAsGuest();
    await this.setAsGuest();
  }


  public setToken(token: string) {
    if(token!==null && token!==undefined && token!== ''){
      console.log('Setting up Token', token);
      this.userToken.next(token);
      this.isGuest=false;
      this.userService.setToken(token);
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
    const URL = `${environment.paths.base_api}${environment.paths.login}`;
    const hashPassword = crypto.SHA256(password).toString();
    const body = { email: email, password: hashPassword };
    this.userService.setPassword(password);

    return this.http.post<{ token: string }>(
      URL,
      body,
      { headers: this.postHeaders }
    ).pipe(
      tap(async (res) => {
        console.log("Resource from login: ", res);
        this.setToken(res.token);
        await this.userService.loadUser(res.token);
        this.userService.setAsNoGuest();
        this.isGuest = false;
        this.userLoggedIn = true;
      }),
      map((res) => res.token),
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 401) {
          message = 'Unauthorized access. Use valid credentials.';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        } else if (error.status === 500) {
          message = 'Internal server error. Please try again later.';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        } else if (error.status === 403) {
          message = "Email not verified. Please verify your email before logging in.";
          this.toastServ.presentAutoDismissToast(message, 'danger');           
        } else {
          message = 'An unexpected error occurred.';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(message));
      })
    );
  }



  
  public async autoLoginKeepMeSignedInUser(token: string) {
    try {
      console.log('trying to log in loading users');
      const user = await this.userService.loadUser(token);
      this.setToken(token);
      console.log('proceeding');
      return user;
    } catch(error) {
      console.error('gets an error', error);
      throw error;
    }
  }



public async deleteUser() {
    const token = await this.storage.getToken();
    if(token) {
      const heads: HttpHeaders = new HttpHeaders()
        .append('Authorization', `Bearer ${token}`)
      await firstValueFrom(
        this.http.delete(
          `${environment.paths.base_api}${environment.paths.post_get_user}`,
          {headers: heads}
        ).pipe(
          tap(async (res) => {
            console.log(res);
            await this.toastServ.presentAutoDismissToast('Account Deleted', 'success');
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.toastServ.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
            } else if (error.status === 500) {
              this.toastServ.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
            } else {
              this.toastServ.presentAutoDismissToast('An unexpected error occurred.', 'danger');
            }
            // Re-throw the error so it can still be handled by other parts of the code, if necessary.
            return throwError(() => new Error(error.error.message));
          })
        )
      );
    }
  }



  /**
   * @description  Register for users
   * @method POST
   * @param user Username of the user
   * @param email Email of the user
   * @param password Password of the user
   */
  public async register(user: string, email: string, password: string, gender: string): Promise<any> {
    const URL = environment.paths.base_api+environment.paths.register;
    const hashPassword = crypto.SHA256(password).toString();
    const body = {
      "name": user,
      "email": email,
      "password": hashPassword
    };
    
    console.log('Starting Registration');

    const loader = await this.loadController.create({message:'Registering'});
    loader.present();

    return await firstValueFrom(this.http.post(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders, observe: 'response' }
    ).pipe(
      tap(async (res)=>{
          // Redirect to login page after successful registration
          console.log(res);
          (await (this.toastServ.setToast('Successfull registration','success',600))).present();
          this.setUserIntoStorage(user, email, password, gender);
          
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastServ.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
        } else if (error.status === 500) {
          this.toastServ.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
        } else {
          this.toastServ.presentAutoDismissToast('An unexpected error occurred.', 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(error.error.message));
      })
    )).finally(()=>loader.dismiss());
  }



  





  /**
     * @description  Migration process from guest to User
     * @method POST
     * @param username Username of the user
     * @param email Email of the user
     * @param password Password of the user
     */
  public async migrateGuest(user: string, email: string, password: string, gender?: string): Promise<any> {
    const guestID = await this.storage.getGuestID();
    const URL = environment.paths.base_api+"guest"+environment.paths.migrateGuest;
    const hashPassword = crypto.SHA256(password).toString();
    const body = {
      "guest": guestID,
      "username": user,
      "email": email,
      "password": hashPassword
    };
    
    console.log('Starting Registration');

    const loader = await this.loadController.create({message:'Registering'});
    loader.present();

    return await firstValueFrom(this.http.post(
      URL,
      JSON.stringify(body),
      { headers: this.postHeaders, observe: 'response' }
    ).pipe(
      tap(async (res)=>{
          // Redirect to login page after successful registration
          console.log(res);
          (await (this.toastServ.setToast('Successfull registration','success',600))).present();
          this.setUserIntoStorage(user, email, password, gender);
          this.logoutUser();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastServ.presentAutoDismissToast('Unauthorized access. Please log in again.', 'danger');
        } else if (error.status === 500) {
          this.toastServ.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
        } else {
          this.toastServ.presentAutoDismissToast('An unexpected error occurred.', 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(error.error.message));
      })
    )).finally(()=>loader.dismiss());
  }


  /**
     * @description  Login for users
     * @method POST
     * @param email Email of the user
     * @param password Password of the user
     */
  public resendValidationCode(email: string) {
    const URL = `${environment.paths.base_api}resend_validation_code`;
    const body = { email: email };

    return this.http.post(
      URL,
      body,
      { headers: this.postHeaders }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 404) {
          message = 'Email not found';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        } else if (error.status === 500) {
          message = 'Internal server error. Please try again later.';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        } else {
          message = 'An unexpected error occurred.';
          this.toastServ.presentAutoDismissToast(message, 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(message));
      })
    );
  }


  public async recover(email: string) {
    
    const URL = environment.paths.base_api+environment.paths.recover;
    const body = {
      "email":email
    };
    console.log('body',JSON.stringify(body));
    console.log('Starting recovering');

    const loader = await this.loadController.create({message:'Recovering'});
    loader.present();

    return await firstValueFrom(this.http.post(
      URL,
      JSON.stringify(body),
      { headers: new HttpHeaders().append('Content-Type', 'application/json'), observe: 'response' }
    ).pipe(
      tap(async (res)=>{
        console.log('recovering response: ',res);
          // Redirect to login page after successful registration
          (await (this.toastServ.setToast('Check your email inbox!','success',700))).present();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toastServ.presentAutoDismissToast('User not found', 'danger');
        } else if (error.status === 500) {
          this.toastServ.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
        } else {
          this.toastServ.presentAutoDismissToast('An unexpected error occurred.', 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(error.error.message));
      })
    )).finally(()=>loader.dismiss());
  }


  


  private async setGuestInServer() {
    const guestName = await this.storage.getGuestID();
    const body = {
      name: guestName
    };
    const URL = environment.paths.base_api+'guest';

    return firstValueFrom(this.http.post(
      URL,
      JSON.stringify(body),
      { headers: new HttpHeaders().append('Content-Type', 'application/json'), observe: 'response' }
    ).pipe(
      tap(async (res)=>{
        console.log('GuestInServer: ', res);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toastServ.presentAutoDismissToast('Address not found', 'danger');
        } else if (error.status === 500) {
          this.toastServ.presentAutoDismissToast('Internal server error. Please try again later.', 'danger');
        } else {
          this.toastServ.presentAutoDismissToast('An unexpected error occurred.', 'danger');
        }
        // Re-throw the error so it can still be handled by other parts of the code, if necessary.
        return throwError(() => new Error(error.error.message));
      })
    ))
  }



  private setUserIntoStorage(user: string, email: string, password: string, gender?: string) {
    
    let avatarImagePath: string = '/assets/avatar/unisex_avatar.png';
    switch(gender) {
      case 'man':
        avatarImagePath = 'assets/avatar/male-avatar.png'
        break;
      case 'woman':
        avatarImagePath = 'assets/avatar/female-avatar.png'
        break;
      default:
        avatarImagePath = 'assets/avatar/unisex_avatar.png';
        break;
    }

    this.userService.setUser(
      {
        name: user,
        email: email,
        password: password,
        avatarImg: avatarImagePath,
        rewards: 0,
        scans: 0
      }
    )
  }



  



  


}


const key = crypto.enc.Hex.parse(environment.passphrase);
const iv = crypto.enc.Hex.parse(environment.AESiv);
// encrypt
export const aesEncryptor = crypto.algo.AES.createEncryptor(key, { iv: iv });
export const aesDecryptor = crypto.algo.AES.createDecryptor(key, { iv: iv });