import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ProductFormComponent } from './product-form/product-form.component';
import { RatingComponent } from './rating/rating.component';
import { ProductInfoComponent } from './product-info/product-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage, ProductFormComponent, ProductInfoComponent, RatingComponent]
})
export class ProductsPageModule {}
