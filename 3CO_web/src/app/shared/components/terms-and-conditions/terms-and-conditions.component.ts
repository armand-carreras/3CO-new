import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  standalone: false
})
export class TermsAndConditionsComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
