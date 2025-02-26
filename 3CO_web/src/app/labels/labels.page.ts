import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Label } from '../shared/models/label';
import { Router } from '@angular/router';
import { LabelSQLiteHandlerService } from '../shared/services/SQLite/label-sqlite-handler.service';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { MoreInfoComponent } from '../shared/components/more-info/more-info.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.page.html',
  styleUrls: ['./labels.page.scss'],
  standalone: false
})
export class LabelsPage implements OnInit, ViewDidEnter {

  public isLabelSelected = false;
  public detectedLabels: Label[] = [];
  public isScanInfo: boolean = false;
  public selectedLabelForMoreInfo!: Label;
  public unlockedBadgesNow: {badgeCategory: string, badgeType: string, rewardImage: string}[] = [];
  
  private isModalOpen: boolean;
  private labelsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isResultModalOpen: boolean = false;
  private receivedBase64Image: string = '';
  private randomLabel!: Label;


  constructor(
    private router: Router,
    private labelService: LabelSQLiteHandlerService,
    private modalController: ModalController
  ) {
    this.isModalOpen = false;
    if(!this.labelsLoaded.value) {
      this.labelService.getRandomLabel();
      this.labelsLoaded.next(true);
    } else { 
      console.log('labels already loaded');
    }
  }

  /**
   * GETTERS & SETTERS
   */
  get resultImage() {
    return `data:image/*;base64,${this.receivedBase64Image}`;
  }
  get resultModalTrigger() {
    return this.isResultModalOpen;
  }
  set setResultModalTrigger(bool: boolean) {
    this.isResultModalOpen = bool;
  }


  get modalIsOpen() {
    return this.isModalOpen;
  }

  get featuredLabel$(): Observable<Label|null> {
    return this.labelService.featuredLabel$;
  }

  async ngOnInit() {
    /* console.log('Entering LabelsPage NgOnInit');
    if(!this.labelsLoaded.value) {
      await this.labelService.initializeDatabase();
      this.labelsLoaded.next(true);
    } else { 
      console.log('labels already loaded');
    } */
  }

  ngAfterViewInit(): void {
    console.log('Entering LabelsPage afterViewInit');
  }

  async ionViewDidEnter() {
    try{
      console.log('--------- Labels Page before setting random label');
      //this.setRandomLabel();
    } catch(err) {
      console.error(err);
    }
  }


  public dismissResultModal() {
    this.isResultModalOpen = false;
  }

  public async showMoreLabelInfo(label: Label) {
      const modal = await this.modalController.create({
        component: MoreInfoComponent,
        componentProps: {
          label: label
        },
        showBackdrop: true,
        backdropDismiss: true
      });
  
      await modal.present();
  }


  

  public dismissMoreInfo(ev: any) {
    this.isLabelSelected = false;
    console.log('------------- trying to dissmiss modal:',JSON.stringify(ev))
    if(ev.backToScanInfo){
      this.isScanInfo = true;
      this.isResultModalOpen = true;
    } else { 
      this.isScanInfo = false;
    }
  }

  public seeMoreLabels() {
      this.router.navigate(['labels/label-list']);
  }


  /* private setRandomLabel() {
    this.randomLabel = this.labelService.featuredLabel[0];
    this.featuredLabel['logo'] = this.featuredLabel?.logo ?? '/assets/databases/No_Image_Available.jpg'
  } */





}
