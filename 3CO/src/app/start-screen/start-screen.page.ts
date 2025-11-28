import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnylangService } from '../shared/services/anylang.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.page.html',
  styleUrls: ['./start-screen.page.scss'],
})
export class StartScreenPage implements OnInit {

  public progress = 0;
  public isModelLoaded = false;

  constructor(
    private router: Router,
    private anylangService: AnylangService
  ) { }

  ngOnInit() {
    // Show loading immediately
    this.progress = 0.1; // Show some initial progress

    this.anylangService.modelDownloadProgress$.subscribe((progress: number) => {
      this.progress = progress / 100; // Ionic progress bar takes 0-1
      if (progress >= 100) {
        this.isModelLoaded = true;
      }
    });

    // Start download/loading
    this.anylangService.init().catch((err: any) => {
      console.error('Model download failed', err);
      // Handle error (maybe show a retry button or allow proceeding without translation)
      this.isModelLoaded = true; // Allow proceeding even if failed, to not block app
    });
  }


  navigateToAuth() {
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

}
