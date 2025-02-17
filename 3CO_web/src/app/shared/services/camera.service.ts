import { Injectable } from '@angular/core';
import { Camera, CameraResultType, PermissionStatus, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {}



  public async getPhoto(): Promise<Photo> {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      correctOrientation: true,
      width: 800,
      height: 600,
    });
    if(image.base64String)
    image.base64String = await this.resizeAndPadBase64Img(image.base64String, 800, 600);
    return image;
  }


  public async checkAndRequestPermissions(): Promise<PermissionStatus> {
    const permission = await Camera.checkPermissions();
    if(permission.camera !== 'granted') {
      return await Camera.requestPermissions();
    }
    return permission;
  }




  private resizeAndPadBase64Img(base64: string, targetWidth: number, targetHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64}`;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the canvas size to the target dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;
  
        // Calculate the aspect ratio of the image
        const aspectRatio = img.width / img.height;
  
        let drawWidth, drawHeight;
        let offsetX = 0, offsetY = 0;
  
        // Calculate the size to draw based on the aspect ratio
        if (img.width / img.height > targetWidth / targetHeight) {
          drawWidth = targetWidth;
          drawHeight = targetWidth / aspectRatio;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          drawHeight = targetHeight;
          drawWidth = targetHeight * aspectRatio;
          offsetX = (targetWidth - drawWidth) / 2;
        }
  
        // Fill the canvas with black color (or any other background color)
        ctx?.fillRect(0, 0, targetWidth, targetHeight);
  
        // Draw the image on the canvas, centered, with the calculated offsets
        ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  
        // Get the padded image as base64
        const resizedBase64 = canvas.toDataURL('image/jpeg', 1.0);
  
        // Remove the prefix 'data:image/jpeg;base64,' to keep it consistent with CameraResultType.Base64
        const resizedBase64Str = resizedBase64.split(',')[1];
        resolve(resizedBase64Str);
      };
      img.onerror = (err) => {
        reject(err);
      };
    });
  }

}
