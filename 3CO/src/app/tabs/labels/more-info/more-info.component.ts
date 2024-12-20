import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Label } from 'src/app/shared/models/label';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent  implements OnInit {

  @Input() label!: Label;
  @Input() isScanInfo?: boolean = false;
  @Output() deselectLabel = new EventEmitter<{
    deselectLabel: boolean,
    backToScanInfo: boolean}>();

  constructor() { }

  ngOnInit() {
    
    console.log('More info label ranking: ', this.label.ranking);
    console.log('Splitted ranking: ', JSON.stringify(this.label.ranking.split(';')));
  }

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
    if(this.isScanInfo) {
      this.deselectLabel.emit({deselectLabel:true,backToScanInfo:true});
    } else{
      this.deselectLabel.emit({deselectLabel:true,backToScanInfo:false});
    }

  }

}
