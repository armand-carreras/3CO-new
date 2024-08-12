import { Injectable } from '@angular/core';
import { Camera, CameraResultType, PermissionStatus, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {}



  public async getPhoto(): Promise<Photo> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,

    });
    return image;
  }


  public async checkAndRequestPermissions(): Promise<PermissionStatus> {
    const permission = await Camera.checkPermissions();
    if(permission.camera === 'denied') {
      return await Camera.requestPermissions();
    }
    return permission;
  }
}
