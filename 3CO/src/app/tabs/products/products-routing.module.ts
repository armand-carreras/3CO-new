import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';
import { ProductFormComponent } from 'src/app/tabs/products/product-form/product-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  },
  {
    path: 'add-product',
    component: ProductFormComponent // Define route for ProductFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
