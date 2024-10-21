import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { firstValueFrom, Subscription, tap } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit, ViewWillEnter, ViewWillLeave {

  public user!: User;
  public categories: any[] = [
    { name: 'Courses', icon: 'school-outline'},
    { name: 'Factsheets', icon: 'newspaper-outline'},
    { name: 'Training', icon: 'library-outline' },
    { name: 'Videos', icon: 'play-outline' },
  ];

  groupedLinks: {
    [key: string]: {name:string, url:string}[]
  } = {
    Courses: [
      {name: 'Innovation, Economics and Strategic Management in the Bioeconomy',url:'https://elearning.relief.uop.gr/enrol/coursepreviewer.php?id=4'},
      {name: 'Circular Economy',url:'https://elearning.relief.uop.gr/enrol/coursepreviewer.php?id=27'},
      {name: 'Discovering the potential of biorefineries',url:'https://elearning.relief.uop.gr/enrol/coursepreviewer.php?id=28'},
      {name: 'Bioenergy and energy crops',url:'https://elearning.relief.uop.gr/enrol/coursepreviewer.php?id=29'},
      {name: 'SCALE-UP Free Online Training for a Sustainable Economy',url:'https://www.scaleup-bioeconomy.eu/en/trainings/'},
      {name: 'Introduction to Sustainable Bioeconomy',url:'https://www.futurelearn.com/courses/society-and-bioeconomy'},
      {name: 'Bioeconomy: How Renewable Resources Can Help the Future of Our Planet',url:'https://www.futurelearn.com/courses/what-could-a-biobased-economy-mean-for-the-future-health-of-our-planet-'},
      {name: 'Concepts of Sustainable Bioeconomy',url:'https://iversity.org/en/courses/concepts-of-sustainable-bioeconomy'},
    ],
    Factsheets: [
      {name: 'GENB Project',url:'https://genb-project.eu/app/uploads/2024/10/Preview_Factsheets_AUSTRIA_GENB_SG_20231026_2.pdf'},
    ],
    Training: [
      {name: 'Fairy tale – The apple’s dream',url:'https://genb-project.eu/genb_toolkit/fairy-tale-the-apples-dream/'},
      {name: 'Eco-Schools and Bioeconomy',url:'https://genb-project.eu/app/uploads/2024/10/10-min-Section-on-Eco-Schools_3.pdf'},
      {name: 'Lesson plan for multipliers',url:'https://genb-project.eu/genb_toolkit/lesson-plan-for-multipliers/'},
    ],
    Videos: [
      {name: 'Careers in Bio-based Materials',url:'https://www.youtube.com/watch?v=1u0-r7Cw4DI&t=3s'},
      {name: 'A Day in a Biorefinery',url:'https://youtube.com/watch?v=QAZX6JTfMNA'},
      {name: "What's bioeconomy from the GenB Ambassadors",url:'https://www.youtube.com/watch?v=i5_8JcMGwe0'},
      {name: 'What is the Bioeconomy?',url:'https://www.youtube.com/watch?v=hx-jZmE-2_U'},
    ],
  };

  private subscriptions: Subscription[] = [];



  constructor(private router: Router, private userService: UserService, private sanitizer: DomSanitizer) { }

  async ngOnInit() {  
    await firstValueFrom(this.userService.getUser().pipe(tap(user=>this.user=user)));
  }

  ionViewWillEnter() {
    this.subscribeToUser();
  }
  ionViewWillLeave(): void {
    this.destroySubscriptions()
  }

  public sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Example of setting sanitized URLs
  public setIframeUrl(url: string) {
    return this.sanitizeUrl(url);
  }

  public isGroupCategoryEmpty(category: string) {
    if(this.groupedLinks[category].length>0) {
      return false;
    }
    else return true;

  }
  public goToProfile(){
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/labels']);
  }



  private async subscribeToUser() {
    await this.userService.getUser().pipe(tap(user=>this.user=user)).subscribe();
  }

  private destroySubscriptions() {
    this.subscriptions.forEach((sub)=>sub.unsubscribe());
  }
}
