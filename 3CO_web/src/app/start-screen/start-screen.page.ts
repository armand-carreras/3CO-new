import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.page.html',
  styleUrls: ['./start-screen.page.scss'],
})
export class StartScreenPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigateToAuth() {
    this.router.navigateByUrl('/auth/login',{replaceUrl:true});
  }

}
