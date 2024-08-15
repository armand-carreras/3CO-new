import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastController) { }

  public async setToast(message: string, color?: PredefinedColors, duration?: number): Promise<HTMLIonToastElement> {
    const toast = await this.toast.create({
      color: color ?? 'danger',
      duration: duration ?? 2000,
      message: message,
    });
    return toast;
  }

  public async setAnimatedToast(message: string, color?: PredefinedColors, duration?: number): Promise<HTMLIonToastElement> {
    const toast = await this.toast.create({
      color: color ?? 'danger',
      duration: duration ?? 2000,
      message: message,
      animated: true,
    });
    return toast;
  }

  public async presentAutoDismissToast(message: string, color?: PredefinedColors, duration?: number): Promise<void> {
    const toast = await this.toast.create({
      color: color ?? 'danger',
      duration: duration ?? 1500,
      message: message,
      animated: true,
    });
    toast.present();
  }

}

export type PredefinedColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark';
