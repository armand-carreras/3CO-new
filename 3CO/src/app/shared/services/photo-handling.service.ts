import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoHandlingService {

  constructor( private toast: ToastService,
    private storage: StorageService,
    private loader: LoadingController) {
    console.log('Photo Handling Service Initialized');
  }


  async sendBase64ImageToEndpoint(base64File: string, isGuest: boolean = true, jwtToken?: string): Promise<any> {
    const formData = new FormData();
    const blob = await this.base64toBlob(base64File);
    formData.append('file', blob, 'file.jpg');
    if (isGuest) {
      const guestID = await this.storage.getGuestID();
      formData.append('guest', 'true')
      formData.append('guest_name', guestID);
    }
  
    const headers: any = {
      'Accept': 'application/json',
    };
    if (!isGuest && jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }
  
    try {
      const response = await fetch(
        `${environment.paths.base_detection_api}${environment.paths.image_detection}`,
        {
          method: 'POST',
          headers: headers,
          body: formData,
        }
      );
  
      if (response.status === 401) {
        this.toast.presentAutoDismissToast('Error: Unauthorized. Please check your token or authentication.', 'danger');
        throw new Error('Unauthorized access. Check token or authentication.');
      } else if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        if (data.message === 'No labels could be detected in the image') {
          this.toast.presentAutoDismissToast('No labels detected in the provided image.', 'warning');
        } else {
          this.toast.presentAutoDismissToast('Image recognizion successful', 'success');
        }
        return data;
      } else if (response.status === 500) {
        this.toast.presentAutoDismissToast('Error: Server encountered an issue. Please try again later.', 'danger');
        throw new Error('Internal Server Error.');
      } else {
        this.toast.presentAutoDismissToast(`Unhandled response status: ${response.status}`, 'danger');
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Fetch request failed:', JSON.stringify(error));
      throw error; // Rethrow the error to handle it in the calling function
    }
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
}