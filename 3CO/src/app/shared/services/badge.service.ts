// badge.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private badgePaths: any = {
    'waste_management': {
      'silver': 'assets/badges/waste_management_silver.png',
      'golden': 'assets/badges/waste_management_golden.png',
      'bronze': 'assets/badges/waste_management_bronze.png'
    },
    'various': {
      'silver': 'assets/badges/various_silver.png',
      'golden': 'assets/badges/various_golden.png',
      'bronze': 'assets/badges/various_bronze.png'
    },
    'transport': {
      'silver': 'assets/badges/transport_silver.png',
      'golden': 'assets/badges/transport_golden.png',
      'bronze': 'assets/badges/transport_bronze.png'
    },
    'textiles': {
      'silver': 'assets/badges/textile_silver.png',
      'golden': 'assets/badges/textile_golden.png',
      'bronze': 'assets/badges/textile_bronze.png'
    },
    'services': {
      'silver': 'assets/badges/services_silver.png',
      'golden': 'assets/badges/services_golden.png',
      'bronze': 'assets/badges/services_bronze.png'
    },
    'resources': {
      'silver': 'assets/badges/resources_silver.png',
      'golden': 'assets/badges/resources_golden.png',
      'bronze': 'assets/badges/resources_bronze.png'
    },
    'paper': {
      'silver': 'assets/badges/paper_silver.png',
      'golden': 'assets/badges/paper_golden.png',
      'bronze': 'assets/badges/paper_bronze.png'
    },
    'industry': {
      'silver': 'assets/badges/industry_silver.png',
      'golden': 'assets/badges/industry_golden.png',
      'bronze': 'assets/badges/industry_bronze.png'
    },
    'furniture': {
      'silver': 'assets/badges/furniture_silver.png',
      'golden': 'assets/badges/furniture_golden.png',
      'bronze': 'assets/badges/furniture_bronze.png'
    },
    'forest': {
      'silver': 'assets/badges/forest_silver.png',
      'golden': 'assets/badges/forest_golden.png',
      'bronze': 'assets/badges/forest_bronze.png'
    },
    'energy': {
      'silver': 'assets/badges/electronics_silver.png',
      'golden': 'assets/badges/electronics_golden.png',
      'bronze': 'assets/badges/electronics_bronze.png'
    },
    'personal_care': {
      'silver': 'assets/badges/cosmetics_silver.png',
      'golden': 'assets/badges/cosmetics_golden.png',
      'bronze': 'assets/badges/cosmetics_bronze.png'
    },
    'cleaning_products': {
      'silver': 'assets/badges/cleaning_products_silver.png',
      'golden': 'assets/badges/cleaning_products_golden.png',
      'bronze': 'assets/badges/cleaning_products_bronze.png'
    },
    'building': {
      'silver': 'assets/badges/buildings_silver.png',
      'golden': 'assets/badges/buildings_golden.png',
      'bronze': 'assets/badges/buildings_bronze.png'
    },
    'appliances': {
      'silver': 'assets/badges/appliances_silver.png',
      'golden': 'assets/badges/appliances_golden.png',
      'bronze': 'assets/badges/appliances_bronze.png'
    },
    'food': {
      'silver': 'assets/badges/food_silver.png',
      'golden': 'assets/badges/food_golden.png',
      'bronze': 'assets/badges/food_bronze.png'
    }
  };

  constructor(private http: HttpClient) {}

  getBadgeImage(badgeCategory: string, badgeType: string): string {
    // Format category and type strings to match keys
    const formattedCategory = badgeCategory.toLowerCase().replace(' ', '_').trim();
    const formattedType = badgeType.toLowerCase().trim();
    console.log('------- Badge Service: ', formattedCategory, formattedType, this.badgePaths[formattedCategory]?.[formattedType]);
    // Find the correct image path or return a default/fallback image
    return this.badgePaths[formattedCategory]?.[formattedType] ?? this.badgePaths['various'][formattedType];
  }

  
}


export interface Badge {
  badge_category: string;
  badge_type: string;
  unlocked_at: string
}