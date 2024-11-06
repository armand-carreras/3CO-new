import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent  implements OnChanges {
  @Input() rating: number = 0; // Accepts a number from 0 to 5

  stars: string[] = []; // Array to hold the icon types

  ngOnChanges() {
    this.generateStars();
  }

  private generateStars() {
    this.stars = [];

    const fullStars = Math.floor(this.rating); // Count of full stars
    const hasHalfStar = this.rating % 1 >= 0.5; // Check if there's a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      this.stars.push('star');
    }

    // Add half star if needed
    if (hasHalfStar) {
      this.stars.push('star-half-outline');
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      this.stars.push('star-outline');
    }
  }

}
