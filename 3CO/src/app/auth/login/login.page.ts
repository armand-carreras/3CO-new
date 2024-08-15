import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string = '';
  public password: string = '';

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private loaderContl: LoadingController,
    private userService: UserService,
    private toastServ: ToastService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.checkActivatedRoute();
  }




  public async login() {
    //Create and present loader
    const loader = await this.loaderContl.create({message:'Logging in'});
    loader.present();

    //Get token from user
    const token = await firstValueFrom(this.authService.login(this.email, this.password))
    .catch((error: HttpErrorResponse)=>{
      this.toastServ.presentAutoDismissToast(error.error.error,'danger');
      return '';
    })
    .finally(()=>loader.dismiss());

    //Navigate to home
    if ( token ) {
      this.router.navigate(['tabs']);
    } else {
      this.toastServ.setToast('Not able to login try again!', 'danger');
    }
  }





  private checkActivatedRoute() {
    const email = this.activeRoute.snapshot.queryParamMap.get('email');
    const password = this.activeRoute.snapshot.queryParamMap.get('password');
    if (email && password) {
      this.email = email;
      this.password = password;
      this.login();
    } else {
    }
  }
  startAsGuest() {
    this.router.navigateByUrl('/tabs')
  }

}
