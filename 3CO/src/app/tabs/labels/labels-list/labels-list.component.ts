import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { firstValueFrom, Subscription, tap } from 'rxjs';
import { CATEGORIES, ColorList, Label } from 'src/app/shared/models/label';
import { User } from 'src/app/shared/models/user';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { UserService } from 'src/app/shared/services/user.service';



@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.scss'],
  
})
export class LabelsListComponent  implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;

  public user!: User;
  public labelsReady: boolean = false;
  public shapes: string[] = ['square', 'rectangle', 'circle', 'triangle', 'hexagon', 'octagon'];
  public colours: string[] = ColorList;
  public categories = [
    { name: 'Electronics', icon: 'hardware-chip-outline' },
    { name: 'Cosmetics', icon: 'nuclear-outline' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Matresses', icon: 'bed-outline' },
    { name: 'Global', icon: 'globe-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Chemicals', icon: 'flask-outline' },
    { name: 'Energy', icon: 'flash-outline' }
  ];

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
    Chemicals: [],
    Energy: [],
    Others: []
  };


  private labels: Label[] = [];

  private allGroupedLabels = this.groupedLabels;

  private subscribers: Subscription[] = [];

  constructor(
    private labelsService: LabelSQLiteHandlerService,
    private userService: UserService,
    private router: Router,
    private zone: NgZone
  ) { 
  }
  
  get allLabels() {
    return this.labels;
  }

  
  async ngOnInit() {
    await firstValueFrom(this.userService.getUser().pipe(tap(user=>this.user=user)));
    this.fetchAllLabels();
    
  }
  
  ngOnDestroy() {
    this.subscribers.forEach(subs=>subs.unsubscribe());
  }
  
  public isGroupCategoryEmpty(category: string) {
    if(this.groupedLabels[category].length>0) {
      return false;
    }
    else return true;

  }

  public async handleSearchBarInput(ev: any) {
    if(ev!==''){
      const labels = await this.labelsService.getFromNameString(ev.detail.value);
      this.emptyGroupedLabels()
      this.groupLabelsByCategory(labels, false);
    } else {
      this.groupedLabels = this.allGroupedLabels;
    }

  }

  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/labels']);
  }

  public selectForMoreInfo(label: Label) {
    this.selectedLabel = label;
    this.isLabelSelected = true;
    //console.log('-----------Selected Label : ', JSON.stringify(label));
  }

  public dismissMoreInfo(event: any) {

    console.log('------------ goBack', event);
    this.zone.run(()=> { 
      this.isLabelSelected = false;
      this.selectedLabel = {
        logo: '',
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
    if(this.selectedCategories.length>0 || this.selectedColours.length>0 || this.selectedShapes.length>0) {
      const labels = await this.labelsService.getFilteredLabels(this.selectedShapes, this.selectedColours, this.selectedCategories);
      this.emptyGroupedLabels()
      this.groupLabelsByCategory(labels, false);
    } else {
      this.groupedLabels = this.allGroupedLabels;
    }
    // Close modal after applying filters
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


  private fetchAllLabels() {
    const subscriber = this.labelsService.fetchAll()
    .pipe(
      tap(labels=>{
        this.labels = labels;
        this.groupLabelsByCategory(labels, true);
      })
    ).subscribe();

    this.subscribers.push(subscriber);
  }

  
  // Group the labels by their valid category
  private groupLabelsByCategory(labels: Label[], allLabels: boolean) {
    labels.forEach((label, index)=>{      
        if(label.category?.toLowerCase().includes('electronics')) {
          this.groupedLabels.Electronics = [...this.groupedLabels.Electronics ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('cosmetics')) {
          this.groupedLabels.Cosmetics = [...this.groupedLabels.Cosmetics ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('industry')) {
          this.groupedLabels.Industry = [...this.groupedLabels.Industry ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('building')) {
          this.groupedLabels.Building = [...this.groupedLabels.Building ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('matresses')) {
          this.groupedLabels.Matresses = [...this.groupedLabels.Matresses ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('global')) {
          this.groupedLabels.Global = [...this.groupedLabels.Global ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('food')) {
          this.groupedLabels.Food = [...this.groupedLabels.Food ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('chemicals')) {
          this.groupedLabels.Chemicals = [...this.groupedLabels.Chemicals ?? [], label];
          console.log('newItem Added');
        }
        else if(label.category?.toLowerCase().includes('energy')) {
          this.groupedLabels.Energy = [...this.groupedLabels.Energy ?? [], label];
          console.log('newItem Added');
        }
        if(allLabels && index === labels.length-1) {
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
      Chemicals: [],
      Energy: [],
      Others: []
    }
  }
  
}
