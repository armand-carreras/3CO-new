import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RequestsService } from 'src/app/shared/services/requests.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public name: string = '';
  public email: string = '';
  public password: string = '';
  public repassword: string = '';

  constructor(private router: Router,
    private authServ: AuthService
  ) { }

  ngOnInit() {
  }

  get canRegister() {
    return this.password.length>3 && this.password===this.repassword && this.name.length>3 && this.email.includes('@');
  }

  startAsGuest() {
    this.router.navigateByUrl('/tabs')
  }

  public register() {
    firstValueFrom(this.authServ.register(this.name, this.email, this.password));
  }

}
