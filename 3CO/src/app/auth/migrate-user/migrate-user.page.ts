import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TermsAndConditionsComponent } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-migrate-user',
  templateUrl: './migrate-user.page.html',
  styleUrls: ['./migrate-user.page.scss'],
})
export class MigrateUserPage implements OnInit {

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
  
   
     public async migrateUser() {
       try {
         await this.authServ.migrateGuest(this.name, this.email, this.password);
         this.router.navigate(['auth/login'], {queryParams: {email: this.email, password: this.password} });
       } catch(e) {
         console.error('Something went wrong during migrateUser phase. --authServ.migrateUser ', e);
         
       }
     }

     async openTermsModal() {
      const modal = await this.modalController.create({
        component: TermsAndConditionsComponent,
      });
  
      return await modal.present();
    }

}
