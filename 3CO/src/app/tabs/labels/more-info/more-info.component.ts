import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Label } from 'src/app/shared/models/label';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent  implements OnInit {

  @Input() label!: Label;
  @Output() deselectLabel = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {}

  get ranking1() {
    return this.label.ranking.split(';')[0];
  }

  get ranking2() {
    return this.label.ranking.split(';')[1];
  }

  get ranking3() {
    return this.label.ranking.split(';')[2];
  }

  public goBack() {
    console.log('trying to back from more info');
    this.deselectLabel.emit(true);
    console.log('after trying to back from more info');

  }

}
