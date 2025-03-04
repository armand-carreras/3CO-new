import { Injectable, OnInit} from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Label } from '../../models/label';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class LabelSQLiteHandlerService {

  public randomLabel$: BehaviorSubject<Label[] | null> = new BehaviorSubject<Label[] | null>(null);
  
  private dbReady = new BehaviorSubject<boolean>(false);
  private apiUrl = 'https://3coapp.click/web/labels';
  private allList: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  private isAllReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private http: HttpClient,
      private loaderController: LoadingController,
      private toastController: ToastService
    ) {
      
    }


    get featuredLabel$(): Observable<Label[] | null> {
      return this.randomLabel$.asObservable();
    }
    // Labels Observable
    get allLabels(): Observable<Label[]> {
        return this.allList.asObservable();
    }

    get dbReady$() {
      return this.dbReady.asObservable()
    }

    
  async initializeDatabase() {
    const loader = await this.loaderController.create({message: 'Loading information', animated: true});
    await loader.present();
    try {
      await this.loadAll();
      await this.getRandomLabel();
      this.dbReady.next(true);
      //console.log(this.dbReady.value);
    } catch(err) {
      console.error(err);
      await this.toastController.presentAutoDismissToast('Error connecting to DB', 'warning');
    } finally {
      await loader.dismiss();
    }
  }
  
  // Is Labels Get already done?
  allState() {
      return this.isAllReady.asObservable();
  }
    
    

  async loadAll() {
    try {
      const results = await firstValueFrom(this.http.get<Label[]>(`${this.apiUrl}`));
      const labels = results ? await this.parseLabels(results) : [];
      this.allList.next(labels);
      this.isAllReady.next(true);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }

  }
  

 
  async getFromNameString(name: string) {
    try {
      const results = await this.http.get<Label[]>(`${this.apiUrl}/search?name=${name}`).toPromise();
      const labels = results ? await this.parseLabels(results) : [];
      return labels;
    } catch (error) {
      console.error('Error searching labels:', error);
      return [];
    }
  }

  async getFromNamesArray(names: string[]) {
    if (!names.length) return [];
    try {
      const results = await this.http.post<Label[]>(`${this.apiUrl}/search`, { names }).toPromise();
      const labels = results ? await this.parseLabels(results) : [];
      return labels;
    } catch (error) {
      console.error('Error searching labels:', error);
      return [];
    }
  }
  
  
  


  async getRandomLabel() {
    try {
      const result1 = await firstValueFrom(this.http.get<Label>(`${this.apiUrl}/random`));
      const result2 = await firstValueFrom(this.http.get<Label>(`${this.apiUrl}/random`));
      const labels = result1&&result2 ? await this.parseLabels([result1, result2]) : [];
      this.randomLabel$.next(labels || null);
    } catch (err) {
      console.error('Error fetching random label:', err);
    }
  }

  async getFilteredAndSearchedLabels(
    name: string,
    selectedShapes: string[],
    selectedColours: string[],
    selectedCategories: string[]
  ) {
    try {
      const results = await firstValueFrom(
        this.http.post<Label[]>(`${this.apiUrl}/filter-and-search`, {
          name,               // 🔹 Search name
          selectedShapes,     // 🔹 Filter options
          selectedColours,    
          selectedCategories  
        })
      );
  
      const labels = results ? await this.parseLabels(results) : [];
      return labels;
    } catch (error) {
      console.error('Error filtering and searching labels:', error);
      return [];
    }
  }


    private async parseLabels(results: any[]): Promise<Label[]> {
      const labels = await Promise.all(results?.map(async (res) => {
        const base64Data = res['LOGO'];
        //const base64Logo = logoBlob ? await this.byteArrayToBase64(logoBlob) : 'assets/databases/No_Image_Available.jpg';
        const base64Logo = `data:image/*;base64,${base64Data}`;
        // Very good choice,Credibility 3/3,Environment 3/3,Socio-Economic 0/3
        let evaluation = 'N/A;N/A;N/A';
        if(res['Siegelklarheit'] && res['Siegelklarheit'] !== 'Not assessed') {
          const splitedRanking = res['Siegelklarheit'].split('\n');
          evaluation = `${splitedRanking[1].split(' ')[1]};${splitedRanking[2].split(' ')[1]};${splitedRanking[3].split(' ')[1]}`;
        }        
        const newLabel: Label = {
          logo: base64Logo,
          name: res['NAME'],
          establishmentYear: res['YEAR OF EST.'],
          description: res['DESCRIPTION'],
          shortDescription: res['USER-FRIENDLY DESCRIPTION'],
          category: res['CATEGORY'],
          subCategory: res['SUB-CATEGORY'],
          country: res['COUNTRY'],
          keywords: res['KEY WORDS'],
          mainColor: res['MAIN COLOR'],
          shape: res['SHAPE'],
          conformityAssesment: res['CONFORMITY ASSESSMENT'],
          managingOrganization: res['MANAGING ORGANIZATION'],
          website: res['WEBSITE'],
          ranking: evaluation
        };
        return newLabel;
      }));
      return labels;
    }
    

    

}



