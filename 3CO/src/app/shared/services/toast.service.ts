import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastController) { }

  public async info(msg: string){
    const toast = await this.toast.create({
      message: msg,
      animated: true,
      color: 'success',
      duration: 1500
    })
    toast.present();
    return toast;
  }

  public async warning(msg: string){
    const toast = await this.toast.create({
      message: msg,
      animated: true,
      color: 'warning',
      duration: 1500
    })
    toast.present();
    return toast;
  }

  public async error(msg: string){
    const toast = await this.toast.create({
      message: msg,
      animated: true,
      color: 'danger',
      duration: 1500
    })
    toast.present();
    return toast;
  }
}
