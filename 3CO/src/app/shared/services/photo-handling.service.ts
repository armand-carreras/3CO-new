import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoHandlingService {

  constructor( private toast: ToastService,
    private http: HttpClient,
    private loader: LoadingController) {
    console.log('Photo Handling Service Initialized');
  }


  async sendBase64ImageToEndpoint(base64File: string, isGuest: boolean = true, jwtToken?: string) {
    const formData = new FormData();
    const blob = await this.base64toBlob(base64File);
    formData.append('file', blob, 'file.jpg');
    if (isGuest) {
        formData.append('guest', 'true');
    }

    const headers: any = {
        'Accept': 'application/json'
    };
    if (!isGuest && jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    /*const response = await firstValueFrom(this.http.post(`${environment.paths.base_detection_api}${environment.paths.image_detection}`,
      formData, {headers:headers}
    ))*/
    
    const response = await fetch(`${environment.paths.base_detection_api}${environment.paths.image_detection}`, {
      method: 'POST',
      headers: headers,
      body: formData,

    }).then(async (response)=>{
      const data = await response.json();
      console.log('HTTP response successful:', JSON.stringify(data));
      return data;
    }).catch((error)=>{
      console.log('Fetch request failed:', JSON.stringify(error));
      alert('An error occurred during the image detection process. Please try again.');
      throw new Error(JSON.stringify(error));
    });
    return response;
  }



  private async base64toBlob(base64Data: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            // Remove any Base64 headers if present (e.g., "data:image/jpeg;base64,")
            const base64String = base64Data.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            // Sanitize and decode the Base64 string
            const byteCharacters = this.decodeBase64(base64String);

            const byteNumbers = new Array(byteCharacters?.length);
            for (let i = 0; i < byteCharacters?.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            resolve(new Blob([byteArray], { type: 'image/jpeg' }));
        } catch (error) {
            console.error('Failed to convert Base64 to Blob: ', error);
            reject(new Error('Error converting Base64 to Blob.'));
        }
    });
}


  private decodeBase64(base64String: string): string {
      try {
          // Try using atob() for decoding
          return atob(base64String);
      } catch (e) {
          // Fallback to polyfill or manual decoding if atob() fails
          console.warn('atob() failed, using fallback: ', e);
          return this.base64DecodePolyfill(base64String);
      }
  }

  private base64DecodePolyfill(base64: string): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let str = '';

      for (let i = 0; i < base64?.length; i += 4) {
          const encoded1 = chars.indexOf(base64[i]);
          const encoded2 = chars.indexOf(base64[i + 1]);
          const encoded3 = chars.indexOf(base64[i + 2]);
          const encoded4 = chars.indexOf(base64[i + 3]);

          const char1 = (encoded1 << 2) | (encoded2 >> 4);
          const char2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
          const char3 = ((encoded3 & 3) << 6) | encoded4;

          str += String.fromCharCode(char1);
          if (encoded3 !== 64) {
              str += String.fromCharCode(char2);
          }
          if (encoded4 !== 64) {
              str += String.fromCharCode(char3);
          }
      }

      return str;
  }


















  /* sendBase64ImageToEndpoint(base64File: string, isGuest: boolean = true, jwtToken?: string) {
    let formData = new FormData();
    console.log('base64Data before conversion: ', base64File);

    // Optional guest field
    if (isGuest) {
        formData.append('guest', 'true');
    }

    try {
        // Convert base64 to Blob
        const blob = this.base64toBlob(base64File);
        formData.append('file', blob, 'file.jpg');
        formData.forEach((res)=>{
          console.log('formData resource: ', res.toString());
        });
    } catch (error) {
        console.error('Error converting Base64 to Blob: ', error);
        return throwError(() => new Error('Image processing error. Please try again.'));
    }

    // Set headers conditionally
    let httpHeaders = new HttpHeaders({
        'Accept': 'application/json'
    });
    if (!isGuest && jwtToken) {
        httpHeaders = httpHeaders.set('Authorization', `Bearer ${jwtToken}`);
    }

    // Send the HTTP POST request
    return this.http.post<any>(`${environment.paths.base_detection_api}${environment.paths.image_detection}`, formData, { headers: httpHeaders })
        .pipe(
            tap((res) => {
                console.log('HTTP response successful: ', res);
            }),
            catchError((error) => {
                console.error('Http form Data: ', JSON.stringify(formData));
                console.error('HTTP Headers : ', JSON.stringify(httpHeaders));
                console.error('HTTP request failed: ', JSON.stringify(error));
                alert('An error occurred during the image detection process. Please try again.');
                return throwError(() => new Error('Error during image detection API call.'));
            })
        );
} */




  /* sendBase64ImageToEndpoint(base64File: string) {
    const dateNow = new Date().toISOString();
    const formData = new FormData();
    console.log('base64Data atob not parsed: ',base64File);
    formData.append('file', this.base64toBlob(base64File), 'file.jpg');

    return this.http.post<any>(environment.paths.base_detection_api+environment.paths.image_detection, formData)
      .pipe(
        tap((res)=>{
          console.log('http response successfull: ', res);
          }
        ),
        catchError((error) => {
          // Log the error and show a helpful message
          console.error('HTTP request failed: ', error);
    
          // Optionally, show a user-friendly message in the UI
          alert('An error occurred during the image detection process. Please try again.');
    
          // Rethrow the error to ensure it can be handled elsewhere if necessary
          return throwError(() => new Error('Error during image detection API call.'));
        })
      );
  } */









  /* private base64toBlob(base64Data: string) {
    console.log('base64Data atob not parsed: ',base64Data);
    const byteCharacters = atob(base64Data);
    console.log('base64Data atob parsed: ',byteCharacters);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
 */


  /* public async sendBase64ImageToUpload( image:  string, endpoint?: string ) {
    const body = new FormData();
    console.debug(image);
    body.append('encoded_image', image);

    const url = 'http://127.0.0.1:8000/upload/';
    const httpHeaders: HttpHeaders = new HttpHeaders()
      .append('accept','multipart/form-data')


    const loader = await this.loader.create( { message: "Sending Image..." });
    loader.present();
    return await firstValueFrom(this.http.post( endpoint ?? url, body, {headers: httpHeaders}))
    .then((response)=>{console.log(response)})
    .catch((error)=>{console.error('ERROR on request: ', JSON.stringify(error))})
    .finally(()=>{loader.dismiss();console.log('request concluded')})

   } */
}
