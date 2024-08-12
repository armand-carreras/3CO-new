import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoHandlingService {

  constructor( private toast: ToastService,
    private http: HttpClient,
    private loader: LoadingController) {
    console.log('Photo Handling Service Initialized');
  }

  sendBase64ImageToEndpoint(base64File: string) {
    const dateNow = new Date().toISOString();
    const formData = new FormData();
    formData.append('file', this.base64toBlob(base64File), 'file.jpg');

    return this.http.post<any>(environment.endpoints.base+environment.endpoints.image_detection, formData);
  }

  private base64toBlob(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }



  // public async sendBase64ImageToEndpoint( image:  string, endpoint?: string ) {
  //   const body = new FormData();
  //   console.debug(image);
  //   body.append('encoded_image', image);

  //   const url = 'http://127.0.0.1:8000/upload/';
  //   const httpHeaders: HttpHeaders = new HttpHeaders()
  //     .append('accept','multipart/form-data')


  //   const loader = await this.loader.create( { message: "Sending Image..." });
  //   loader.present();
  //   return await firstValueFrom(this.http.post( endpoint ?? url, body, {headers: httpHeaders}))
  //   .then((response)=>{console.log(response)})
  //   .catch((error)=>{console.error('ERROR on request: ', JSON.stringify(error))})
  //   .finally(()=>{loader.dismiss();console.log('request concluded')})

  // }
}
