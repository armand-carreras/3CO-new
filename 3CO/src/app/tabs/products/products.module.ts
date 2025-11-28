import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductFormComponent } from './product-form/product-form.component';
import { RatingComponent } from './rating/rating.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AutoTranslatePipe } from 'src/app/shared/pipes/auto-translate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    TranslatePipe
  ],
  declarations: [ProductsPage, ProductFormComponent, ProductInfoComponent, RatingComponent, AutoTranslatePipe]
})
export class ProductsPageModule { }
