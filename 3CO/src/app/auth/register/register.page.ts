import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UserService } from 'src/app/shared/services/user.service';

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
  public gender: string = 'none';

  constructor(private router: Router,
    private authServ: AuthService,
    private userServ: UserService
  ) { }

  ngOnInit() {
  }

  get canRegister() {
    return this.password?.length>3 && this.password===this.repassword && this.name?.length>=3 && this.email.includes('@');
  }

  startAsGuest() {
    this.router.navigateByUrl('/tabs')
  }

  public async register() {
    await this.authServ.register(this.name, this.email, this.password, this.gender);
  }

}
