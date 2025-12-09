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
  public loading = false;
  public isModelLoaded = false;

  constructor(
    private router: Router,
    private anylangService: AnylangService
  ) { }

  async ngOnInit() {
    await this.initializeLocalTranslation();
  }


  navigateToAuth() {
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }


  public async initializeLocalTranslation() {
    const isLoaded = await this.anylangService.isModelLoaded();
    console.log('----- StartScreenPage: Model loaded:', isLoaded);
    if (isLoaded) {
      this.isModelLoaded = true;
      this.progress = 1;
      // Initialize silently to ensure model is in memory
      // this.anylangService.init().catch(err => console.error('Silent init failed', err));
    } else {
      this.loading = true;
      this.anylangService.modelDownloadProgress$.subscribe((progress: number) => {
        this.progress = progress / 100; // Ionic progress bar takes 0-1
        if (progress >= 100) {
          this.isModelLoaded = true;
          this.loading = false;
        }
      });

      // Start download/loading
      this.anylangService.init().catch((err: any) => {
        console.error('Model download failed', err);
        // Handle error (maybe show a retry button or allow proceeding without translation)
        this.isModelLoaded = true; // Allow proceeding even if failed, to not block app
      });
    }
  }

}
