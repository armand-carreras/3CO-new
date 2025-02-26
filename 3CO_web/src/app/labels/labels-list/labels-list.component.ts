import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController, ViewWillEnter } from '@ionic/angular';
import { ColorList, Label } from 'src/app/shared/models/label';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { MoreInfoComponent } from 'src/app/shared/components/more-info/more-info.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.scss'],
  standalone: false
  
})
export class LabelsListComponent  implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;

  public labelsReady: boolean = false;
  public isModalOpen: boolean = false;
  public shapes: string[] = ['square', 'rectangle', 'circle', 'triangle', 'hexagon', 'octagon'];
  public colours: string[] = ColorList;
  public categories = [
    { name: 'Electronics', icon: 'hardware-chip-outline' },
    { name: 'Cosmetics', icon: 'nuclear-outline' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Matresses', icon: 'bed-outline' },
    { name: 'Global', icon: 'globe-outline' },
    { name: 'Textile', icon: 'shirt-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Chemicals', icon: 'flask-outline' },
    { name: 'Energy', icon: 'flash-outline' },
    { name: 'Other', icon: 'balloon-outline' }
  ];
  public searchTerm: string = '';

  // Arrays to store selected items
  selectedShapes: string[] = [];
  selectedColours: string[] = [];
  selectedCategories: string[] = [];

  //Selected Label to get more info
  isLabelSelected: boolean = false;
  selectedLabel!: Label;

  groupedLabels: {
    [key: string]: Label[];  // Add index signature to allow string keys
    Electronics: Label[];
    Cosmetics: Label[];
    Industry: Label[];
    Building: Label[];
    Matresses: Label[];
    Global: Label[];
    Food: Label[];
    Textile: Label[];
    Chemicals: Label[];
    Energy: Label[];
    Others: Label[];
  } = {
    Electronics: [],
    Cosmetics: [],
    Industry: [],
    Building: [],
    Matresses: [],
    Global: [],
    Food: [],
    Textile:[],
    Chemicals: [],
    Energy: [],
    Others: []
  };


  private labels: Label[] = [];
  private labelSubscription!: Subscription;
  private allGroupedLabels = this.groupedLabels;


  constructor(
    private labelsService: LabelSQLiteHandlerService,
    private router: Router,
    private zone: NgZone,
    private modalController: ModalController
  ) { 
    
  }
  
  /* get allLabels() {
    return this.labels;
  } */

  
  async ngOnInit() {
    console.log('NgOnInit labels-init');
    await this.fetchAllLabels();
  }


  ionViewDidEnter() {
    this.modal.dismiss();
    this.modal.willDismiss.subscribe(()=>{this.isModalOpen=false})
  }
  
  ngOnDestroy() {
    this.labelSubscription?.unsubscribe();
  }

  toggleFilter() {
    this.isModalOpen = true;
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
    console.log('dismissing filter', JSON.stringify(event));
  }
  
  public isGroupCategoryEmpty(category: string) {
    if(this.groupedLabels[category]?.length>0) {
      return false;
    }
    else return true;

  }


  public async handleSearchBarInput(ev: any) {
    this.searchTerm = ev.detail.value; // Store search term

    if (
      !this.searchTerm && 
      this.selectedShapes.length === 0 && 
      this.selectedColours.length === 0 && 
      this.selectedCategories.length === 0
  ) {
      this.groupedLabels = this.allGroupedLabels;
      return;
  }
  
    const labels = await this.labelsService.getFilteredAndSearchedLabels(
      this.searchTerm || '',
      this.selectedShapes,
      this.selectedColours,
      this.selectedCategories
    );
  
    this.emptyGroupedLabels();
    this.groupLabelsByCategory(labels, false);
  }

  
  public goToMainPage() {
    this.router.navigate(['/labels']);
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

  public dismissMoreInfo(event: any) {

    console.log('------------ goBack', event);
    this.zone.run(()=> { 
      this.isLabelSelected = false;
      this.selectedLabel = {
        logo: 'assets/databases/No_Image_Available.jpg',
        name: '',
        establishmentYear: '',
        description: '',
        shortDescription: '',
        category: undefined,
        subCategory: '',
        country: '',
        keywords: '',
        mainColor: '',
        shape: '',
        conformityAssesment: '',
        managingOrganization: '',
        website: '',
        ranking: ''
      }
    })
  }

  // Toggle selection of items
  public toggleSelection(item: string, type: string) {
    switch (type) {
      case 'shapes':
        this.toggleItem(this.selectedShapes, item);
        break;
      case 'colours':
        this.toggleItem(this.selectedColours, item);
        break;
      case 'categories':
        this.toggleItem(this.selectedCategories, item);
        break;
    }
  }

  // Helper function to toggle items in an array
  public toggleItem(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
  }

  // Apply filters and close modal
  public async applyFilters() {

    if (
      !this.searchTerm && 
      this.selectedShapes.length === 0 && 
      this.selectedColours.length === 0 && 
      this.selectedCategories.length === 0
  ) {
      this.groupedLabels = this.allGroupedLabels;
      return;
  }

    const labels = await this.labelsService.getFilteredAndSearchedLabels(
      this.searchTerm || '',   // Pass current search term
      this.selectedShapes,
      this.selectedColours,
      this.selectedCategories
    );
  
    this.emptyGroupedLabels();
    this.groupLabelsByCategory(labels, false);
    this.modal.dismiss();
  }

  public clearFilters() {
    this.selectedShapes = [];
    this.selectedColours = [];
    this.selectedCategories = [];
  }

  public getColorBackground(color: string) {
    let result: {[klass: string]: any} = {'background-color': color};
    if( color === 'Brown' ) {
      result = {'background-color': '#754020'};
    }
    else if(color === 'Blue') {
      result = {'background-color': '#214ac4'};
    }
    else if(color === "Gold") {
      result = {'background': 'radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)'};
    }
    return result;
                
  }


  private async fetchAllLabels() {
    try {
      this.labelSubscription = this.labelsService.allLabels.subscribe(labels=>{
        console.log('labels from labels-list', labels);
        this.groupLabelsByCategory(labels, true);
      });
      await this.labelsService.loadAll();
    } catch (error) {
      console.error(error);
    }
  }

  
  // Group the labels by their valid category
  private groupLabelsByCategory(labels: Label[], allLabels: boolean) {
    labels.forEach((label, index)=>{      
        if(label.category?.toLowerCase().includes('electronics')) {
          this.groupedLabels.Electronics = [...this.groupedLabels.Electronics ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('cosmetics')) {
          this.groupedLabels.Cosmetics = [...this.groupedLabels.Cosmetics ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('industry')) {
          this.groupedLabels.Industry = [...this.groupedLabels.Industry ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('building')) {
          this.groupedLabels.Building = [...this.groupedLabels.Building ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('matresses')) {
          this.groupedLabels.Matresses = [...this.groupedLabels.Matresses ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('global')) {
          this.groupedLabels.Global = [...this.groupedLabels.Global ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('food')) {
          this.groupedLabels.Food = [...this.groupedLabels.Food ?? [], label];
        } 
        else if(label.category?.toLowerCase().includes('textile')) {
          this.groupedLabels.Textile = [...this.groupedLabels.Textile ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('chemicals')) {
          this.groupedLabels.Chemicals = [...this.groupedLabels.Chemicals ?? [], label];
        }
        else if(label.category?.toLowerCase().includes('energy')) {
          this.groupedLabels.Energy = [...this.groupedLabels.Energy ?? [], label];
        } else {
          this.groupedLabels.Others = [...this.groupedLabels.Others ?? [], label];
        }
        if(allLabels && index === labels?.length-1) {
          this.allGroupedLabels = this.groupedLabels;
        }
    });
    
  }

  private emptyGroupedLabels() {
    this.groupedLabels = {
      Electronics: [],
      Cosmetics: [],
      Industry: [],
      Building: [],
      Matresses: [],
      Global: [],
      Food: [],
      Textile: [],
      Chemicals: [],
      Energy: [],
      Others: []
    }
  }
  
}
