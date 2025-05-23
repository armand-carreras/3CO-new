import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { AuthService } from 'src/app/shared/services/auth.service';
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
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  get canRegister() {
    return this.password?.length>3 && this.password===this.repassword && this.name?.length>=3 && this.email.includes('@');
  }

  startAsGuest() {
    this.router.navigateByUrl('/tabs')
  }

  async openTermsModal() {
        const modal = await this.modalController.create({
          component: TermsAndConditionsComponent,
        });
    
        return await modal.present();
      }

  public async register() {
    try {
      await this.authServ.register(this.name, this.email, this.password, this.gender);
      this.router.navigate(['auth/account-validator'], {queryParams: {email: this.email} });
    } catch(e) {
      console.error('Something went wrong during register phase. --authServ.register ');
      
    }
  }

}
