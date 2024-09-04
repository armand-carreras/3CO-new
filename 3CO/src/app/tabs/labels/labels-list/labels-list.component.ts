import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription, tap } from 'rxjs';
import { Label } from 'src/app/shared/models/label';
import { User } from 'src/app/shared/models/user';
import { LabelSQLiteHandlerService } from 'src/app/shared/services/SQLite/label-sqlite-handler.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.scss'],
})
export class LabelsListComponent  implements OnInit, OnDestroy {

  public user!: User;
  public labelsReady: boolean = false;
  private labels: Label[] = [];
  private orderedLabels = new Map<string, Label[]>();


  private subscribers: Subscription[] = [];

  constructor(
    private labelsService: LabelSQLiteHandlerService,
    private userService: UserService
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


  public handleSearchBarInput(ev: any) {
    console.log(ev);
  }


  private fetchAllLabels() {
    const subscriber = this.labelsService.fetchAll()
    .pipe(
      tap(labels=>{
        console.log(labels);
        this.labels = labels;
      })
    ).subscribe();

    this.subscribers.push(subscriber);
  }

  
}
